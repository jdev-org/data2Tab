import { connect } from "react-redux";
import { name } from "../../../config";
import { toggleControl } from "@mapstore/actions/controls";
import { mapLayoutValuesSelector } from "@mapstore/selectors/maplayout";
import { createPlugin } from "@mapstore/utils/PluginsUtils";
import ExtensionComponent from "../components/Component";
import { getPluginCfg, isActive } from "../stateManagement/selector/selector";

import { CONTROL_NAME, PANEL_SIZE } from "../constants";

import { setup } from "../stateManagement/actions/actions";
import * as actions from "../stateManagement/actions/actions";
import init from "./init";
import reducers from "../stateManagement/reducers/reducers";
import "../assets/style.css";
import * as epics from "../stateManagement/epics/epicsDistributor";

const compose = (...functions) => {
    return (args) => functions.reduceRight((arg, fn) => fn(arg), args);
};

export default createPlugin(name, {
    component: compose(
        connect(
            // selectors - mapStateToProps
            (state) => ({
                // selectors
                active: isActive(state),
                icon: getPluginCfg(state).icon,
                title: getPluginCfg(state).title,
                description: getPluginCfg(state).description,
                dockStyle: mapLayoutValuesSelector(
                    state,
                    { right: true, height: true },
                    true
                ),
                dockWidth: PANEL_SIZE,
            }),
            {
                // actions - mapDispatchToProps
                onClose: toggleControl.bind(null, CONTROL_NAME, null),
                ...actions,
            }
        ),
        compose(
            connect(() => ({}), {
                setup,
            }),
            init()
        )
    )(ExtensionComponent),
    reducers: { d2t: reducers },
    epics: {...epics},
    containers: {
        SidebarMenu: {
            name: CONTROL_NAME,
            position: 10,
            tooltip: "d2t.tooltip",
            text: "d2t",
            doNotHide: true,
            alwaysVisible: true,
            action: toggleControl.bind(null, CONTROL_NAME, null),
            priority: 1,
        },
    },
});
