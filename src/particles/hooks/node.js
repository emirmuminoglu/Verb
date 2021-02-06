export class Node {
    constructor(id, { value = "", type = "string", event = "keypress" } = {}, func = () => {}) {
        this.id = id
        this.el = document.querySelector(id)
        this.value = value
        this.type = (type[0].toUpperCase() + type.slice(1))
        this.func = func
        this.event = event

        this.first()
    }

    first() {
        this.$update()

        this.el.addEventListener(this.event, (e) => {
            this.value = window[this.type](e.target.value)

            this.func(e)
        })
    }

    $setValue(newValue) {
        this.value = newValue

        this.$update()
    }

    $update() {
        this.el.value = window[this.type](this.value)
    }
}
