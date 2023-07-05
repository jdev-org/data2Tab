import Rx from 'rxjs';
import { UPDATE_MAP_LAYOUT, updateMapLayout } from '@mapstore/actions/maplayout';
import {
    hideMapinfoMarker,
    purgeMapInfoResults,
    toggleMapInfoState,
} from "@mapstore/actions/mapInfo";
import { isActive } from "../selector/selector";
import { PANEL_SIZE, CONTROL_NAME } from "../../constants";

import { CLOSE, SETUP } from "../actions/actions";
import { get } from "lodash";

import {
    registerEventListener,
    unRegisterEventListener,
} from "@mapstore/actions/map";

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
        return Rx.Observable.defer(() => {
            return Rx.Observable.from([
                registerEventListener("click", CONTROL_NAME),
            ]);
            // disable click info right panel
            //]).concat([...(mapInfoEnabled ? [toggleMapInfoState()] : [])]);
        }).startWith({
            type: "MAP_LAYOUT:UPDATE_DOCK_PANELS",
            name: CONTROL_NAME,
            action: "add",
            location: "right",
        });
    });

export const closeExtension = (action$, {getState = ()=>{}}) =>
    action$.ofType(CLOSE).switchMap(() => {
        const mapInfoEnabled = get(getState(), "mapInfo.enabled");
        return Rx.Observable.from([
            unRegisterEventListener("click", CONTROL_NAME),
        // enable click info right panel if needed
        ]).concat([...(!mapInfoEnabled ? [toggleMapInfoState()] : [])]);
    });