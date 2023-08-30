import React from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { getPlugins } from "../../../stateManagement/selector/selector";

import ToolsContainer from "@mapstore/plugins/containers/ToolsContainer";
import Tool from "../tool/tool";

import { ButtonGroup } from "react-bootstrap";

/**
 * Custom drop down for identify panel
 * @param {any} param
 * @returns component
 */

const ToolsBar = ({
    plugins,
    className = "navbar-dx shadow",
    mapType = "openlayers",
    style = {},
    containerWrapperStyle = {},
    id = "d2t-tolsbar",
}) => {
    if (isEmpty(plugins)) return null;
    let getPanels = () => {
        return plugins
            .filter((item) => item.tools)
            .reduce((previous, current) => {
                return previous.concat(
                    current.tools.map((tool, index) => ({
                        name: current.name + index,
                        panel: tool,
                        cfg: current?.cfg?.toolsCfg?.[index] || {},
                    }))
                );
            }, []);
    };
    let getTools = () => {
        return plugins.sort((a, b) => a.position - b.position);
    };
    return (
        <ToolsContainer
            id={id}
            className={className}
            mapType={mapType}
            container={(props) => <ButtonGroup>{props.children}</ButtonGroup>}
            toolStyle="primary"
            activeStyle="default"
            tool={Tool}
            stateSelector="d2t"
            tools={getTools()}
            panels={getPanels()}
        />
    );
};

export default connect((state) => ({
    plugins: getPlugins(state),
}))(ToolsBar);
