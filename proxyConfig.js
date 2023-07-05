// this file contains configurations for dev proxy
const DEV_PROTOCOL = "http";
const DEV_HOST = "localhost:8081";
module.exports = {
    "/rest": {
        target: `${DEV_PROTOCOL}://${DEV_HOST}/mapstore`,
        secure: false,
        headers: {
            host: `${DEV_HOST}`,
        },
    },
    "/pdf": {
        target: `${DEV_PROTOCOL}://${DEV_HOST}/mapstore`,
        secure: false,
        headers: {
            host: `${DEV_HOST}`,
        },
    },
    "/mapstore/pdf": {
        target: `${DEV_PROTOCOL}://${DEV_HOST}`,
        secure: false,
        headers: {
            host: `${DEV_HOST}`,
        },
    },
    "/header": {
        target: `${DEV_PROTOCOL}://${DEV_HOST}`,
        secure: false,
        headers: {
            host: `${DEV_HOST}`,
        },
    },
    "/proxy": {
        target: "http://localhost:8081/",
        secure: false,
        headers: {
            host: "192.168.1.170",
        },
    },
};
