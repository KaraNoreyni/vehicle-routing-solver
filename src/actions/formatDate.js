
const dateOptions = { hour: 'numeric', minute: 'numeric', hour12: true }

export function formatDate(dateText, options) {
    const date = new Date(dateText.slice(0, 16))
    console.log(dateText)
    return new Intl.DateTimeFormat(
        "fr-FR", dateOptions).format(date)
}

const dateTimeOptions = { hour: 'numeric', minute: 'numeric', hour12: true }

export function formatDateTime(dateText, options) {
    const date = new Date(dateText.slice(0, 16))
    console.log(dateText)
    return new Intl.DateTimeFormat(
        "fr-FR", dateTimeOptions).format(date)
}