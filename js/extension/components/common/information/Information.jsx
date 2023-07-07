import React from "react";
import { Glyphicon } from "react-bootstrap";
import "./Information.css";

/**
 * A simple component to display a message with title, text and icon
 * @param {object} props
 * @returns component
 */
export default function Information({
    visible = false,
    className = "",
    style = {},
    glyph = "info-sign",
    title = "",
    message = "",
    content = ""
}) {
    return (
        <div
            className={`${
                visible ? "" : "collapse"
            } common-info ${className}`}
            style={style}
        >
            <Glyphicon
                glyph={glyph}
                style={{
                    margin: "0px",
                    fontSize: "36px"
                }}
            />
            <h3>{title}</h3>
            <h4>{message}</h4>
            {content}
        </div>
    );
}
