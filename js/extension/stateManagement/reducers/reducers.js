import { set,compose} from '@mapstore/utils/ImmutableUtils';
import {
    SET_ACTIVE_TAB,
    SET_FEATURE,
    SETUP
} from "../actions/actions";

const initialState = {
    pluginCfg: {},
    tabs: [{}],
    tab: "",
    fields: [],
    documents: {
        ids: [],
        documents: [],
    },
    feature: null,
    activate: false,
    docsManager: false,
    properties: [],
};

export default function reducers (state = initialState, action) {
    switch (action.type) {
        case SET_FEATURE:
            const properties = Object.values(action.feature?.properties);
            return compose(
                set('feature', action?.feature),
                set('properties', properties || [])
            )(state);
        case SET_ACTIVE_TAB:
            return set('tab', action.tab, state);
        case SETUP:
            return set('pluginCfg', action.cfg, state);

        default:
            return state;
    }
};
