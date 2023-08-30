import tooltip from "@mapstore/components/misc/enhancers/tooltip";
import {Button} from "react-bootstrap";
import React from "react";
import {omit} from "lodash";
const TooltipButton = tooltip(Button);
const Tool = ({children, className, bsStyle = 'primary', tooltipId, tooltipPosition = 'bottom', ...props}) => (
    <TooltipButton
        className="square-button-md"
        tooltipId={tooltipId}
        tooltipPosition={tooltipPosition}
        bsStyle="primary"
        {...omit(props, ['text','tooltip', 'pluginCfg', 'help', 'defaultOptions', 'items', 'advancedSettings'])}
    >
        {children}
    </TooltipButton>
);

export default Tool;
