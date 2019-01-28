module EDUPoint {
    export class Mark {
        static schema = {
            name: "Mark",
            properties: {
                name: "string",
                calculatedScoreString: "string",
                calculatedScoreRaw: "string",
                gradeCalculation: "AssignmentGradeCalc[]",
                assignments: "Assignment[]"                
            }
        }

        name: string
        calculatedScoreString: string
        calculatedScoreRaw: string
        gradeCalculation: AssignmentGradeCalc[]
        assignments: Assignment[]
    
        constructor(data: Element) {
            this.gradeCalculation = []
            this.assignments = []

            const gradeCalculationChildren = data.getElementsByTagName("AssignmentGradeCalc")
            for (var i = 0; i <= gradeCalculationChildren.length; i++) {
                const gradeCalculation = gradeCalculationChildren[i]
                if (gradeCalculation == undefined) continue

                const gradeCalc = AssignmentGradeCalc.initializeFromElement(gradeCalculation)
                if (gradeCalc.type != "TOTAL") this.gradeCalculation.push(gradeCalc)
            }
    
            const assignmentChildren = data.getElementsByTagName("Assignment")
            for (var i = 0; i <= assignmentChildren.length; i++) {
                const assignment = assignmentChildren[i]
                if (assignment == undefined) continue

                this.assignments.push(Assignment.initializeFromElement(assignment))
            }

            this.name = data.attributes["MarkName"]
            this.calculatedScoreString = data.attributes["CalculatedScoreString"]
            this.calculatedScoreRaw = data.attributes["CalculatedScoreRaw"]
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