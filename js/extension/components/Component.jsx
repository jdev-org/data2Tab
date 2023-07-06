import React from "react";
import Message from "@mapstore/components/I18N/Message";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import { CONTROL_NAME } from "../constants";
import Tabs from "../components/tabs/Tabs";
import { Row, Col } from "react-bootstrap";
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
            <Row>
                <Col xs={12}>
                    {description && <h3 className="d2t-description">{description}</h3>}
                    <Tabs />
                </Col>
            </Row>
        </ResponsivePanel>
    );
};

export default Extension;
