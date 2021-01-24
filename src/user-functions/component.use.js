import { Component } from "../system-functions/component.js"
import Settings from "../../settings.js"
import { control } from "../system-functions/error.js"

const write = (root, props, component) => {
    control(props).is({ type: "object" }).err("The type of the prop value sent while using the component in the javascript must be an object.")
    control(component).is({ type: "object" }).err("The component value you send to the component user must be an object.")

    const { componentPropsBreakPoint } = Settings,
    addAttributes = {}
    let propsClone = JSON.parse(JSON.stringify(props))

    root.getAttributeNames().map(attrName => {
        if (attrName.includes(componentPropsBreakPoint)) {
            const propName = attrName.replace(componentPropsBreakPoint, "")
            let propValue = root.getAttribute(attrName)

            propValue = eval(`[${propValue}][0]`)

            propsClone[propName] = propValue
        } else {
            const attrValue = root.getAttribute(attrName)

            if (!attrName.includes("data-l-")) {
                addAttributes[attrName] = attrValue
            }
        }
    })

    const componentClone = new Component(component).$render(root.tagName, propsClone, addAttributes)

    componentClone.then(res => propTypesControl(res.propTypes, res.state))

    return { componentClone, propsClone }
}

const propTypesControl = (propTypesControl, state) => {
    control(propTypesControl).is({ type: "object" }).err("The propTypes variable for the probe type checks must be a value of an object type.")

    for (const [controlName, controlValue] of Object.entries(propTypesControl)) {
        control(controlValue).is({ type: "string" }).err("Control values ​​in prop type checks must be strings")

        const type = controlValue.replace(".require", ""),
        require = controlValue.includes(".require")

        const prop = state[controlName]
        if (prop !== undefined) {
            control(prop).is({ type }).err(`"${controlName}" value was expected to come in "${type}" type but came in "${typeof prop}" type. Value:` + prop + ". Type: " + typeof prop)
        } else {
            if (require) {
                control().basicError([`The value of "${controlName}" was supposed to come but it didn"t. Props:`, state])
            }
        }
    }
}

export const $componentUse = ({ rootName, component, props = {} }) => {
    control(document.querySelector(rootName)).isNot({ value: null }).err(`A component tag with root name "${rootName}" was not found. Make sure there is an HTML tag with the same name as the rootName you sent`)
    const components = []

    document.querySelectorAll(rootName).forEach(root => {
        const { componentClone } = write(root, props, component)

        components.push(componentClone)
    })

    return components
}