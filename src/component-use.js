import { CreateComponent } from './component.js'
import BreakPoints from '../settings.js'

export const $componentUse = ({ root, component, props = {}, dataID }) => {
    const { componentPropsBreakPoint } = BreakPoints
    const components = []
    
    document.querySelectorAll(root).forEach(async root => {
        let propsClone = JSON.parse(JSON.stringify(props))
        const addAttributes = {}

        root.getAttributeNames().map(attrName => {
            if (attrName.includes(componentPropsBreakPoint)) {
                const propName = attrName.replace(componentPropsBreakPoint, '')
                let propValue = root.getAttribute(attrName)

                if (propValue.includes('{') || propValue.includes('[')) {
                    propValue = eval(`[${propValue}][0]`)
                }

                propsClone[propName] = propValue
            } else {
                const attrValue = root.getAttribute(attrName)

                if (!attrName.includes('data-l-')) {
                    addAttributes[attrName] = attrValue
                }
            }
        })

        const componentClone = new CreateComponent(component).$render(root.tagName, propsClone, addAttributes)
        componentClone.then(res => {
            components.push(res)
        })
    })

    return components
}