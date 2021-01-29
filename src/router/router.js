import { Component } from "../system-functions/component.js"
import Settings from "../../settings.js"

export class Router {
    constructor({ rootName = "body", routers = [], defaultOnloadComponent }) {
        this.root = document.querySelector(rootName)
        this.rootName = rootName
        this.routers = routers
        this.routerLinkTagName = Settings.routerLinkTagName
        this.hash = location.hash
        this.defaultOnloadComponent = defaultOnloadComponent

        this.eventHandler()
        this.routeManager(true)
    }

    eventHandler() {
        document.querySelectorAll(this.routerLinkTagName).forEach(element => {
            element.addEventListener("click", () => {
                const hash = element.getAttribute("hash")

                this.hash = hash

                this.routeManager()
            })
        })
    }

    getHash = () => (location.hash)

    routeManager(onloadMode) {
        for (const i in this.routers) {
            const hash = this.routers[i].hash,
                component = this.routers[i].component

            if (onloadMode) {
                this.root.innerHTML = ""
                new Component(this.defaultOnloadComponent).$render(this.rootName, {}, {}, true)

                break
            } else {
                if (hash === this.hash) {
                    this.root.innerHTML = ""
                    new Component(component).$render(this.rootName, {}, {}, true)

                    break
                }
            }
        }
    }
}