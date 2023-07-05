import Rx from 'rxjs';
import { UPDATE_MAP_LAYOUT, updateMapLayout } from '@mapstore/actions/maplayout';
import { updateAdditionalLayer, removeAdditionalLayer } from '@mapstore/actions/additionallayers';
import { hideMapinfoMarker, purgeMapInfoResults, toggleMapInfoState } from '@mapstore/actions/mapInfo';
import { isTabou2Activate } from '../selectors/tabou2';
import { PANEL_SIZE, TABOU_VECTOR_ID, TABOU_OWNER, TABOU_MARKER_LAYER_ID } from '../constants';
import { SETUP, CLOSE } from "../actions/actions";
import { get } from "lodash";
import { defaultIconStyle } from "@mapstore/utils/SearchUtils";
import iconUrl from "@mapstore/components/map/openlayers/img/marker-icon.png";

import { CONTROL_NAME } from "../../../constants";

import {
    registerEventListener,
    unRegisterEventListener
} from "@mapstore/actions/map";

const OFFSET = PANEL_SIZE;
/**
 * Manage mapstore toolbar layout
 * @param {any} action$
 * @param {any} store
 * @returns
 */
export const setTbarPosition = (action$, store) =>
    action$.ofType(UPDATE_MAP_LAYOUT)
        .filter(() => isTabou2Activate(store.getState()))
        .filter(({ source }) => {
            return source !== 'tabou2';
        })
        .map(({ layout }) => {
            const action = updateMapLayout({
                ...layout,
                right: OFFSET + (layout?.boundingSidebarRect?.right ?? 0),
                boundingMapRect: {
                    ...(layout.boundingMapRect || {}),
                    right: OFFSET + (layout?.boundingSidebarRect?.right ?? 0)
                },
                rightPanel: true
            });
            return { ...action, source: 'tabou2' }; // add an argument to avoid infinite loop.
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
            // disable click info right panel
            ]).concat([...(mapInfoEnabled ? [toggleMapInfoState()] : [])]);
        }).startWith({
            type: 'MAP_LAYOUT:UPDATE_DOCK_PANELS',
            name: 'tabou2',
            action: 'add',
            location: 'right'
        });
    });

export const closeExtension = (action$, {getState = ()=>{}}) =>
    action$.ofType(CLOSE_TABOU).switchMap(() => {
        const mapInfoEnabled = get(getState(), "mapInfo.enabled");
        return Rx.Observable.from([
            unRegisterEventListener("click", CONTROL_NAME),
        // enable click info right panel if needed
        ]).concat([...(!mapInfoEnabled ? [toggleMapInfoState()] : [])]);
    });