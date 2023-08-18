import { userGroupSecuritySelector } from '@mapstore/selectors/security';
import { keys, isEmpty } from "lodash";
import { CONTROL_NAME } from "@js/extension/constants";
export const isActive = (state) => {
    return (
        (state.controls &&
            state.controls[CONTROL_NAME] &&
            state.controls[CONTROL_NAME].enabled) ||
        (state[CONTROL_NAME] && state[CONTROL_NAME].closing) ||
        false
    );
};
export const getTabs = (state) =>
    state?.d2t?.pluginCfg && state?.d2t?.pluginCfg?.tabs;
export const getTabsList = (state) => getTabs(state) && keys(getTabs(state));
export const getTab = (state) => state?.d2t?.tab;
export const getLayer = (state) => state?.d2t?.layer;
export const getReponseLayer = (state) =>
    getLayer(state)
        ? getResponse(state).filter((x) => x[0] == getLayer(state))[0]
        : null;
export const getFeatures = (state) =>
    getLayer(state) &&
    (getReponseLayer(state) ? getReponseLayer(state)[1] : null);

export const getDocuments = (state) => state?.d2t.documents?.documents;
export const getIdsDocuments = (state) => state?.d2t?.documents?.ids;

export const getApi = (state) => state?.d2t?.api;

export const getFields = (state) => state?.d2t?.fields;
export const getResponse = (state) => state?.d2t?.response;

/**
 * Get plugin config
 * @param {*} state
 * @returns {object}
 */
export const getPluginCfg = (state) => state?.d2t?.pluginCfg;

export const getLayers = (state) => state?.d2t?.pluginCfg.layers;

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
    const groupNames = groups.map(({ groupName }) => groupName);
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
