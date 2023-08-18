import { set, compose } from "@mapstore/utils/ImmutableUtils";
import {
    SET_ACTIVE_TAB,
    SET_FEATURE,
    SETUP,
    CLOSE,
    SET_RESPONSE,
    SET_LAYER,
} from "../actions/actions";

const initialState = {
    pluginCfg: {},
    visible: false,
    tabs: [{}],
    layer: "",
    tab: 0,
    fields: [],
    documents: {
        ids: [],
        documents: [],
    },
    feature: null,
    activate: false,
    docsManager: false,
    response: null,
};

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case SET_FEATURE:
            return set("feature", action?.feature, state);
        case SET_LAYER:
            return set("layer", action?.layer.label, state);
        case SET_RESPONSE:
            return set("response", action?.response, state);
        case SET_ACTIVE_TAB:
            return set("tab", action.index, state);
        case SETUP:
            return set("pluginCfg", action.cfg, state);
        case CLOSE:
            return compose(
                set("feature", null),
                set("response", null),
                set("tab", 0),
                set("layer", "")
            )(state);
        default:
            return state;
    }
}
