module EDUPoint {
    export class Child {
        studentGU: string
        childName: string
        organizationName: string
        grade: string

        constructor(data: any) {
            this.studentGU = data.attributes["StudentGU"]
            this.childName = data.getElementsByTagName("ChildName")[0].value
            this.organizationName = data.getElementsByTagName("OrganizationName")[0].value
            this.grade = data.getElementsByTagName("Grade")[0].value
            // this.childName = data.getElementsByTagName("ChildName")[0].childNodes[0].nodeValue
            // this.organizationName = data.getElementsByTagName("OrganizationName")[0].childNodes[0].nodeValue
            // this.grade = data.getElementsByTagName("Grade")[0].childNodes[0].nodeValue
        }
    }
}
