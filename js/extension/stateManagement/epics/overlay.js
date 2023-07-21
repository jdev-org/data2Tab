import * as Rx from "rxjs";
import { additionalLayersSelector } from "@mapstore/selectors/layers";

import { getPluginCfg, isActive } from "../selector/selector";
import { DISPLAY_D2T_MARKER } from "../actions/actions";
import { CONTROL_NAME, D2T_MARKER_LAYER_ID } from "@js/extension/constants";
import { updateAdditionalLayer } from "@mapstore/actions/additionallayers";

export const showD2tClickMarker = (action$, store) =>
    action$
        .ofType(DISPLAY_D2T_MARKER)
        .filter(
            () =>
                isActive(store.getState()) &&
                getPluginCfg(store.getState()).click.showMarker
        )
        .switchMap(({ point }) => {
            // insert features into layer
            const additionalLayers =
                additionalLayersSelector(store.getState()) ?? [];
            const markerLayer = additionalLayers.filter(
                ({ id }) => id === D2T_MARKER_LAYER_ID
            )?.[0]?.options;
            const feature = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [point?.latlng?.lng, point?.latlng?.lat],
                },
            };
            return Rx.Observable.of(
                updateAdditionalLayer(
                    D2T_MARKER_LAYER_ID,
                    CONTROL_NAME,
                    "overlay",
                    {
                        ...markerLayer,
                        features: [feature],
                    }
                )
            );
        });
