import { compiler } from '../compiler.js'
import { join } from '../join.js'
import BreakPoints from '../settings.js'

export const loop = (template, state, changes, dataID) => {
    const { dynamicTagBreakPoint } = BreakPoints

    template.querySelectorAll('*').forEach(async containerElement => {
        const container = containerElement.getAttribute(`${dynamicTagBreakPoint}for-container`)

        if (containerElement.getAttribute(dataID) !== null) {
            if (container !== null) {
                if (containerElement.getAttribute('save') !== null) {
                    containerElement.innerHTML = containerElement.getAttribute('save')
                } else {
                    containerElement.setAttribute('save', containerElement.innerHTML.trim())
                }

                const element = containerElement.children[0]
                containerElement.innerHTML = ''
                const _for = element.getAttribute(`${dynamicTagBreakPoint}for`)
                const key = element.getAttribute(`${dynamicTagBreakPoint}key`)

                if (element.getAttribute(`${dynamicTagBreakPoint}for`) !== null) {
                    const use = _for.slice((_for.indexOf('(') + 1), _for.indexOf(')')).split(',')
                    const listName = _for.split('in')[_for.split('in').length - 1].trim()
                    const list = JSON.parse(await (await join(state, changes, listName)).changeValue)

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

                        result.push(await compiler(cloneElement, localState, changes, i))
                    }

                    result.map(el => {
                        containerElement.appendChild(el)
                    })
                }
            }
        }
    })
}