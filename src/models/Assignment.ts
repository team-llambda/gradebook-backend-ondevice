module EDUPoint {
    export class Assignment {
        gradebookID: string
        measure: string
        type: string
        date?: Date
        dueDate?: Date
        scoreString: string
        scoreType: string
        pointsString: string
        notes?: string

        constructor(data: Element) {
            this.gradebookID = data.getAttribute("GradebookID")
            this.measure = data.getAttribute("Measure")
            this.type = data.getAttribute("Type")
            this.date = dateFromAmericanShortFormat(data.getAttribute("Date"))
            this.dueDate =  dateFromAmericanShortFormat(data.getAttribute("DueDate"))
            this.scoreString = data.getAttribute("Score")
            this.scoreType = data.getAttribute("ScoreType")
            this.pointsString = data.getAttribute("Points")
            this.notes = data.getAttribute("Notes")
        }
    }
}