import * as Rx from "rxjs";
import { isEmpty } from "lodash";
// mapstore actions
import { layersSelector } from "@mapstore/selectors/layers";

import { CLICK_ON_MAP } from "@mapstore/actions/map";

import { layerRequest } from "../utils";

import {
    purgeMapInfoResults,
    hideMapinfoMarker,
} from "@mapstore/actions/mapInfo";

import {
    getAuthLevel,
    getLayers,
    getLayer,
    isActive,
    getFeature,
} from "../selector/selector";
import {
    displayD2tMarker,
    displayMsg,
    setFeature,
    SET_LAYER,
    setLayer,
    setResponse,
} from "../actions/actions";
import { getFeatureInfo } from "@mapstore/api/identify";
import { CHANGE_DRAWING_STATUS } from "@mapstore/actions/draw";
import {
    drawerEnabledControlSelector,
    measureSelector,
} from "@mapstore/selectors/controls";

export const onDrawStatusChange = (action$, store) => {
    return action$.ofType(CHANGE_DRAWING_STATUS).switchMap((action) => {
        return Rx.Observable.empty();
    });
};

export const clickMap = (action$, store) => {
    return action$
        .ofType(CLICK_ON_MAP)
        .filter(
            () =>
                isActive(store.getState()) &&
                getAuthLevel(store.getState() & getLayers(store.getState()))
        )
        .filter(
            () =>
                !drawerEnabledControlSelector(store.getState()) &&
                !measureSelector(store.getState())
        )
        .switchMap((action) => {
            let state = store.getState();

            let layersFromCfg = getLayers(state);
            let tocLayers = layersSelector(state);
            let requestLayers = tocLayers.filter(
                (layer) =>
                    layersFromCfg.includes(layer.name) && layer.visibility
            );
            let requestsInfos = requestLayers.map((tocLayer) =>
                layerRequest(action.point, tocLayer, store.getState())
            );
            // else get feature infos
            return Rx.Observable.from(requestsInfos)
                .map((r) =>
                    Rx.Observable.defer(() =>
                        getFeatureInfo(r.url, r.request, r.layer, {})
                    )
                )
                .toArray()
                .switchMap((requestArray, i) => {
                    return Rx.Observable.forkJoin(requestArray).flatMap(
                        (elementArray) => {
                            let featuresByConfigLayer = requestsInfos.map(
                                (x, i) => [x.name, elementArray[i]?.features]
                            );
                            featuresByConfigLayer =
                                featuresByConfigLayer.filter(
                                    (x) => x[1].length
                                );
                            let features = [];
                            let defaultListLayerVal = { label: "" };
                            if (!isEmpty(featuresByConfigLayer)) {
                                features = featuresByConfigLayer;
                                let listLayersName = featuresByConfigLayer.map(
                                    (x) => x[0]
                                );
                                defaultListLayerVal.label =
                                    listLayersName.filter(
                                        (l) => l == getLayer(state)
                                    )[0] || listLayersName[0];
                            }

                            return Rx.Observable.of(
                                purgeMapInfoResults(),
                                hideMapinfoMarker(),
                                setResponse(features),
                                setLayer(defaultListLayerVal),
                                displayD2tMarker(action?.point),
                                displayMsg(
                                    "success",
                                    "Recherche",
                                    "Informations récupérées !"
                                )
                            );
                        }
                    );
                });
        });
};

export const onSetLayer = (action$, store) => {
    return action$
        .ofType(SET_LAYER)
        .filter(
            () => isActive(store.getState()) && getAuthLevel(store.getState())
        )
        .switchMap((action) => {
            const feature = getFeature(store.getState());
            return Rx.Observable.of(setFeature(feature));
        });
};
