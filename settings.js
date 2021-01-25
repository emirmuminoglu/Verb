import { settingsControl } from "./src/system-functions/settings.control.js"

const settings = {
    // keyword for dynamic tag operations
    dynamicTagBreakPoint: "l:",

    // keyword of dynamic tag attributes
    dynamicTagAttributeBreakPoint: "$",

    // keyword props sent to components
    componentPropsBreakPoint: "p:",

    // The name of the tag that the variables used from state in HTML will be converted for updates
    variableTagName: "v",

    // To use a state variable in HTML, the beginning of the sign to be written
    // warn! replacement is not recommended
    useVariableStart: "{{",

    // Sign end to be written to use a state variable in HTML
    // warn! replacement is not recommended
    useVariableEnd: "}}",

    // The character length of the signs to use variables in HTML
    useVariableLength: 2,

    // Keyword to use if you want to print a variable in state into the content as HTML
    useHTMLMark: "__html__",

    // otherwise, the compiler's maximum run limit is
    compilerMaximumTransactionLimit: 100
}

export default settings

/**
 * update alerts
 * 
 * useHTMLmark
 * Give the value as a value that will not have the same name in the state
 * dynamic Tag BreakPoint and dynamic Tag Attribute BreakPoint values ​​should not be the same.
*/

settingsControl(settings)