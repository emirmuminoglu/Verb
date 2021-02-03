import { panic } from "./error.js"

export const settingsControl = (settings) => {
    panic(settings.dynamicTagBreakPoint !== settings.dynamicTagAttributeBreakPoint).err("Dynamic Tag BreakPoint and dynamic Tag Attribute BreakPoint values ​​cannot be the same. Check your settings.")
    panic(settings.variableTagName !== "").err("The name of the tag to compile variables in HTML cannot be null. Value type must be string")
    panic(typeof settings.variableTagName === "string").err("The name of the tag to compile variables in HTML cannot be null. Value type must be string")
}