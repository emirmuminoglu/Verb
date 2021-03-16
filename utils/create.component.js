import { Component } from '../component.js'
import Settings from '../settings.js'

export const createComponent = (template, rootName, component) => {
    if (template.querySelector(rootName) === null) {
        console.error(`A component tag with root name "${rootName}" was not found. Make sure there is an HTML tag with the same name as the rootName you sent`)
    }

    template.querySelectorAll(rootName).forEach(root => {
        const { componentPropsBreakPoint } = Settings,
            addAttributes = {}
        let propsClone = {}

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

        new Component(component).$render(root.tagName, propsClone, addAttributes)
    })
}