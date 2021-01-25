import { control } from "./error.js"

export const settingsControl = (settings) => {
    control(settings.dynamicTagBreakPoint !== settings.dynamicTagAttributeBreakPoint).err("Dynamic Tag BreakPoint and dynamic Tag Attribute BreakPoint values ​​cannot be the same. Check your settings.")
    control(settings.variableTagName !== "").err("The name of the tag to compile variables in HTML cannot be null. Value type must be string")
    control(typeof settings.variableTagName === "string").err("The name of the tag to compile variables in HTML cannot be null. Value type must be string")
}