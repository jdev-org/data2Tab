/**
 * Component to create tabs and manage tab selection
 */
import { connect } from "react-redux";
import { setActiveTab } from "@js/extension/stateManagement/actions/actions";
import {
    getTabFields,
    getFeature,
    getTabsList,
} from "@js/extension/stateManagement/selector/selector";
import React from "react";
import { Tabs as BootstrapTabs, Tab } from "react-bootstrap";
import Message from "@mapstore/plugins/locale/Message";

const component = ({
    tabs = [],
    tab = 1,
    featureId,
    onClick = () => { }
}) => {
    if (!featureId) {
        return <Message msgId="d2t.noFeature"/>
    }
    return <BootstrapTabs defaultActiveKey={tab} id="uncontrolled-tab-example">
        {tabs.map((tab, n) => (
            <Tab
                key={n}
                onClick={() => onClick(n)}
                eventKey={n}
                title={tab}
            ></Tab>
        ))}
    </BootstrapTabs>
};

export default connect(
    (state) => ({
        tabs: getTabsList(state),
        fields: getTabFields(state),
        // fields: getFields(state),
        featureId: getFeature(state)?.properties?.id
    }),
    {
        onClick: setActiveTab,
    }
)(component);
