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
        this.title = ""

        this.createRouterObject()
        this.routeManager()
        this.eventHandler()
    }
    
    createRouterObject() {
        window.vanille.$router = {
            ...this
        }
    }

    updateRouterObject = () => window.vanille.$router = Object.assign(window.vanille.$router, this)

    eventHandler() {
        document.querySelectorAll(this.routerLinkTagName).forEach(element => {
            element.addEventListener("click", () => {
                const to = element.getAttribute("to")

                this[this.routerMode] = to

                if (this.routerMode === "pathname") {
                    history.pushState({}, "", to)
                } else if (this.routerMode === "hash") {
                    location.hash = to
                }

                this.routeManager()
            })
        })
    }

    routeManager() {
        let defaultMode = false

        for (const i in this.routers) {
            const req = this.routers[i][this.routerMode],
                { component, title } = this.routers[i]

            if (req === this[this.routerMode]) {
                this.root.innerHTML = ""
                
                new Component(component).$render(this.rootName, {}, {}, true)

                this.title = title
                title !== undefined ? document.title = this.title : null
                defaultMode = false
                this.updateRouterObject()

                break
            } else {
                defaultMode = true
            }
        }

        if (defaultMode) {
            this.root.innerHTML = ""

            new Component(this.defaultComponent).$render(this.rootName, {}, {}, true)
        }
    }
}