import { join } from '../join.js'
import BreakPoints from '../settings.js'

export const attributeHandler = (template, state, changes, dataID) => {
    const { dynamicTagAttributeBreakPoint } = BreakPoints

    template.querySelectorAll('*').forEach(element => {
        if (element.getAttribute(dataID) !== null) {
            element.getAttributeNames().map(async attributeText => {
                if (attributeText.includes(dynamicTagAttributeBreakPoint) && attributeText !== `${dynamicTagAttributeBreakPoint}change`) {
                    const attributeName = attributeText.replace(dynamicTagAttributeBreakPoint, '').trim()
                    const variableName = element.getAttribute(attributeText)
                    const changeMode = element.getAttribute(`${dynamicTagAttributeBreakPoint}change`)
                    const elementValue = element.getAttribute(attributeName.trim()) !== null ? element.getAttribute(attributeName) : ''
                
                    const joinResult = await join(state, changeMode !== null ? changes : {}, variableName)
                
                    if (element.getAttribute('processed') !== null) {
                        if (joinResult.trueValue !== undefined) {
                            const newValue = elementValue.split(' ')
                            newValue[(newValue.length - 1)] = joinResult.changeValue
                            element.setAttribute(attributeName, newValue.join(' '))
                        }
                    } else {
                        element.setAttribute('processed', '')
                        element.setAttribute(attributeName, (
                            elementValue + (
                                elementValue === '' ? '' : ' '
                            ) + joinResult.changeValue)
                        )
                    }
                }
            })
        }
    })
}