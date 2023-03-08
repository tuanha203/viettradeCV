export const ellipsShortNameFile = (name, start = 20, end = -13) => {

    const getName = name?.replace("https:\\/\\/api.viettrade.cssdemoco.com/public/files/", "")
    return getName.substr(0, start) + "..." + getName.substr(end)
}