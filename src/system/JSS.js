import Settings from '../../settings.js'

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

    breakPoint(index) {
        for (let i = index; i > 0; i--) {
            const x = this.css[i]

            if (x === ':') {
                return (i + 1)
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

    JSSCompiler(state) {
        let cloneCSS = ''

        for (const i in this.css) {
            const start = this.css.indexOf(this.startPoint),
                finish = this.css.indexOf(this.endPoint) + this.pointLength,
                _var = this.css.slice(start, finish),
                value = this.css.slice(this.breakPoint(start), (start - 3)),
                evalValue = eval(_var.replace(this.startPoint, '').replace(this.endPoint, '').trim())

            if (start === -1 || finish === -1) break

            cloneCSS = this.css.replace(`${value}/* ${_var} */`, this.changeHandler(_var, evalValue))
            this.css = this.css.replace(`${value}/* ${_var} */`, '')
        }

        this.css = cloneCSS
        this.element.innerText = cloneCSS
    }
}