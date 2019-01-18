module EDUPoint {
    export class Mark {
        name: string
        calculatedScoreString: string
        calculatedScoreRaw: string
        assignments: EDUPoint.Assignment[]
    
        constructor(data: Element) {
            this.assignments = []
    
            const assignmentElements = data.getElementsByTagName("Assignment")
            for (var index = 0; index <= assignmentElements.length; index++) {
                const item = assignmentElements.item(index)
                if (item == null) { continue }
                this.assignments.push(new Assignment(item))
            }
    
            this.name = data.getAttribute("MarkName")
            this.calculatedScoreString = data.getAttribute("CalculatedScoreString")
            this.calculatedScoreRaw = data.getAttribute("CalculatedScoreRaw")
        }
    }
}