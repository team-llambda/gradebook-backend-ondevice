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

            const markChildren = [...data.getElementsByTagName("Mark")]
            markChildren.forEach(child => {
                this.marks.push(new Mark(child))
            })
    
            this.staffGU = data.getAttribute("StaffGU")
            this.period = data.getAttribute("Period")
            this.title = data.getAttribute("Title")
            this.room = data.getAttribute("Room")
            this.staff = data.getAttribute("Staff")
            this.staffEmail = data.getAttribute("StaffEMail")
        }
    }
}