import { join } from '../join.js'

export const attributeHandler = (template, state, changes) => {
    template.querySelectorAll('*').forEach(element => {
        element.getAttributeNames().map(attributeText => {
            if (attributeText.includes('&') && attributeText !== '&change') {
                const attributeName = attributeText.replace('&', '')
                const variableName = element.getAttribute(attributeText)
                const changeMode = element.getAttribute('&change')
                const elementValue = element.getAttribute(attributeName) !== null ? element.getAttribute(attributeName) : ''

                const joinResult = join(state, changeMode !== null ? changes : {}, variableName)

                if (element.getAttribute('processed') !== null) {
                    const newValue = elementValue.split(' ')
                    newValue[(newValue.length - 1)] = joinResult.changeValue
                    element.setAttribute(attributeName, newValue.join(' '))
                } else {
                    element.setAttribute('processed', '')
                    element.setAttribute(attributeName, (elementValue + ' ' + joinResult.changeValue))
                }
            }
        })
    })
}