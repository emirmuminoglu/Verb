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

    componentClone.then(res => propTypesControl(res.propTypes, res.state))

    return {componentClone, propsClone}
}

const propTypesControl = (propTypesControl, state) => {
    for (const [controlName, controlValue] of Object.entries(propTypesControl)) {
        const type = controlValue.replace('.require', '')
        const require = controlValue.includes('.require')
    
        const prop = state[controlName]
        if (prop !== undefined) {
            if (typeof prop !== type) {
                console.error(`"${controlName}" value was expected to come in "${type}" type but came in "${typeof prop}" type. Value:`, prop, '. Type: "' + typeof prop + '". Props', state)
            }
        } else {
            if (require) {
                console.error(`The value of "${controlName}" was supposed to come but it didn't. Props:`, state)
            }
        }
    }
}

export const $componentUse = ({ rootName, component, props = {}, plural = false, } ) => {
    if (plural) {
        const components = []

        document.querySelectorAll(rootName).forEach(root => {
            const { componentClone } = write(rootName, props, component)

            components.push(componentClone)
        })

        return components
    } else {
        const { componentClone } = write(rootName, props, component)
        
        return componentClone
    }
}