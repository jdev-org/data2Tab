import { connect } from "react-redux";

import { isEnabled } from "../stateManagement/selector/selector";
import { CONTROL_NAME, PANEL_SIZE } from "../constants";
import { mapLayoutValuesSelector } from "@mapstore/selectors/maplayout";
import { toggleControl } from "@mapstore/actions/controls";

import ExtensionComponent from "./Component";

import init from "../plugins/init";

import { setup, close } from "../stateManagement/actions/actions";

const compose = (...functions) => args => functions.reduceRight((arg, fn) => fn(arg), args);

export default Main = compose(
    connect((state) => ({
        // active: () => (state.controls && state.controls[CONTROL_NAME] && state.controls[CONTROL_NAME].enabled) || (state[CONTROL_NAME] && state[CONTROL_NAME].closing) || false,
        // enabled: isEnabled(state),
        // messages: state?.locale.messages || {},
        // dockStyle: mapLayoutValuesSelector(state, { right: true, height: true}, true),
        // dockWidth: PANEL_SIZE
    }), {
        // onClose: toggleControl.bind(null, CONTROL_NAME, null),
    }),
    // setup and teardown due to open/close
    compose(
        connect( () => ({}), {
            setup,
            close
        }),
        init()
    )
)(ExtensionComponent);