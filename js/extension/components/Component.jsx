import React from "react";
import Message from "@mapstore/components/I18N/Message";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import { CONTROL_NAME } from "../constants";
import Tabs from "./tabs/Tabs";
import { Row, Col } from "react-bootstrap";
import Information from "./common/information/Information";
import { isEmpty } from "lodash";
import LayerList from "./common/layersList/LayerList";
const Extension = ({
    active = false,
    dockStyle = {},
    onClose = () => {},
    dockWidth = 550,
    icon,
    title,
    description,
    authorized,
    response
}) => {
    const noResult = response && !response.length;
    console.log(response);
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
                    visible={noResult && authorized}
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
                <Information
                    visible={response == null && authorized}
                    className="row text-center"
                    glyph="map-marker"
                    message="Cliquer en premier sur un élément de la carte !"
                />
                {response && response.length && authorized && (
                    <Col xs={12}>
                        {description && (
                            <h3 className="d2t-description">{description}</h3>
                        )}
                        {
                            <LayerList
                                messages="Choisir une couche..."
                                visible={response.length>1}
                                data={response.map((r, i) => ({ label: r[0] }))}
                                valueField={'label'}
                                textField={'label'}
                                icon="glyphicon-1-layer"
                            />
                        }
                        <Tabs />
                    </Col>
                )}
            </Row>
        </ResponsivePanel>
    );
};

export default Extension;
