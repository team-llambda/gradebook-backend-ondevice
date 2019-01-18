module EDUPoint {
    export class AssignmentGradeCalc {
        type: string
        weight: number

        /**
         * 
         * @param type The name of this category.
         * @param weight The percentage weight of this category in decimal form (e.g. `75% == 0.75`). This value cannot be exceed `1.0`.
         */
        constructor(type: string, weight: number) {
            if (weight > 1.0) {
                throw ("Weight must be less than or equal to 100% (`1.0`).")
            }

            this.type = type
            this.weight = weight
        }

        static initializeFromElement(data: Element): AssignmentGradeCalc {
            const typeValue = data.getAttribute("Type")
            const weightValueAsPercentage = data.getAttribute("Weight")
            const weightValueAsDecimal = +weightValueAsPercentage.substring(0, weightValueAsPercentage.indexOf("%")) / 100

            return new AssignmentGradeCalc(typeValue, weightValueAsDecimal)
        }
    }
}