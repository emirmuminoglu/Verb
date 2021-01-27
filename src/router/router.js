import { Component } from "../system-functions/component.js"

export class Router {
    constructor({ rootName = "body", routers = [] }) {
        this.root = document.querySelector(rootName)
        this.rootName = rootName
        this.routers = routers

        this.eventHandler()
        this.routeManager(location.pathname, true)
    }

    eventHandler() {
        document.querySelectorAll("v-link").forEach(element => {
            element.addEventListener("click", () => {
                const path = element.getAttribute("path")

                this.routeManager(path, false)
                history.pushState({}, "", path)
            })
        })
    }
    
    getPathName = () => (location.pathname)

    routeManager(pathName, onloadMode) {
        
        for (const i in this.routers) {
            const path = this.routers[i].path,
                component = this.routers[i].component
            
            if (path === pathName) {
                if (pathName !== this.getPathName() || onloadMode) {
                    this.root.innerHTML = ""
                    new Component(component).$render(this.rootName, {}, {}, true)
                    
                    break
                }
            }
        }
    }
}