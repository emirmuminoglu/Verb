export const getHTML = async (path) => {
    return await fetch(path).then(res => res.text()).then(data => data)
}