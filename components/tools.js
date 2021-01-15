const $get = (template, ID = '') => {
    if (ID !== '') {
        if (template.querySelector(ID) !== null) {
            return template.querySelector(ID)
        } else {
            return 'undefined'
        }
    } else {
        console.error('(LucJS Error): ID parameter cannot be left blank in ($get) method.')
    }
}

const $getAll = (template, ID = '') => {
    if (ID !== '') {
        if (template.querySelector(ID) !== null) {
            return template.querySelectorAll(ID)
        } else {
            return 'undefined'
        }
    } else {
        console.error('(LucJS Error): ID parameter cannot be left blank in ($getAll) method.')
    }
}

const $addEvent = (template, ID = '', eventName = 'click', event = () => {}) => {
    const el = template.querySelector(ID)
    if (ID !== '') {
        if (el !== null) {
            console.log(template, ID, eventName, event)
            template.querySelector(ID).addEventListener(eventName, () => event(el))
        } else {
            return 'undefined'
        }
    } else {
        console.error('(LucJS Error): ID parameter cannot be left blank in ($addEvent) method.')
    }
}

export default [$get, $getAll, $addEvent]