import Settings from '../../Verb/settings.js'

export class JSS {
    constructor(element, { state, changes }) {
        this.element = element
        this.css = this.element.innerText.trim()
        this.state = state
        this.changes = changes
        this.map = new WeakMap()
        this.startPoint = Settings.JSSPointStart
        this.endPoint = Settings.JSSPointEnd
        this.pointLength = Settings.JSSPointLength

        this.JSSCompiler(this.state)
        this.stateHandler(this.state)
    }

    stateHandler(obj) {
        const map = this.map,
            _this = this

        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                this.stateHandler(obj[key])
            } else {
                this.map.set(obj, { ...obj })

                Object.defineProperty(obj, key, {
                    set(v) {
                        map.get(obj)[key] = v
                        _this.JSSCompiler(_this.state)
                    },
                    get() {
                        return map.get(obj)[key]
                    }
                })
            }
        }
    }

    changeHandler(variableName, evalValue) {
        const variableChangeName = variableName.replace(this.startPoint, '').replace(this.endPoint, '').trim()

        if (this.changes[variableChangeName]) {
            return ` ${this.changes[variableChangeName](evalValue)} /* ${variableName} */`
        } else {
            return ` ${evalValue} /* ${variableName} */`
        }
    }

    stringInMap(string, _function) {
        for (const i in string) {
            _function(string[i].trim(), i)
        }
    }

    JSSCompiler(state) {
        let compileCSS = this.css
        compileCSS = compileCSS.split('/* JSS */')
        compileCSS.splice(0, 1)
        compileCSS.splice((compileCSS.length - 1), 1)

        this.stringInMap(compileCSS.join('').split(';'), t => {
            if (t.includes(this.startPoint) || t.includes(this.endPoint)) {
                const start = t.indexOf(this.startPoint),
                    end = t.indexOf(this.endPoint) + this.pointLength,
                    _var = t.slice(start, end),
                    evalValue = eval(_var.replace(this.startPoint, '').replace(this.endPoint, '')),
                    value = t.slice((t.indexOf(':') + 1), t.indexOf('/*')),
                    replaceValue = t.replace(value, ` ${this.changeHandler(_var, evalValue)} `)

                this.css = this.css.replace(t, replaceValue)
            }
        })

        this.element.innerHTML = this.css
    }
}