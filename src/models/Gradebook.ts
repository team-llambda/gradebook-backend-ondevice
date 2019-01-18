module EDUPoint {
    export class Gradebook {
        reportingPeriods: ReportingPeriod[]
        courses: Course[]
    
        constructor(data: Document) {
            console.log(data)
            this.reportingPeriods = []
            const allReportingPeriods = data.getElementsByTagName("ReportingPeriods")

            for (var index = 0; index <= allReportingPeriods.length; index++) {
                const individualReportPeriod = allReportingPeriods.item(index).getElementsByClassName("ReportingPeriod")

                for (var index = 0; index <= individualReportPeriod.length; index++) {
                    const item = individualReportPeriod.item(index)
                    if (item == null) { continue }

                    this.reportingPeriods.push(new ReportingPeriod(item))
                }
            }
    
            this.courses = []
            const coursesElements = data.getElementsByTagName("Course")
            for (var index = 0; index <= coursesElements.length; index++) {
                const item = coursesElements.item(index)
                if (item == null) { continue }

                this.courses.push(new Course(item))
            }
        }
    }
}