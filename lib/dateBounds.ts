/* Selectable-range bounds for DatePicker. Bounds are normalised to midnight so a
 * bound includes the whole day it names. */

function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function today() {
    return startOfDay(new Date())
}

/** The same month/day, `years` ahead of today. Negative years go into the past. */
export function yearsFromToday(years: number) {
    const date = today()
    date.setFullYear(date.getFullYear() + years)
    return date
}
