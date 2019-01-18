module EDUPoint {
    export class Course {
        staffGU: string
        period: string
        title: string
        room: string
        staff: string
        staffEmail: string
        marks: Mark[]
    
        constructor(data: Element) {
            this.marks = []
            const markElements = data.getElementsByTagName("Mark")
            for (var index = 0; index <= markElements.length; index++) {
                const item = markElements.item(index)
                if (item == null) { continue }
                this.marks.push(new Mark(item))
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