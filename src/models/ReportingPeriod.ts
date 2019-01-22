module EDUPoint {
    export class ReportingPeriod {
        static schema = {
            name: "ReportingPeriod",
            properties: {
                index: "number",
                gradePeriod: "string",
                startDate: "date",
                endDate: "date"
            }
        }

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