export default {
    // keyword for dynamic tag operations
    dynamicTagBreakPoint: 'l:',

    // keyword of dynamic tag attributes
    dynamicTagAttributeBreakPoint: '$',

    // The name of the tag that the variables used from state in HTML will be converted for updates
    variableTagName: 'v',

    // To use a state variable in HTML, the beginning of the sign to be written
    // warn! replacement is not recommended
    useVariableStart: '{{',

    // Sign end to be written to use a state variable in HTML
    // warn! replacement is not recommended
    useVariableEnd: '}}',

    // Keyword to use if you want to print a variable in state into the content as HTML
    useHTMLMark: '__html__'
}

/**
 * update alerts
 * 
 * useHTMLmark
 * Give the value as a value that will not have the same name in the state
*/