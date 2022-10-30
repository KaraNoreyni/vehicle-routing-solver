export function dateToLocalDateTimeFormat(date) {
    console.log(date.getTimezoneOffset() * 60000)
    console.log(new Date(date.getTime() ))
    const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    var yyyymmdd = d.toISOString()
    return yyyymmdd
}
