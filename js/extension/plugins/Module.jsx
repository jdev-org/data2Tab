import React from "react";

import { connect } from "react-redux";
import { name } from "../../../config";
import { toggleControl } from "@mapstore/actions/controls";
import { mapLayoutValuesSelector } from "@mapstore/selectors/maplayout";
import { createPlugin } from "@mapstore/utils/PluginsUtils";
import ExtensionComponent from "../components/Component";
import { Glyphicon } from "react-bootstrap";

import {
    getDescription,
    getPluginCfg,
    isActive,
    getFeature,
    getAuthLevel,
} from "../stateManagement/selector/selector";

import { CONTROL_NAME, PANEL_SIZE } from "../constants";

import { setup, close } from "../stateManagement/actions/actions";
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
            icon: getPluginCfg(state).icon,
            title: getPluginCfg(state).title,
            description: getDescription(state),
            isFeature: getFeature(state)?.properties && Object.keys(getFeature(state)?.properties).length,
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
            close,
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
            icon: <Glyphicon glyph="list"/>,
            tooltip: "extension.tooltip",
            doNotHide: true,
            alwaysVisible: true,
            action: toggleControl.bind(null, CONTROL_NAME, null),
            priority: 1,
        },
    },
});
