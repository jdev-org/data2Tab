export const getDocuments = () => {
    return fetch("").then(r => r.json())
}