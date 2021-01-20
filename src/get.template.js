/**
 * @param {String} path full name of the HTML file to be captured
*/
export const getTemplate = async (path) => {
    return await fetch(path).then(res => res.text())
}