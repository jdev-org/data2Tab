/**
 * Component to create tabs and manage tab selection
 */
import { connect } from "react-redux";
import { setActiveTab } from "@js/extension/stateManagement/actions/actions";
import {
    getTabs,
    getFeature,
    getTabsList,
    getTab
} from "@js/extension/stateManagement/selector/selector";
import React from "react";
import {
    Tabs as BootstrapTabs,
    Tab,
    Form,
    FormGroup,
    Col,
    FormControl
} from "react-bootstrap";
import "./Tabs.css";
const Tabs = ({
    tabs = [],
    tab = 1,
    fields,
    properties,
    onSelect = () => {}
}) => {
    const getValue = (field) =>
        typeof field === "string" ? properties[field] : properties[field[0]];
    const getLabel = (field) => (typeof field === "string" ? field : field[1]);
    return (
        <div className="d2t-tab-content">
            <BootstrapTabs
                activeKey={tab}
                id={"d2t-tabs"}
                onSelect={(n) => onSelect(n)}
            >
                {tabs.map((tabName, n) => (
                    <Tab key={n} eventKey={n} title={tabName}>
                        <Form>
                            <FormGroup>
                                {fields[tabName].map((field) => (
                                    <div className="d2t-form-field">
                                        <Col className="d2t-field-label" sm={3}>
                                            {getLabel(field)}
                                        </Col>
                                        <Col className="d2t-field-value" sm={9}>
                                            <FormControl
                                                type="text"
                                                value={getValue(field)}
                                            />
                                        </Col>
                                    </div>
                                ))}
                            </FormGroup>
                        </Form>
                    </Tab>
                ))}
            </BootstrapTabs>
        </div>
    );
};

export default connect(
    (state) => ({
        tabs: getTabsList(state),
        tab: getTab(state),
        fields: getTabs(state),
        featureId: getFeature(state)?.properties?.id,
        properties: getFeature(state)?.properties
    }),
    {
        onSelect: setActiveTab
    }
)(Tabs);
