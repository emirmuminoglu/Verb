/**
 * @param {String} ID The query of the element to be accessed
*/
const $get = (template, ID = "") => {
    if (ID !== "") {
        if (template.querySelector(ID) !== null) {
            return template.querySelector(ID)
        } else {
            return "undefined"
        }
    } else {
        console.error("(Verb.js Error): ID parameter cannot be left blank in ($get) method.")
    }
}

/**
 * @param {String} ID The query of the element to be accessed
*/
const $getAll = (template, ID = "") => {
    if (ID !== "") {
        if (template.querySelector(ID) !== null) {
            return template.querySelectorAll(ID)
        } else {
            return "undefined"
        }
    } else {
        console.error("(Verb.js Error): ID parameter cannot be left blank in ($getAll) method.")
    }
}

/**
 *
 * @param {String} ID The query of the element to be accessed
 * @param {String} eventName event name to be assigned to element
 * @param {Function} event event to be assigned to element
*/
const $addEvent = (template, ID = "", eventName = "", event = () => { }) => {
    const el = template.querySelector(ID)
    if (ID !== "") {
        if (el !== null) {
            template.querySelector(ID).addEventListener(eventName, (target) => event(el, target))
        } else {
            return "undefined"
        }
    } else {
        console.error("(Verb.js Error): ID parameter cannot be left blank in ($addEvent) method.")
    }
}

/**
 * @param {String} ID The query of the element to be accessed
*/
const $remove = (template, ID = "") => {
    if (ID !== "") {
        return template.querySelector(ID).remove()
    } else {
        console.error("(Verb.js Error): ID parameter cannot be left blank in ($remove) method.")
    }
}

/**
 * @param {Object} eventsList The events object to be assigned to the selected elements e, each object name element contains the event name to be assigned to the element, and its values ​​are events.
*/
const $addEventList = (template, eventsList = {}) => {
    for (const [eventIsString, event] of Object.entries(eventsList)) {
        const id = eventIsString.slice(0, eventIsString.indexOf("[")).trim()
        const eventName = eventIsString.slice((eventIsString.indexOf("[") + 1), eventIsString.indexOf("]")).trim()
        const all = eventIsString.slice(
            (eventIsString.indexOf("(") + 1) === -1 ? 0 : (eventIsString.indexOf("(") + 1),
            eventIsString.indexOf(")") === -1 ? 0 : eventIsString.indexOf(")")
        ).trim()

        if (id.trim() !== "") {
            if (all === "all") {
                template.querySelectorAll(id).forEach(element => {
                    element.addEventListener(eventName, (t) => event(element, t))
                })
            } else {
                template.querySelector(id).addEventListener(eventName, () => event(template.querySelector(id)))
            }
        } else {
            console.error("(Verb.js Error): each event assignment must have an element ID before '[' in the action name.")
        }
    }
}

export const tools = [ $get, $getAll, $addEvent, $remove, $addEventList ]
