import React from "react";
import Message from "@mapstore/components/I18N/Message";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import { CONTROL_NAME } from "../constants";
import Tabs from "./tabs/Tabs";
import { Row, Col } from "react-bootstrap";
import Information from "./common/information/Information";
const Extension = ({
    active = false,
    dockStyle = {},
    onClose = () => {},
    dockWidth = 550,
    icon,
    title,
    description,
    isFeature,
    authorized
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
            title={title || "Data2Tab"}
            onClose={() => onClose()}
            style={dockStyle}
        >
            <Row>
                <Information
                    visible={!isFeature && authorized}
                    className="row text-center"
                    glyph="eye-close"
                    message="Aucun résultat !"
                />
                <Information
                    visible={!authorized}
                    className="row text-center"
                    glyph="lock"
                    message="Ce contenu n'est pas accessible. Veuillez contacter votre administrateur."
                />
                {isFeature && authorized && (
                    <Col xs={12}>
                        {description && (
                            <h3 className="d2t-description">{description}</h3>
                        )}
                        <Tabs />
                    </Col>
                )}
            </Row>
        </ResponsivePanel>
    );
};

export default Extension;
