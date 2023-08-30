import React, { useEffect } from 'react';

export default () => (Component) => ({ setup = () => { }, openOnLoad, open, ...props }) => {
    // configuration load and initial setup
    useEffect(() => {
        if (props.active) {
            setup({...props?.pluginCfg, items: props?.items});
        } else {
            props.tearDownD2t();
        }
    }, [props.active]);
    return <Component {...props} />;
};
