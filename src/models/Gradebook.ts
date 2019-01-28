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
    
        constructor(data) {
            console.log(data)
            this.reportingPeriods = []

            // const parsedData = new XMLParser().parseFromString(data)
            const allReportingPeriods = data.getElementsByTagName("ReportingPeriods")

            for (var reportPeriodIndex = 0; reportPeriodIndex <= allReportingPeriods.length; reportPeriodIndex++) {
                const reportingPeriods = allReportingPeriods[reportPeriodIndex]
                if (reportingPeriods == undefined) continue
                const individualReportPeriods = reportingPeriods.children

                for (var individualIndex = 0; individualIndex <= individualReportPeriods.length; individualIndex++) {
                    const period = individualReportPeriods[individualIndex]
                    if (period == undefined) continue
                    this.reportingPeriods.push(new ReportingPeriod(period))
                }
            }

            this.courses = []
            const coursesElements = data.getElementsByTagName("Course")
            for (var index = 0; index <= coursesElements.length; index++) {
                const item = coursesElements[index]
                if (item == undefined) continue

                this.courses.push(new Course(item))
            }
        }
    }
}
