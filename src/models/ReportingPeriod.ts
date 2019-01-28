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
    
        constructor(data: any) {
            this.index = +data.attributes["Index"]
            this.gradePeriod = data.attributes["GradePeriod"]
            this.startDate = dateFromAmericanShortFormat(data.attributes["StartDate"])
            this.endDate = dateFromAmericanShortFormat(data.attributes["EndDate"])
        }
    }
}