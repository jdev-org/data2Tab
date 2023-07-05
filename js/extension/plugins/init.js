import React, { useEffect } from 'react';

export default () => (Component) => ({ setup = () => { }, close = () => { }, ...props }) => {
    // configuration load and initial setup
    useEffect(() => {
        console.log(props?.pluginCfg);
        if (props.enabled) {
            setup(props?.pluginCfg);
        }
        return () => {
            close(props?.pluginCfg);
        };
    }, [props.enabled]);
    return <Component {...props} />;
};