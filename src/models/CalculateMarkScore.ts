class CalculateMarkScore {
    type: string
    weight: number
    actualScore: number
    assignedScore: number

    constructor(gradeCalc: EDUPoint.AssignmentGradeCalc) {
        this.type = gradeCalc.type
        this.weight = gradeCalc.weight
        this.actualScore = 0
        this.assignedScore = 0
    }

    /**
     * @returns: The weighted score of this category as a percentage (in decimal form).
     */
    get weightedScore(): number {
        return (this.weight * this.actualScore) / this.assignedScore
    }
}
