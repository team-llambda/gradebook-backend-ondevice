module EDUPoint {
    export class Child {
        studentGU: string
        childName: string
        organizationName: string
        grade: string

        constructor(data: Element) {
            this.studentGU = data.getAttribute("StudentGU")
            this.childName = data.getElementsByTagName("ChildName")[0].childNodes[0].nodeValue
            this.organizationName = data.getElementsByTagName("OrganizationName")[0].childNodes[0].nodeValue
            this.grade = data.getElementsByTagName("Grade")[0].childNodes[0].nodeValue
        }
    }
}