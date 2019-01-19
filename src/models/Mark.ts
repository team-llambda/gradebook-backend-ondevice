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
                const gradeCalc = AssignmentGradeCalc.initializeFromElement(element)
                if (gradeCalc.type != "TOTAL") {
                    this.gradeCalculation.push(AssignmentGradeCalc.initializeFromElement(element))
                }
            })
    
            const assignmentChildren = [...data.getElementsByTagName("Assignment")]
            assignmentChildren.forEach(element => {
                this.assignments.push(Assignment.initializeFromElement(element))
            })
    
            this.name = data.getAttribute("MarkName")
            this.calculatedScoreString = data.getAttribute("CalculatedScoreString")
            this.calculatedScoreRaw = data.getAttribute("CalculatedScoreRaw")
        }

        get calculateScore(): number | null {
            var calculations: CalculateMarkScore[] = []
            this.gradeCalculation.forEach(calc => {
                calculations.push(new CalculateMarkScore(calc))
            })

            this.assignments.forEach(assignment => {
                calculations.forEach((markScore, index) => {
                    if (markScore.type == assignment.type) {
                        const assignmentActualScore = assignment.actualScore
                        if (assignmentActualScore != null) {
                            calculations[index].actualScore += assignmentActualScore
                            calculations[index].assignedScore += assignment.assignedScore
                        }
                    }
                })
            })

            var totalWeighted = 0
            calculations.forEach(object => {
                totalWeighted += object.weightedScore
            })

            return totalWeighted
        }
    }
}