const vanilleObjectControl = (element) => {
    if (element.vanille === undefined) {
        element.vanille = {}
    }
}

export const getVanille = (element, getName) => {
    vanilleObjectControl(element)

    const value = element.vanille[getName]

    if (value !== undefined) {
        return value
    }
}

export const setVanille = (element, setName, setValue) => {
    vanilleObjectControl(element)

    element.vanille[setName] = setValue
}