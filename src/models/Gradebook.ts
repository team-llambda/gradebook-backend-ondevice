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
    
        constructor(data: Document) {
            console.log(data)
            this.reportingPeriods = []
            const allReportingPeriods = [...data.getElementsByTagName("ReportingPeriods")]

            allReportingPeriods.forEach(items => {
                const individualReportPeriods = [...items.children]
                individualReportPeriods.forEach(reportPeriod => {
                    this.reportingPeriods.push(new ReportingPeriod(reportPeriod))
                })
            })

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
