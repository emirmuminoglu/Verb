import { CreateComponent } from './component.js'
import BreakPoints from '../settings.js'

export const $componentUse = ({ root, component, props = {}, dataID, propTypeControls }) => {
    const { componentPropsBreakPoint } = BreakPoints
    const components = []
    
    document.querySelectorAll(root).forEach(async root => {
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

        componentClone.then(res => {
            components.push(res)
        })

        for (const [controlName, controlValue] of Object.entries(propTypeControls)) {
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
    })

    return components
}