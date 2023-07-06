export const SET_ACTIVE_TAB = "SET_ACTIVE_TAB";
export const DOWNLOAD_DOCUMENT = "DOWNLOAD_DOCUMENT";
export const UPLOAD_DOCUMENT = "UPLOAD_DOCUMENT";
export const SHOW_DOCUMENT = "SHOW_DOCUMENT";
export const DELETE_DOCUMENT = "DELETE_DOCUMENT";
export const GET_DOCUMENT = "GET_DOCUMENT";
export const GET_ALL_DOCUMENTS = "GET_ALL_DOCUMENTS";
export const SET_FEATURE = "SET_FEATURE";
export const SETUP = "SETUP";
export const SET_CONFIG = "SET_CONFIG";
export const CLOSE = "SET_FEATURE";
export const SHOW_NOTIFICATIONS = "SHOW_NOTIFICATIONS";
export const SHOW_CONTENT = "SHOW_CONTENT";

export const showContent = (layer, feature) => {
    return {
        type: SHOW_CONTENT,
        layer,
        feature,
    };
};

/**
 *
 * @param {string} level
 * @param {string} title
 * @param {string} message
 * @returns
 */
export const displayMsg = (level, title, message) => ({
    type: DISPLAY_MSG,
    level,
    title,
    message,
});

/**
 * setup
 * @returns {}
 */
export const setup = (cfg) => ({
    type: SETUP,
    cfg,
});

/**
 * close
 * @returns {}
 */
export const close = () => ({
    type: CLOSE,
});

/**
 * Change active tab
 * @param {string} activeTab
 * @returns {{activeTab: string}}
 */
export const setActiveTab = (activeTab) => ({
    type: SET_ACTIVE_TAB,
    activeTab,
});

/**
 * Upload a document
 * @param {object} document
 * @returns {{document: object}}
 */
export const uploadDocument = (document) => ({
    type: UPLOAD_DOCUMENT,
    document,
});

/**
 * Download a document
 * @param {string} id
 * @returns {{id: string}}
 */
export const downloadDocument = (id) => ({
    type: DOWNLOAD_DOCUMENT,
    id,
});

/**
 * Show a document in other browser tab
 * @param {string} id
 * @returns {{id:string}}
 */
export const showDocument = (id) => ({
    type: SHOW_DOCUMENT,
    id,
});

/**
 * Get list of documents
 * @param {string} id
 * @returns {{id:string}}
 */
export const getDocument = (id) => ({
    type: GET_DOCUMENT,
    id,
});

/**
 * Get list of documents
 * @param {string} id
 * @returns {{id:string}}
 */
export const getAllDocuments = () => ({
    type: GET_ALL_DOCUMENTS,
});

/**
 * Set documents to state
 * @param {documents} Array
 * @returns {{documents: Array}}
 */
export const setDocuments = (documents = []) => ({
    type: SET_DOCUMENTS,
    documents,
});

/**
 * Delete a document by id
 * @param {string} id
 * @returns {{id: string}}
 */
export const deleteDocument = (id) => ({
    type: DELETE_DOCUMENT,
    id,
});

/**
 * Change clicked feature
 * @param {string} id
 * @param {object} feature
 * @returns  {{id: string, feature: object}}
 */
export const setFeature = (feature) => ({
    type: SET_FEATURE,
    feature,
});
