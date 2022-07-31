
const dateOptions = { hour: 'numeric', minute: 'numeric', hour12: true }

export function formatDate(dateText, options) {
    const date = new Date(dateText)
    return new Intl.DateTimeFormat(
        "fr-FR", options).format(date)
}