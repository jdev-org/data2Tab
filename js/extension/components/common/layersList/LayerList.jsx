import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { Row } from 'react-bootstrap';
import { DropdownList } from 'react-widgets';

import {getLayers, getLayer } from "../../../stateManagement/selector/selector";
import { setLayer } from "../../../stateManagement/actions/actions";
/**
 * Custom drop down for identify panel
 * @param {any} param
 * @returns component
 */

const LayerList = ({
    icon,
    ...props
}) => {
    let visible = props.visible ? {
        margin: '10px'
    } : {
        margin: '10px',
        display: 'none'
    };
    return (
        <Row style={visible}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '8px 8px 0', zIndex: '10' }}>
                <span className={`identify-icon glyphicon ${icon}`} />
                <div style={{ flex: "1 1 0%", padding: "0px 4px" }}>
                    <DropdownList
                        disabled={false}
                        placeholder=""
                        value={props.layer}
                        {...props}
                        onChange={(x) => {
                            props.onChange(x);
                        }}
                    />
                </div>
            </div>
        </Row>
    );
}

export default connect(
    (state) => ({
        layer: getLayer(state),
        layers: getLayers(state)
    }),
    {
        onChange: setLayer
    }
)(LayerList);