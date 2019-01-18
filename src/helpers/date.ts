/**
 * 1. OK: `MM/DD/YY` (where `YY == 19YY-19YY`, for example: `12 == 1912`).
 * 2. OK: `MM/DD/YYYY` 
 * 3. Not OK: `DD/MM/YYYY`
 * 4. Not OK: `YYYY/MM/DD`
 * 
 * @param {string} string 
 */
function dateFromAmericanShortFormat(input: string) {
    const firstDelimiterIndex = input.indexOf("/")
    const secondDelimiterIndex = input.indexOf("/", firstDelimiterIndex + 1)

    // "+" prefix casts the string into an integer.
    const monthNumber = +input.substring(0, firstDelimiterIndex)
    const dayNumber = +input.substring(firstDelimiterIndex + 1, secondDelimiterIndex)
    const yearNumber = +input.substring(secondDelimiterIndex + 1, input.length)

    return new Date(yearNumber, monthNumber - 1, dayNumber)
}