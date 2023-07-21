import Rx from "rxjs";
import {
    UPDATE_MAP_LAYOUT,
    updateDockPanelsList,
    updateMapLayout,
} from "@mapstore/actions/maplayout";
import { updateUserPlugin } from "@mapstore/actions/context";
import {
    updateAdditionalLayer,
    removeAdditionalLayer,
} from "@mapstore/actions/additionallayers";

import {
    toggleMapInfoState,
    purgeMapInfoResults,
    hideMapinfoMarker,
} from "@mapstore/actions/mapInfo";
import { isActive } from "../selector/selector";
import { PANEL_SIZE, CONTROL_NAME, D2T_MARKER_LAYER_ID } from "../../constants";
import { CLOSE, SETUP } from "../actions/actions";
import { get } from "lodash";

import {
    registerEventListener,
    unRegisterEventListener,
} from "@mapstore/actions/map";
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
    action$.ofType(SETUP).switchMap(() => {
        const mapInfoEnabled = get(store.getState(), "mapInfo.enabled");
        let defaultStyle = {
            ...defaultIconStyle,
            iconUrl: iconUrl,
        };
        return Rx.Observable.defer(() => {
            return Rx.Observable.from([
                purgeMapInfoResults(),
                hideMapinfoMarker(),
                registerEventListener("click", CONTROL_NAME),
                updateUserPlugin("Identify", { active: false }),
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
            ]).concat([...(mapInfoEnabled ? [toggleMapInfoState()] : [])]);
        }).startWith({
            type: "MAP_LAYOUT:UPDATE_DOCK_PANELS",
            name: CONTROL_NAME,
            action: "add",
            location: "right",
        });
    });

export const closeExtension = (action$, store) =>
    action$
        .ofType(CLOSE)
        .filter(() => isActive(store.getState()))
        .switchMap(() => {
            return Rx.Observable.from([
                updateDockPanelsList(CONTROL_NAME, "remove", "right"),
                unRegisterEventListener("click", CONTROL_NAME),
                removeAdditionalLayer({
                    id: D2T_MARKER_LAYER_ID,
                    owner: CONTROL_NAME,
                }),
                // enable click info right panel if needed
            ]);
        });

