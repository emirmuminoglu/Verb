import { Component } from "../system/component.js"
import Settings from "../../settings.js"

export class Router {
    constructor({ name, linkChanged, routerMode = "path", rootName = "body", routers = [], defaultComponent }) {
        this.root = document.querySelector(rootName)
        this.rootName = rootName
        this.routers = routers
        this.routerLinkTagName = Settings.routerLinkTagName
        this[routerMode] = location[routerMode]
        this.defaultComponent = defaultComponent
        this.routerMode = routerMode
        this.linkChanged = linkChanged
        this.title = ""
        this.name = name

        this.updateRouterObject()
        this.routeManager()
    }

    updateRouterObject() {
        if (window.$routers === undefined) window.$routers = {}

        window.$routers[this.name] = this
    }

    setLink(to) {
        if (this.linkChanged) {
            if (this.routerMode === "pathname") {
                history.pushState({}, "", to)
            } else if (this.routerMode === "hash") {
                location.hash = to
            }
        }

        this.routeManager()
    }

    canterChange(to) {
        this[this.routerMode] = to

        this.routeManager()
    }

    eventHandler() {
        document.querySelectorAll(this.routerLinkTagName).forEach(element => {
            element.addEventListener("click", () => {
                const to = element.getAttribute("to")

                if (to !== this[this.routerMode]) {
                    this[this.routerMode] = to
                    
                    this.setLink(to)
                }
            })
        })
    }

    routeManager() {
        let defaultMode = false

        for (const i in this.routers) {
            const req = this.routers[i][this.routerMode],
                { component, title, name } = this.routers[i]

            if (req === this[this.routerMode]) {
                new Component(component).$render(this.rootName, {}, {}, true).then(() => this.eventHandler())

                this.title = title
                if (title !== undefined) document.title = this.title

                defaultMode = false

                this.updateRouterObject()

                break
            } else defaultMode = true
        }

        if (defaultMode) {
            new Component(this.defaultComponent).$render(this.rootName, {}, {}, true).then(() => this.eventHandler())
        }
    }
}
