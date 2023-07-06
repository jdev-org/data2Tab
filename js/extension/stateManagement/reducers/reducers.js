import { set,compose} from '@mapstore/utils/ImmutableUtils';
import {
    SET_ACTIVE_TAB,
    SET_FEATURE,
    SETUP
} from "../actions/actions";

const initialState = {
    pluginCfg: {},
    tabs: [{}],
    tab: 0,
    fields: [],
    documents: {
        ids: [],
        documents: [],
    },
    feature: null,
    activate: false,
    docsManager: false,
};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case SET_FEATURE:
            return set("feature", action?.feature, state);
        case SET_ACTIVE_TAB:
            return set("tab", action.index, state);
        case SETUP:
            return set("pluginCfg", action.cfg, state);
        default:
            return state;
    }
};
