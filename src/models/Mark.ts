module EDUPoint {
    export class Mark {
        name: string
        calculatedScoreString: string
        calculatedScoreRaw: string
        gradeCalculation: AssignmentGradeCalc[]
        assignments: Assignment[]
    
        constructor(data: Element) {
            this.gradeCalculation = []
            this.assignments = []

            const gradeCalculationChildren = [...data.getElementsByTagName("AssignmentGradeCalc")]
            gradeCalculationChildren.forEach(element => {
                this.gradeCalculation.push(AssignmentGradeCalc.initializeFromElement(element))
            })
    
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