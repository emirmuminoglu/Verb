import { compiler } from './compiler.js'
import { contentUpdate, attributeHandler } from './updates-and-handler/distribution.js'
import { show, query, loop } from './dynamic-tag-operations/distribution.js'
import { createKey } from './create.key.js'
import { systemTools } from './tools.js'

export class createComponent {
    constructor ({
        root,
        html,
        state = () => ({}),
        methods = () => ({}),
        events = () => ({}),
        changes = () => ({}),
        created = () => {}
    } = {}) {
        this.template = ''
        this.root = root
        this.html = html
        this.events = events
        this.stateConsumer = state
        this.changesConsumer = changes
        this.changes = {}
        this.state = {}
        this.props = {}
        this.methods = methods
        this.created = created
    }

    $template (tagName, attributes, inner) {
        const template = document.createElement(tagName)

        for (const name in attributes) {
            template.setAttribute(name, attributes[name])
        }

        template.innerHTML = inner

        return template
    }

    async first (prop, dataID) {
        this.template.setAttribute(dataID, '')
        this.template.querySelectorAll('*').forEach(element => element.setAttribute(dataID, ''))

        systemTools.map(tool => this[tool.name] = (ID) => tool(this.template, ID))

        this.$update(dataID)
        await this.$compileAgain()
        this.eventHandler(prop)
    }

    $update (doItByForce) {
        loop(this.template, this.state, this.changes, this.dataID)
        contentUpdate(this.template, this.state, this.changes, this.dataID, doItByForce)
        attributeHandler(this.template, this.state, this.chanchangesgesConsumer, this.dataID)
        show(this.template, this.state, this.dataID)
        query(this.template, this.state, this.dataID)
    }

    async $compileAgain (isUpdate) {
        await compiler(this.template, this.state, this.changes, this.dataID)

        if (isUpdate) {
            this.$update()
        }
    }

    eventHandler (prop) {
        for (const name in this.eventsConsumer) {
            const eventName = name.slice((name.indexOf('[') + 1), name.indexOf(']')).trim()
            const event = this.eventsConsumer[name]
            const id = name.slice(0, name.indexOf('[')).trim()
            const additionalProcessing = name.slice((name.indexOf('(') + 1), name.indexOf(')'))
            const additionalProcessingMode = name.includes('($update)') || name.includes('($compileAgain)')

            this.template.querySelectorAll(id).forEach(e => {
                e.addEventListener(eventName, () => {
                    event(e, prop)
                    
                    if (additionalProcessingMode !== false) {
                        this[additionalProcessing](true)
                    }
                })
            })
        }
    }

    async $render (prop, dataID = createKey()) {
        this.props = prop
        this.state = this.stateConsumer(prop)
        this.template = await this.html(prop, this.state)
        this.methodsConsumer = this.methods(prop, this.state)
        this.eventsConsumer = this.events(prop, this.state)
        this.changes = this.changesConsumer(prop, this.state)
        this.dataID = dataID
        this.first(prop, dataID)

        document.querySelectorAll(this.root).forEach(e => e.appendChild(this.template))
        
        this.created(prop, this.state)
    }

    $setState (setValue) {
        setValue = (typeof setValue === 'function' ? setValue() : setValue)
        const variables = {}

        for (const variableName in setValue) {
            this.state[variableName] = setValue[variableName]
            variables[variableName] = setValue[variableName]
        }

        this.$update(this.dataID)

        return variables
    }
}