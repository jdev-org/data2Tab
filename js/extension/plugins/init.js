import React, { useEffect } from 'react';

export default () => (Component) => ({ setup = () => { }, openOnLoad, open, ...props }) => {
    // configuration load and initial setup
    useEffect(() => {
        if (props.active) {
            setup(props?.pluginCfg);
        }
    }, [props.active]);
    return <Component {...props} />;
};