import * as Rx from "rxjs";
import { get, keys, find, isEmpty, pickBy } from "lodash";
// mapstore actions
import {
    LOAD_FEATURE_INFO,
    FEATURE_INFO_CLICK,
} from "@mapstore/actions/mapInfo";

import { closeIdentify } from "@mapstore/actions/mapInfo";

import { isActive } from "../selector/selector";

// plugin action

// epics
export const clickedFeature = (action$, store) => {
    return action$
        .ofType(LOAD_FEATURE_INFO, FEATURE_INFO_CLICK)
        .filter(() => isActive(store.getState()))
        .switchMap((action) => {
            console.log(action);
            return Rx.Observable.of(closeIdentify());
        });
};
