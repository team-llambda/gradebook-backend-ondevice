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
    
        constructor(data: Element) {
            this.marks = []

            const markChildren = data.getElementsByTagName("Mark")
            for (var i = 0; i <= markChildren.length; i++) {
                this.marks.push(new Mark(markChildren.item(i)))
            }
            
            this.staffGU = data.getAttribute("StaffGU")
            this.period = data.getAttribute("Period")
            this.title = data.getAttribute("Title")
            this.room = data.getAttribute("Room")
            this.staff = data.getAttribute("Staff")
            this.staffEmail = data.getAttribute("StaffEMail")
        }
    }
}