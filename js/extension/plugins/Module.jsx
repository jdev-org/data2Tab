import React from "react";

import { connect } from "react-redux";
import { name } from "../../../config";
import { toggleControl } from "@mapstore/actions/controls";
import { mapLayoutValuesSelector } from "@mapstore/selectors/maplayout";
import { createPlugin } from "@mapstore/utils/PluginsUtils";
import ExtensionComponent from "../components/Component";
import { Glyphicon } from "react-bootstrap";
import SidebarElement from "@mapstore/components/sidebarmenu/SidebarElement";

import {
    getDescription,
    getPluginCfg,
    isActive,
    getAuthLevel,
    getResponse,
} from "../stateManagement/selector/selector";

import { CONTROL_NAME, PANEL_SIZE } from "../constants";

import { setup, tearDownD2t } from "../stateManagement/actions/actions";
import * as actions from "../stateManagement/actions/actions";
import init from "./init";
import reducers from "../stateManagement/reducers/reducers";
import "../assets/style.css";
import * as epics from "../stateManagement/epics/epicsDistributor";

const compose = (...functions) => {
    return (args) => functions.reduceRight((arg, fn) => fn(arg), args);
};

const component = compose(
    connect(
        // selectors - mapStateToProps
        (state) => ({
            // selectors
            active: isActive(state),
            icon: getPluginCfg(state)?.icon,
            title: getPluginCfg(state).title,
            description: getDescription(state),
            response: getResponse(state),
            dockStyle: mapLayoutValuesSelector(
                state,
                { right: true, height: true },
                true
            ),
            dockWidth: PANEL_SIZE,
            authorized: getAuthLevel(state),
        }),
        {
            // actions - mapDispatchToProps
            onClose: toggleControl.bind(null, CONTROL_NAME, null),
            ...actions,
        }
    ),
    compose(
        // on setup / close
        connect(() => ({}), {
            setup,
            
        }),
        init()
    )
)(ExtensionComponent);

export default createPlugin(name, {
    component: component,
    reducers: { d2t: reducers },
    epics: { ...epics },
    containers: {
        SidebarMenu: {
            name: CONTROL_NAME,
            position: 10,
            icon: <Glyphicon glyph="list" />,
            tooltip: "extension.tooltip",
            doNotHide: true,
            alwaysVisible: true,
            action: toggleControl.bind(null, CONTROL_NAME, null),
            priority: 1,
            tool: connect(() => ({}), {
                click: toggleControl.bind(null, CONTROL_NAME, null),
            })((props) => {
                return (
                    <SidebarElement bsStyle="tray" onClick={props?.click}>
                        <Glyphicon glyph={props?.pluginCfg?.icon || "sheet"} />
                    </SidebarElement>
                );
            }),
        }
    },
});
