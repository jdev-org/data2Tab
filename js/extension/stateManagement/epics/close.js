import Rx from "rxjs";
import {
    toggleMapInfoState,
} from "@mapstore/actions/mapInfo";
import { CONTROL_NAME, D2T_MARKER_LAYER_ID } from "../../constants";
import { get } from "lodash";
import { TEAR_DOWN_D2T } from "../actions/actions";
import { removeAdditionalLayer } from "@mapstore/actions/additionallayers";


/**
 * Manage mapstore toolbar layout
 * @param {any} action$
 * @param {any} store
 * @returns
 */
export const d2tTearDown = (action$, {getState = ()=>{}}) =>
    action$.ofType(TEAR_DOWN_D2T).switchMap(() =>
        Rx.Observable.from([
            removeAdditionalLayer({id: D2T_MARKER_LAYER_ID, owner: CONTROL_NAME}),
        ]).concat([...(!get(getState(), "mapInfo.enabled") ? [toggleMapInfoState()] : [])]));

