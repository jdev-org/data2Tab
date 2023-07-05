import React from "react";
import Message from "@mapstore/components/I18N/Message";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import { CONTROL_NAME } from "../constants";
import Tabs from "../components/tabs/Tabs";
const Extension = ({
    active = false,
    dockStyle = {},
    onClose = () => {},
    dockWidth = 550,
    icon,
    title,
    description,
}) => {
    return (
        <ResponsivePanel
            containerStyle={dockStyle}
            containerId={`${CONTROL_NAME}-container`}
            containerClassName="dock-container"
            className={`${CONTROL_NAME}-dock-panel`}
            open={active}
            position="right"
            size={dockWidth}
            bsStyle="primary"
            glyph={icon || "cog"}
            title={title || <Message msgId="d2t.title" />}
            onClose={() => onClose()}
            style={dockStyle}
        >
            <div className="container">
                {description && <h3>{description}</h3>}
                <Tabs />
            </div>
        </ResponsivePanel>
    );
};

export default Extension;
