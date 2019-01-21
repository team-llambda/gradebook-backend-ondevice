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

        /**
         * @returns: Returns `null` if there are no assignments.
         */
        get calculateScore(): number | null {
            if (this.assignments.length <= 0) return null

            // Disregard ungraded assignments
            const gradedAssignments = this.assignments.filter(value => value.actualScore != null)

            // If there are no grade calculation types, then just count it as is.
            if (this.gradeCalculation.length <= 0) {
                const totalActualScore = gradedAssignments.reduce((accum, current) => accum += current.actualScore, 0)
                const totalAssignedScore = gradedAssignments.reduce((accum, current) => accum += current.assignedScore, 0)

                return totalActualScore / totalAssignedScore
            }

            var calculations: CalculateMarkScore[] = []
            this.gradeCalculation.forEach(calc => calculations.push(new CalculateMarkScore(calc)))

            gradedAssignments.forEach(assignment => {
                calculations.forEach((markScore, index) => {
                    if (assignment.type.length <= 0 || markScore.type == assignment.type) {
                        calculations[index].actualScore += assignment.actualScore
                        calculations[index].assignedScore += assignment.assignedScore
                    }
                })
            })
            
            // Remove empty categories
            calculations = calculations.filter(calc => calc.actualScore != 0 && calc.assignedScore != 0)

            // Issue #1: If the weight total of non-zero categories do not add up to 100%, scale all other weights so it's equal to 100%.
            const weightSum = calculations.reduce((accum, current) => accum += current.weight, 0)
            const scaleFactor = 1 / weightSum
            calculations.forEach(calc => calc.weight *= scaleFactor)

            return calculations.reduce((accum, calc) => accum += calc.weightedScore, 0)
        }
    }
}