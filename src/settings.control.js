import { control } from "./system-functions/error.js"

export const settingsControl = (settings) => {
    control(settings.dynamicTagBreakPoint).isNot({ value: settings.dynamicTagAttributeBreakPoint }).err("Dynamic Tag BreakPoint and dynamic Tag Attribute BreakPoint values ​​cannot be the same. Check your settings.")
    control(settings.variableTagName).isNot({ value: "" }).err("The name of the tag to compile variables in HTML cannot be null. Value type must be string")
    control(settings.variableTagName).is({ type: "string" }).err("The name of the tag to compile variables in HTML cannot be null. Value type must be string")
}