const verbObjectControl = (element) => {
    if (element.verb === undefined) {
        element.verb = {}
    }
}

export const getVerb = (element, getName) => {
    verbObjectControl(element)

    const value = element.verb[getName]

    if (value !== undefined) {
        return value
    }
}

export const setVerb = (element, setName, setValue) => {
    verbObjectControl(element)

    element.verb[setName] = setValue
}
