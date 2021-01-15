import { compiler } from '../html.compiler.js'
import { join } from '../join.js'

export const loop = (template, state, changes, dataID) => {
    template.querySelectorAll('*').forEach(containerElement => {
        const container = containerElement.getAttribute('@for-container')

        if (container !== null) {
            if (containerElement.getAttribute('save') !== null) {
                containerElement.innerHTML = containerElement.getAttribute('save')
                console.log("clear", containerElement.getAttribute('save'))
            } else {
                containerElement.setAttribute('save', containerElement.innerHTML.trim())
            }

            const element = containerElement.children[0]
            containerElement.innerHTML = ''
            const _for = element.getAttribute('@for')
            const key = element.getAttribute('@key')

            if (element.getAttribute('@for') !== null) {
                const use = _for.slice((_for.indexOf('(') + 1), _for.indexOf(')')).split(',')
                const listName = _for.split('in')[_for.split('in').length - 1].trim()
                const list = join(state, changes, listName).changeValue
            // const breakPoint = 

                const distribution = {
                    itemName: use[0].trim(),
                    keyName: use[1].trim(),
                    list,
                    key
                }

                const result = []

                for (const i in distribution.list) {
                    const item = distribution.list[i]
                    const localState = {}
                    localState[distribution.itemName] = item

                    const cloneElement = element.cloneNode(element)

                    result.push(compiler(cloneElement, localState, changes, i))
                }

                result.map(el => {
                    containerElement.appendChild(el)
                })

                console.log(containerElement)
            }
        }
    })
}