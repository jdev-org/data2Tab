/**
 * Component to create tabs and manage tab selection
 */
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import { setActiveTab } from "@js/extension/stateManagement/actions/actions";
import {
    getTabs,
    getTabsList,
    getTab,
    getLayer,
    getResponse,
    getFeatures
} from "@js/extension/stateManagement/selector/selector";
import React from "react";
import {
    Tabs as BootstrapTabs,
    Tab
} from "react-bootstrap";
import "./Tabs.css";
const Tabs = ({
    tabs = [],
    tab = 1,
    fields,
    response,
    layer,
    features,
    onSelect = () => {}
}) => {
    if (isEmpty(response) || !features) {
        return null
    }
    let properties = features[0]?.properties;
    const getValue = (field) =>
        typeof field === "string" ? properties[field] : properties[field[0]];
    const getLabel = (field) => (typeof field === "string" ? field : field[1]);
    const countFields = fields ? fields.length : 0;
    const getFields = (fields) => {
        return fields.filter(field => {
            if (typeof field == "string") {
                return properties.hasOwnProperty(field)   
            } else if(field.length > 2) {
                return field[3] == layer;
            } else {
                return properties.hasOwnProperty(field[0]);
            }
        })
    }
    return (
        <div className="d2t-tab-content">
            <BootstrapTabs
                activeKey={tab}
                id={"d2t-tabs"}
                onSelect={(n) => onSelect(n)}
            >
                {tabs.filter(t => {
                    return getFields(fields[t]).length > 0
                }).map((tabName, n) => (
                    <Tab key={n} eventKey={n} title={tabName}>
                        <table className="table">
                            <tbody>
                                {getFields(fields[tabName])
                                    .map((field, i) => (
                                    <tr>
                                        <td className={`key ${i == 0 ? "first" : ""} ${i == countFields-1 ? "last" : ""}`}>{getLabel(field)}</td>
                                        <td className="value">{getValue(field)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
        response: getResponse(state),
        features: getFeatures(state),
        layer: getLayer(state)
    }),
    {
        onSelect: setActiveTab
    }
)(Tabs);
