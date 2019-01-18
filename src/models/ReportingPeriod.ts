module EDUPoint {
    export class ReportingPeriod {
        index: number
        gradePeriod: string
        startDate: Date
        endDate: Date
    
        constructor(data: Element) {
            this.index = +data.getAttribute("Index")
            this.gradePeriod = data.getAttribute("GradePeriod")
            this.startDate = dateFromAmericanShortFormat(data.getAttribute("StartDate"))
            this.endDate = dateFromAmericanShortFormat(data.getAttribute("EndDate"))
        }
    }
}