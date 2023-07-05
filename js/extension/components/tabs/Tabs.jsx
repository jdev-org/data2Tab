/**
 * Component to create tabs and manage tab selection
 */
import { connect } from "react-redux";
import { setActiveTab } from "@js/extension/stateManagement/actions/actions";
import {
    getTab,
    getPluginCfg ,
} from "@js/extension/stateManagement/selector/selector";
import React from "react";
import { Tabs as BootstrapTabs, Tab } from "react-bootstrap";

const component = ({
    tabs = [],
    tab = 1,
    onClick = () => { }
}) => {
    return <BootstrapTabs defaultActiveKey={tab} id="uncontrolled-tab-example">
        {tabs.map((tab, n) => (
            <Tab
                onclick={() => onClick(n + 1)}
                eventKey={n + 1}
                title={tab}
            ></Tab>
        ))}
    </BootstrapTabs>
};

export default connect(
    (state) => ({
        tabs: getPluginCfg(state).tabs,
        tab: getTab(state),
    }),
    {
        onClick: setActiveTab,
    }
)(component);
