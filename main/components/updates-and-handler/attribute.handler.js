import { join } from '../join.js'

export const attributeHandler = (template, state, changes) => {
    template.querySelectorAll('*').forEach(element => {
        element.getAttributeNames().map(attributeText => {
            if (attributeText.includes('&') && attributeText !== '&change') {
                const attributeName = attributeText.replace('&', '')
                const variableName = element.getAttribute(attributeText)
                const changeMode = element.getAttribute('&change')

                const joinResult = join(
                    state,
                    changeMode !== null ? changes : {},
                    variableName
                )

                element.setAttribute(attributeName, joinResult.changeValue)
            }
        })
    })
}