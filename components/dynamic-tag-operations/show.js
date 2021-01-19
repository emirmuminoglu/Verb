import BreakPoints from '../settings.js'

const setAttribute = (element, attributeList) => {
    const { dynamicTagBreakPoint } = BreakPoints

    attributeList.map(attributeName => {
        const viewValue = element.getAttribute(`${dynamicTagBreakPoint}show-${attributeName}`)
        const elementValue = element.getAttribute(attributeName) !== null ? element.getAttribute(attributeName).trimLeft() : ''

        if (!elementValue.includes(viewValue)) {
            element.setAttribute(attributeName, (elementValue + ' ' + viewValue))
        }
    })
}

const clearAttribute = (element, attributeList) => {
    const { dynamicTagBreakPoint } = BreakPoints

    attributeList.map(attributeName => {
        if (element.getAttribute(attributeName) !== null) {
            element.setAttribute(attributeName, (element.getAttribute(attributeName).replace(element.getAttribute(`${dynamicTagBreakPoint}show-${attributeName}`), '')).trim())
        }
    })
}

export const show = (template, state, dataID) => {
    const { dynamicTagBreakPoint } = BreakPoints

    template.querySelectorAll('*').forEach(element => {
        if (element.getAttribute(dataID) !== null) {
            let show = element.getAttribute(`${dynamicTagBreakPoint}show`)
            
            if (show !== null) {
                const attributeList = []
                element.getAttributeNames().map(name => name.includes(`${dynamicTagBreakPoint}show-`) ? attributeList.push(name.replace(`${dynamicTagBreakPoint}show-`, '')) : null)
                
                if (eval(show)) {
                    element.style.display = ''
                    setAttribute(element, attributeList)
                } else {
                    element.style.display = 'none'
                    clearAttribute(element, attributeList)
                }
            }
        }
    })
}