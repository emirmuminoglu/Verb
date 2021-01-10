const $get = (template, ID = 'undefined') => {
    if (ID !== '') {
        if (template.querySelector(ID) !== null) {
            return template.querySelector(ID)
        } else {
            return 'undefined'
        }
    } else {
        console.error('(LucJS Error): ID parameter cannot be left blank in ($Get) method.')
    }
}

const $getAll = (template, ID = 'undefined') => {
    if (ID !== '') {
        if (template.querySelector(ID) !== null) {
            return template.querySelectorAll(ID)
        } else {
            return 'undefined'
        }
    } else {
        console.error('(LucJS Error): ID parameter cannot be left blank in ($Get) method.')
    }
}

export default [$get, $getAll]