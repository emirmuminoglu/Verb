const setAttribute = (element, attributeList) => {
    attributeList.map(attributeName => {
        const viewValue = element.getAttribute(`@view-${attributeName}`)
        const elementValue = element.getAttribute(attributeName) !== null ? element.getAttribute(attributeName).trimLeft() : ''

        if (!elementValue.includes(viewValue)) {
            element.setAttribute(attributeName, (elementValue + ' ' + viewValue))
        }
    })
}

const clearAttribute = (element, attributeList) => {
    attributeList.map(attributeName => {
        if (element.getAttribute(attributeName) !== null) {
            element.setAttribute(attributeName, (element.getAttribute(attributeName).replace(element.getAttribute(`@view-${attributeName}`), '')).trim())
        }
    })
}

export const view = (template, state, dataID) => {
    template.querySelectorAll('*').forEach(element => {
        if (element.getAttribute(dataID) !== null) {
            let view = element.getAttribute('@view')
            
            if (view !== null) {
                const attributeList = []
                element.getAttributeNames().map(name => name.includes('@view-') ? attributeList.push(name.replace('@view-', '')) : null)
                
                if (eval(view)) {
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