// Midnight normalization makes each bound include its full calendar day.

function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function today() {
    return startOfDay(new Date())
}

export function yearsFromToday(years: number) {
    const date = today()
    date.setFullYear(date.getFullYear() + years)
    return date
}
