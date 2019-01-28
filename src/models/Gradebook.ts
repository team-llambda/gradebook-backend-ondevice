module EDUPoint {
    export class Gradebook {
        static schema = {
            name: "Gradebook",
            properties: {
                reportingPeriods: "ReportingPeriod[]",
                courses: "Course[]"
            }
        }
        
        reportingPeriods: ReportingPeriod[]
        courses: Course[]
    
        constructor(data: string) {
            console.log(data)
            this.reportingPeriods = []

            const parsedData = new XMLParser().parseFromString(data)
            const allReportingPeriods = parsedData.getElementsByTagName("ReportingPeriods")

            for (var reportPeriodIndex = 0; reportPeriodIndex <= allReportingPeriods.length; reportPeriodIndex++) {
                const individualReportPeriods = allReportingPeriods.item(reportPeriodIndex).children
                for (var individualIndex = 0; individualIndex <= individualReportPeriods.length; individualIndex++) {
                    this.reportingPeriods.push(new ReportingPeriod(individualReportPeriods.item(individualIndex)))
                }
            }

            this.courses = []
            const coursesElements = parsedData.getElementsByTagName("Course")
            for (var index = 0; index <= coursesElements.length; index++) {
                const item = coursesElements.item(index)
                if (item == null) { continue }

                this.courses.push(new Course(item))
            }
        }
    }
}
