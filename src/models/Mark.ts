module EDUPoint {
    export class Mark {
        name: string
        calculatedScoreString: string
        calculatedScoreRaw: string
        assignments: EDUPoint.Assignment[]
    
        constructor(data: Element) {
            this.assignments = []
    
            const assignmentChildren = [...data.getElementsByTagName("Assignment")]
            assignmentChildren.forEach(element => {
                this.assignments.push(Assignment.initializeFromElement(element))
            })
    
            this.name = data.getAttribute("MarkName")
            this.calculatedScoreString = data.getAttribute("CalculatedScoreString")
            this.calculatedScoreRaw = data.getAttribute("CalculatedScoreRaw")
        }
    }
}