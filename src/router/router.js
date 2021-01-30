import { Component } from "../system-functions/component.js"
import Settings from "../../settings.js"

export class Router {
    constructor({ routerMode = "path", rootName = "body", routers = [], defaultComponent }) {
        this.root = document.querySelector(rootName)
        this.rootName = rootName
        this.routers = routers
        this.routerLinkTagName = Settings.routerLinkTagName
        this[routerMode] = location[routerMode]
        this.defaultComponent = defaultComponent
        this.routerMode = routerMode

        this.eventHandler()
        this.routeManager(true)
    }

    eventHandler() {
        document.querySelectorAll(this.routerLinkTagName).forEach(element => {
            element.addEventListener("click", () => {
                const to = element.getAttribute("to"),
                    title = element.getAttribute("title")

                this[this.routerMode] = to

                if (this.routerMode === "pathname") {
                    history.pushState({}, "", to)
                } else if (this.routerMode === "hash") {
                    location.hash = to
                }

                title !== null ? document.title = title : null

                this.routeManager()
            })
        })
    }

    getHash = () => (location.hash)

    routeManager(onloadMode) {
        let defaultMode = false

        for (const i in this.routers) {
            const req = this.routers[i][this.routerMode],
                component = this.routers[i].component

            if (req === this[this.routerMode]) {
                this.root.innerHTML = ""
                new Component(component).$render(this.rootName, {}, {}, true)
                defaultMode = false

                break
            } else
                defaultMode = true
        }

        if (defaultMode) {
            this.root.innerHTML = ""
            new Component(this.defaultComponent).$render(this.rootName, {}, {}, true)
        }
    }
}