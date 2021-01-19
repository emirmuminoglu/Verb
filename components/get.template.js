export const getTemplate = async (path) => {
    return await fetch(path).then(res => res.text())
}