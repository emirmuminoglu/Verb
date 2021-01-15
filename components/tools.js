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

const $remove = (template, ID = '' ) => {    
    if (ID !== '') {        
            template.querySelector(ID).remove()
    } else {
        console.error('(LucJS Error): ID parameter cannot be left blank in ($remove) method.')
    }

}

export default [$get, $getAll, $addEvent, $remove]