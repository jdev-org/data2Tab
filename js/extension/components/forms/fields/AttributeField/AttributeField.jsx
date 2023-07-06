/**
 * Component to create isolate field to show attribute value.
 */
import React from "react";
import { FromControl, ControlLabel } from "react-bootstrap";

const component = (type="text", label) => {
    return <>
        <ControlLabel>label</ControlLabel>
        <FromControl type={text} disabled/>
    </>
};