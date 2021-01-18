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
            template.querySelector(ID).addEventListener(eventName, () => event(el))
        } else {
            return 'undefined'
        }
    } else {
        console.error('(LucJS Error): ID parameter cannot be left blank in ($addEvent) method.')
    }
}

const $remove = (template, ID = '') => {
    if (ID !== '') {
        return template.querySelector(ID).remove()
    } else {
        console.error('(LucJS Error): ID parameter cannot be left blank in ($remove) method.')
    }
}

// for system
export const systemTools =  [$get, $getAll, $addEvent, $remove]

// for users
// Element of JSON object type
// as it is more convenient to use
// exported as tools for users.
export const tools = {
    $get: (ID) => $get(document, ID),
    $getAll: (ID) => $getAll(document, ID),
    $addEvent: (ID, eventName, event) => $addEvent(document, ID, eventName, event),
    $remove: (ID) => $remove(document, ID),
}