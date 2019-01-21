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
        if (this.actualScore == 0 || this.assignedScore == 0) { return 0 }
        return (this.actualScore / this.assignedScore) * this.weight
    }
}
