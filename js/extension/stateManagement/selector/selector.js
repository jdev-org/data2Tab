import { userGroupSecuritySelector } from '@mapstore/selectors/security';
export const isActive = state => {
    return state?.controls?.d2t?.enabled;
}

export const getTabs = (state) => state?.pluginCfg?.tab;
export const getTab = state => state?.d2t?.tab;
export const getFeature = state => state?.d2t?.feature;
export const getFeatureProperties = state => state?.d2t?.properties;
export const getLayer = state => state?.d2t?.activeLayer;

export const getDocuments = state => state?.d2t.documents?.documents;
export const getIdsDocuments = state => state?.d2t?.documents?.ids;

export const getApi = state => state?.d2t?.api;

export const getFields = state => state?.d2t?.fields;

/**
 * Get plugin config
 * @param {*} state
 * @returns {object}
 */
export const getPluginCfg = state => state?.d2t?.pluginCfg;

// to emulate authentication use test_env and sec-roles header as : "ROLE_MAPSTORE_ADMIN;ROLE_EL_APPLIS_CAD_CNIL1" (; separator)
export const getAuthLevel = (state) => {
    const groups = userGroupSecuritySelector(state) ?? [];
    const groupNames = groups.map(({ groupName }) => groupName);
    return {
        reader: groupNames.includes(getPluginCfg(state).reader || "ROLE_SV_CARTEAUX_READ"),
        writer: groupNames.includes(getPluginCfg(state).writer || "ROLE_SV_CARTEAUX_WRITE"),
    };
}

export const boundingSidebarRectSelector = (state) => state.maplayout && state.maplayout.boundingSidebarRect || {};

// /**
//  * Retrieve only specific attribute from map layout
//  * @function
//  * @memberof selectors.mapLayout
//  * @param  {object} state the state
//  * @param  {object} attributes attributes to retrieve, bool {left: true}
//  * @param  {boolean} isDock flag to use dock paddings instead of toolbar paddings
//  * @return {object} selected attributes of layout of the map
//  */
// export const mapLayoutValuesSelector = memoize((state, attributes = {}, isDock = false) => {
//     const layout = mapLayoutSelector(state);
//     const boundingSidebarRect = boundingSidebarRectSelector(state);
//     return layout && Object.keys(layout).filter(key =>
//         attributes[key]).reduce((a, key) => {
//         if (isDock) {
//             return ({...a, [key]: (boundingSidebarRect[key] ?? layout[key])});
//         }
//         return ({...a, [key]: layout[key]});
//     },
//     {}) || {};
// }, (state, attributes, isDock) =>
//     JSON.stringify(mapLayoutSelector(state)) +
//     JSON.stringify(boundingSidebarRectSelector(state)) +
//     JSON.stringify(attributes) + (isDock ? '_isDock' : ''));