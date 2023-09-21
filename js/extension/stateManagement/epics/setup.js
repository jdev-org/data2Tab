import Rx from "rxjs";
import {
    UPDATE_MAP_LAYOUT,
    updateMapLayout,
} from "@mapstore/actions/maplayout";
import { updateUserPlugin } from "@mapstore/actions/context";
import { updateAdditionalLayer } from "@mapstore/actions/additionallayers";

import {
    toggleMapInfoState,
    purgeMapInfoResults,
    hideMapinfoMarker,
} from "@mapstore/actions/mapInfo";
import { isActive } from "../selector/selector";
import { PANEL_SIZE, CONTROL_NAME, D2T_MARKER_LAYER_ID } from "../../constants";
import { SETUP } from "../actions/actions";
import { get } from "lodash";

import { registerEventListener } from "@mapstore/actions/map";
import { defaultIconStyle } from "@mapstore/utils/SearchUtils";
import iconUrl from "@mapstore/components/map/openlayers/img/marker-icon.png";

const OFFSET = PANEL_SIZE;
/**
 * Manage mapstore toolbar layout
 * @param {any} action$
 * @param {any} store
 * @returns
 */
export const setTbarPosition = (action$, store) =>
    action$
        .ofType(UPDATE_MAP_LAYOUT)
        .filter(() => isActive(store.getState()))
        .filter(({ source }) => {
            return source !== CONTROL_NAME;
        })
        .map(({ layout }) => {
            const action = updateMapLayout({
                ...layout,
                right: OFFSET + (layout?.boundingSidebarRect?.right ?? 0),
                boundingMapRect: {
                    ...(layout.boundingMapRect || {}),
                    right: OFFSET + (layout?.boundingSidebarRect?.right ?? 0),
                },
                rightPanel: true,
            });
            return { ...action, source: CONTROL_NAME }; // add an argument to avoid infinite loop.
        });
/**
 * Create additional layers
 * @param {*} action$
 * @param {*} store
 * @returns
 */
export const initMap = (action$, store) =>
    action$
        .ofType(SETUP)
        .filter((action) => isActive(store.getState()))
        .switchMap((action) => {
            const mapInfoEnabled = get(store.getState(), "mapInfo.enabled");
            let defaultStyle = {
                ...defaultIconStyle,
                iconUrl: iconUrl,
            };
            return Rx.Observable.defer(() => {
                return Rx.Observable.from([
                    updateUserPlugin("Identify", { active: false }),

                    registerEventListener("click", CONTROL_NAME),
                    updateAdditionalLayer(
                        D2T_MARKER_LAYER_ID,
                        CONTROL_NAME,
                        "overlay",
                        {
                            id: D2T_MARKER_LAYER_ID,
                            features: [],
                            type: "vector",
                            name: "d2t_marker_click_map",
                            visibility: true,
                            style: defaultStyle,
                        }
                    ),
                    // disable click info right panel
                ]).concat([
                    ...(mapInfoEnabled
                        ? [
                              toggleMapInfoState(),
                              purgeMapInfoResults(),
                              hideMapinfoMarker(),
                          ]
                        : []),
                ]);
            }).startWith({
                type: "MAP_LAYOUT:UPDATE_DOCK_PANELS",
                name: CONTROL_NAME,
                action: "add",
                location: "right",
            });
        });
