module EDUPoint {
    export class Assignment {
        static schema = {
            name: "Assignemnt",
            properties: {
                gradebookID: "string?",
                measure: "string?",
                type: "string",
                date: "date?",
                dueDate: "date?"
            }
        }

        gradebookID?: string
        measure?: string
        type: string
        date?: Date
        dueDate?: Date

        // `null` implies that this assignment hasn't been graded yet.
        actualScore?: number
        assignedScore: number
        notes?: string

        // Is this an assignment not on the sever (e.g. user-created)?
        isArbitrary: boolean

        constructor(isArbitrary: boolean, type: string, assignedScore: number, actualScore?: number, notes?: string) {
            this.isArbitrary = isArbitrary
            this.type = type
            this.actualScore = actualScore
            this.assignedScore = assignedScore
            this.notes = notes
        }

        static initializeFromElement(data: Element): Assignment {
            const type = data.getAttribute("Type")
            const notes = data.getAttribute("Notes")

            const parsedScores = parseScore(data.getAttribute("Points"))

            var assignment = new Assignment(false, type, parsedScores[0], parsedScores[1], notes)
            assignment.gradebookID = data.getAttribute("GradebookID")
            assignment.measure = data.getAttribute("Measure")
            assignment.date = dateFromAmericanShortFormat(data.getAttribute("Date"))
            assignment.dueDate =  dateFromAmericanShortFormat(data.getAttribute("DueDate"))
            
            return assignment
        }

        /**
         * @returns A percentage (in decimal form) of this assignment's scores. `null` implies that this assignment hasn't been graded yet.
         */
        get scorePercentage(): number | null {
            if (this.actualScore == null) { return null }
            if (this.assignedScore == 0) { return this.actualScore }    // Extra credit.

            return this.actualScore / this.assignedScore
        }
    }
}

/**
 * @param scoreString: The string to parse. Can be null/empty.
 * 
 * @returns: First number is `assignedScore`. Second number is `actualScore?`. Returns `null` if invalid parameter was given.
 */
function parseScore(scoreString: string): [number | null, number] | null {
    if (scoreString == null || scoreString.length <= 0) { return null }

    const delimiterIndex = scoreString.indexOf("/")

    // Ungraded assignment only return an assigned score.
    if (delimiterIndex <= -1) {
        return [+scoreString.substring(0, scoreString.indexOf(" ")), null]
    }

    const assigned = +scoreString.substring(delimiterIndex + 1, scoreString.length - 1)    // plus one for the trailing space.
    const actual = +scoreString.substring(0, delimiterIndex - 1)                           // minus one for the leading space.

    return [assigned, actual]
}

/**
 * <Assignment GradebookID="258296" Measure="Song Presentation" Type="Total Points" Date="11/1/2018" DueDate="1/18/2019" Score="135 out of 150.0000" ScoreType="Raw Score" Points="135.00 / 150.0000" Notes="" TeacherID="3474" StudentID="4634" MeasureDescription="" HasDropBox="false" DropStartDate="11/1/2018" DropEndDate="11/2/2018">
 */
