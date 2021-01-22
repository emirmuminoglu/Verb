import { CreateComponent } from './component.js'
import BreakPoints from '../settings.js'

const write = (rootName, props, component) => {
    const { componentPropsBreakPoint } = BreakPoints

    const root = document.querySelector(rootName)
    let propsClone = JSON.parse(JSON.stringify(props))
    const addAttributes = {}

    root.getAttributeNames().map(attrName => {
        if (attrName.includes(componentPropsBreakPoint)) {
            const propName = attrName.replace(componentPropsBreakPoint, '')
            let propValue = root.getAttribute(attrName)

            propValue = eval(`[${propValue}][0]`)

            propsClone[propName] = propValue
        } else {
            const attrValue = root.getAttribute(attrName)

            if (!attrName.includes('data-l-')) {
                addAttributes[attrName] = attrValue
            }
        }
    })

    const componentClone = new CreateComponent(component).$render(root.tagName, propsClone, addAttributes)

    return {componentClone, propsClone}
}

const propTypesControl = (propTypesControl, propsClone) => {
    for (const [controlName, controlValue] of Object.entries(propTypesControl)) {
        const type = controlValue.replace('.require', '')
        const require = controlValue.includes('.require')
    
        const prop = propsClone[controlName]
        if (prop !== undefined) {
            if (typeof prop !== type) {
                console.error(`"${controlName}" value was expected to come in "${type}" type but came in "${typeof prop}" type. Value:`, prop, '. Type: "' + typeof prop + '". Props', propsClone)
            }
        } else {
            if (require) {
                console.error(`The value of "${controlName}" was supposed to come but it didn't. Props:`, propsClone)
            }
        }
    }
}

export const $componentUse = ({ rootName, component, props = {}, propTypes = {}, plural = false, } ) => {
    if (plural) {
        const components = []

        document.querySelectorAll(rootName).forEach(root => {
            const { componentClone, propsClone } = write(rootName, props, component)

            propTypesControl(propTypes, propsClone)

            components.push(componentClone)
        })

        return components
    } else {
        const { componentClone, propsClone } = write(rootName, props, component)
        
        propTypesControl(propTypes, propsClone)
        
        return componentClone
    }
}