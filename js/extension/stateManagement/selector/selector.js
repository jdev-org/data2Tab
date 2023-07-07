import { userGroupSecuritySelector } from '@mapstore/selectors/security';
import { keys, isEmpty } from "lodash";
export const isActive = (state) => {
    return state?.controls?.d2t?.enabled;
};
export const getTabs = (state) =>
    state?.d2t?.pluginCfg && state?.d2t?.pluginCfg?.tabs;
export const getTabsList = (state) => getTabs(state) && keys(getTabs(state));
export const getTab = (state) => state?.d2t?.tab;
export const getFeature = (state) => state?.d2t?.feature;
export const getLayer = (state) => state?.d2t?.activeLayer;

export const getDocuments = (state) => state?.d2t.documents?.documents;
export const getIdsDocuments = (state) => state?.d2t?.documents?.ids;

export const getApi = (state) => state?.d2t?.api;

export const getFields = (state) => state?.d2t?.fields;

/**
 * Get plugin config
 * @param {*} state
 * @returns {object}
 */
export const getPluginCfg = (state) => state?.d2t?.pluginCfg;

export const getDescription = (state) => {
    let description = state.d2t.pluginCfg.description;
    let feature = state?.d2t?.feature;
    if (feature && feature.properties[description]) {
        return feature.properties[description];
    }
    return description;
};

// to emulate authentication use test_env and sec-roles header as : "ROLE_MAPSTORE_ADMIN;ROLE_EL_APPLIS_CAD_CNIL1" (; separator)
export const getAuthLevel = (state) => {
    const groups = userGroupSecuritySelector(state) ?? [];
    // const groupNames = groups.map(({ groupName }) => groupName);
    const groupNames = ["MAPSTORE_ADMIN"];
    let allowedRoles = getPluginCfg(state)?.allowedRoles;
    if (!allowedRoles || !allowedRoles.length) {
        allowedRoles = ["MAPSTORE_ADMIN"];
    }
    const fullyAuthorized = !isEmpty(
        allowedRoles
            .map((role) => groupNames.includes(role))
            .filter((role) => role)
    );
    return fullyAuthorized;
};

export const boundingSidebarRectSelector = (state) =>
    (state.maplayout && state.maplayout.boundingSidebarRect) || {};
