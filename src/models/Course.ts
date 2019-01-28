module EDUPoint {
    export class Course {
        static schema = {
            name: "Course",
            properties: {
                staffGU: "string",
                period: "string",
                title: "string",
                room: "string",
                staff: "string",
                staffEmail: "string",
                marks: "Mark[]"
            }
        }
        
        staffGU: string
        period: string
        title: string
        room: string
        staff: string
        staffEmail: string
        marks: Mark[]
    
        constructor(data: any) {
            this.marks = []

            const markChildren = data.getElementsByTagName("Mark")
            for (var i = 0; i <= markChildren.length; i++) {
                const mark = markChildren[i]
                if (mark == undefined) continue
                this.marks.push(new Mark(mark))
            }
            
            this.staffGU =      data.attributes["StaffGU"]
            this.period =       data.attributes["Period"]
            this.title =        data.attributes["Title"]
            this.room =         data.attributes["Room"]
            this.staff =        data.attributes["Staff"]
            this.staffEmail =   data.attributes["StaffEmail"]
        }
    }
}