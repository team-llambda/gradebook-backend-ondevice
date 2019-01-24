var EDUPoint;
(function (EDUPoint) {
    let WebServiceFunction;
    (function (WebServiceFunction) {
        WebServiceFunction[WebServiceFunction["Gradebook"] = 0] = "Gradebook";
        WebServiceFunction[WebServiceFunction["ChildList"] = 1] = "ChildList";
    })(WebServiceFunction = EDUPoint.WebServiceFunction || (EDUPoint.WebServiceFunction = {}));
    function WebServiceFunctionParameter(serviceFunction) {
        switch (serviceFunction) {
            case WebServiceFunction.Gradebook: return "<Parms><ChildIntID>0</ChildIntID></Parms>";
            case WebServiceFunction.ChildList: return "";
        }
    }
    EDUPoint.WebServiceFunctionParameter = WebServiceFunctionParameter;
})(EDUPoint || (EDUPoint = {}));
var EDUPoint;
(function (EDUPoint) {
    class PXPWebServices {
        constructor(userID, password, edupointBaseURL) {
            this.basePath = "Service/PXPCommunication.asmx/ProcessWebServiceRequest";
            this.userID = userID;
            this.password = password;
            this.edupointBaseURL = edupointBaseURL;
        }
        processWebRequest(functionToRun) {
            const fullURL = this.edupointBaseURL + this.basePath;
            const requestParameters = {
                userID: this.userID,
                password: this.password,
                skipLoginLog: "false",
                parent: "false",
                webServiceHandleName: 'PXPWebServices',
                methodName: EDUPoint.WebServiceFunction[functionToRun],
                paramStr: EDUPoint.WebServiceFunctionParameter(functionToRun)
            };
            return new Promise((resolve, reject) => {
                this.post(fullURL, requestParameters).then(document => {
                    const body = document.getElementsByTagName("string")[0].childNodes[0].nodeValue;
                    const xmlBody = new DOMParser().parseFromString(body, "text/xml");
                    var error = xmlBody.getElementsByTagName("RT_ERROR")[0];
                    if (error != null) {
                        reject(Error(error.getAttribute("ERROR_MESSAGE")));
                    }
                    else {
                        resolve(xmlBody);
                    }
                }, (function () {
                    reject();
                }));
            });
        }
        post(url, parameters) {
            return new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();
                request.open('POST', url, true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                request.onload = function () {
                    if (request.status >= 200 && request.status < 400) {
                        resolve(request.responseXML);
                    }
                    else {
                        reject(request.responseText);
                    }
                };
                request.onerror = function () {
                    reject("Failed due to an unknown reason.");
                };
                request.send(serialize(parameters));
            });
        }
        getGradebook() {
            return new Promise((resolve, reject) => {
                this.processWebRequest(EDUPoint.WebServiceFunction.Gradebook).then(xml => {
                    resolve(new EDUPoint.Gradebook(xml));
                }).catch(error => {
                    reject(error);
                });
            });
        }
        getChildList() {
            return new Promise((resolve, reject) => {
                this.processWebRequest(EDUPoint.WebServiceFunction.ChildList).then(xml => {
                    const childElement = xml.getElementsByTagName("Child");
                    if (childElement.length <= 0) {
                        reject(new Error("An unknown error occurred."));
                    }
                    resolve(new EDUPoint.Child(childElement[0]));
                }).catch(error => {
                    reject(error);
                });
            });
        }
    }
    EDUPoint.PXPWebServices = PXPWebServices;
})(EDUPoint || (EDUPoint = {}));
/**
 * 1. OK: `MM/DD/YY` (where `YY == 19YY-19YY`, for example: `12 == 1912`).
 * 2. OK: `MM/DD/YYYY`
 * 3. Not OK: `DD/MM/YYYY`
 * 4. Not OK: `YYYY/MM/DD`
 *
 * @param {string} string
 */
function dateFromAmericanShortFormat(input) {
    const firstDelimiterIndex = input.indexOf("/");
    const secondDelimiterIndex = input.indexOf("/", firstDelimiterIndex + 1);
    // "+" prefix casts the string into an integer.
    const monthNumber = +input.substring(0, firstDelimiterIndex);
    const dayNumber = +input.substring(firstDelimiterIndex + 1, secondDelimiterIndex);
    const yearNumber = +input.substring(secondDelimiterIndex + 1, input.length);
    return new Date(yearNumber, monthNumber - 1, dayNumber);
}
function serialize(obj) {
    var str = [];
    for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
}
var EDUPoint;
(function (EDUPoint) {
    class Assignment {
        constructor(isArbitrary, type, assignedScore, actualScore, notes) {
            this.isArbitrary = isArbitrary;
            this.type = type;
            this.actualScore = actualScore;
            this.assignedScore = assignedScore;
            this.notes = notes;
        }
        static initializeFromElement(data) {
            const type = data.getAttribute("Type");
            const notes = data.getAttribute("Notes");
            const parsedScores = parseScore(data.getAttribute("Points"));
            var assignment = new Assignment(false, type, parsedScores[0], parsedScores[1], notes);
            assignment.gradebookID = data.getAttribute("GradebookID");
            assignment.measure = data.getAttribute("Measure");
            assignment.date = dateFromAmericanShortFormat(data.getAttribute("Date"));
            assignment.dueDate = dateFromAmericanShortFormat(data.getAttribute("DueDate"));
            return assignment;
        }
        /**
         * @returns A percentage (in decimal form) of this assignment's scores. `null` implies that this assignment hasn't been graded yet.
         */
        get scorePercentage() {
            if (this.actualScore == null) {
                return null;
            }
            if (this.assignedScore == 0) {
                return this.actualScore;
            } // Extra credit.
            return this.actualScore / this.assignedScore;
        }
    }
    Assignment.schema = {
        name: "Assignemnt",
        properties: {
            gradebookID: "string?",
            measure: "string?",
            type: "string",
            date: "date?",
            dueDate: "date?"
        }
    };
    EDUPoint.Assignment = Assignment;
})(EDUPoint || (EDUPoint = {}));
/**
 * @param scoreString: The string to parse. Can be null/empty.
 *
 * @returns: First number is `assignedScore`. Second number is `actualScore?`. Returns `null` if invalid parameter was given.
 */
function parseScore(scoreString) {
    if (scoreString == null || scoreString.length <= 0) {
        return null;
    }
    const delimiterIndex = scoreString.indexOf("/");
    // Ungraded assignment only return an assigned score.
    if (delimiterIndex <= -1) {
        return [+scoreString.substring(0, scoreString.indexOf(" ")), null];
    }
    const assigned = +scoreString.substring(delimiterIndex + 1, scoreString.length - 1); // plus one for the trailing space.
    const actual = +scoreString.substring(0, delimiterIndex - 1); // minus one for the leading space.
    return [assigned, actual];
}
/**
 * <Assignment GradebookID="258296" Measure="Song Presentation" Type="Total Points" Date="11/1/2018" DueDate="1/18/2019" Score="135 out of 150.0000" ScoreType="Raw Score" Points="135.00 / 150.0000" Notes="" TeacherID="3474" StudentID="4634" MeasureDescription="" HasDropBox="false" DropStartDate="11/1/2018" DropEndDate="11/2/2018">
 */
var EDUPoint;
(function (EDUPoint) {
    class AssignmentGradeCalc {
        /**
         *
         * @param type The name of this category.
         * @param weight The percentage weight of this category in decimal form (e.g. `75% == 0.75`). This value cannot be exceed `1.0`.
         */
        constructor(type, weight) {
            if (weight > 1.0) {
                throw "Weight must be less than or equal to 100% (`1.0`).";
            }
            this.type = type;
            this.weight = weight;
        }
        static initializeFromElement(data) {
            const typeValue = data.getAttribute("Type");
            const weightValueAsPercentage = data.getAttribute("Weight");
            const weightValueAsDecimal = +weightValueAsPercentage.substring(0, weightValueAsPercentage.indexOf("%")) / 100;
            return new AssignmentGradeCalc(typeValue, weightValueAsDecimal);
        }
    }
    AssignmentGradeCalc.schema = {
        name: "AssignmentGradeCalc",
        properties: {
            type: "string",
            weight: "number"
        }
    };
    EDUPoint.AssignmentGradeCalc = AssignmentGradeCalc;
})(EDUPoint || (EDUPoint = {}));
class CalculateMarkScore {
    constructor(gradeCalc) {
        this.type = gradeCalc.type;
        this.weight = gradeCalc.weight;
        this.actualScore = 0;
        this.assignedScore = 0;
    }
    /**
     * @returns: The weighted score of this category as a percentage (in decimal form).
     */
    get weightedScore() {
        if (this.actualScore == 0 || this.assignedScore == 0) {
            return 0;
        }
        return (this.actualScore / this.assignedScore) * this.weight;
    }
}
var EDUPoint;
(function (EDUPoint) {
    class Child {
        constructor(data) {
            this.studentGU = data.getAttribute("StudentGU");
            this.childName = data.getElementsByTagName("ChildName")[0].childNodes[0].nodeValue;
            this.organizationName = data.getElementsByTagName("OrganizationName")[0].childNodes[0].nodeValue;
            this.grade = data.getElementsByTagName("Grade")[0].childNodes[0].nodeValue;
        }
    }
    EDUPoint.Child = Child;
})(EDUPoint || (EDUPoint = {}));
var EDUPoint;
(function (EDUPoint) {
    class Course {
        constructor(data) {
            this.marks = [];
            const markChildren = [...data.getElementsByTagName("Mark")];
            markChildren.forEach(child => {
                this.marks.push(new EDUPoint.Mark(child));
            });
            this.staffGU = data.getAttribute("StaffGU");
            this.period = data.getAttribute("Period");
            this.title = data.getAttribute("Title");
            this.room = data.getAttribute("Room");
            this.staff = data.getAttribute("Staff");
            this.staffEmail = data.getAttribute("StaffEMail");
        }
    }
    Course.schema = {
        name: "Course",
        properties: {
            staffGU: "string",
            period: "string",
            title: "string",
            room: "string",
            staff: "string",
            staffEmail: "string",
            marks: "Mark[]"
        }
    };
    EDUPoint.Course = Course;
})(EDUPoint || (EDUPoint = {}));
var EDUPoint;
(function (EDUPoint) {
    class Gradebook {
        constructor(data) {
            console.log(data);
            this.reportingPeriods = [];
            const allReportingPeriods = [...data.getElementsByTagName("ReportingPeriods")];
            allReportingPeriods.forEach(items => {
                const individualReportPeriods = [...items.children];
                individualReportPeriods.forEach(reportPeriod => {
                    this.reportingPeriods.push(new EDUPoint.ReportingPeriod(reportPeriod));
                });
            });
            this.courses = [];
            const coursesElements = data.getElementsByTagName("Course");
            for (var index = 0; index <= coursesElements.length; index++) {
                const item = coursesElements.item(index);
                if (item == null) {
                    continue;
                }
                this.courses.push(new EDUPoint.Course(item));
            }
        }
    }
    Gradebook.schema = {
        name: "Gradebook",
        properties: {
            reportingPeriods: "ReportingPeriod[]",
            courses: "Course[]"
        }
    };
    EDUPoint.Gradebook = Gradebook;
})(EDUPoint || (EDUPoint = {}));
var EDUPoint;
(function (EDUPoint) {
    class Mark {
        constructor(data) {
            this.gradeCalculation = [];
            this.assignments = [];
            const gradeCalculationChildren = [...data.getElementsByTagName("AssignmentGradeCalc")];
            gradeCalculationChildren.forEach(element => {
                const gradeCalc = EDUPoint.AssignmentGradeCalc.initializeFromElement(element);
                if (gradeCalc.type != "TOTAL") {
                    this.gradeCalculation.push(EDUPoint.AssignmentGradeCalc.initializeFromElement(element));
                }
            });
            const assignmentChildren = [...data.getElementsByTagName("Assignment")];
            assignmentChildren.forEach(element => {
                this.assignments.push(EDUPoint.Assignment.initializeFromElement(element));
            });
            this.name = data.getAttribute("MarkName");
            this.calculatedScoreString = data.getAttribute("CalculatedScoreString");
            this.calculatedScoreRaw = data.getAttribute("CalculatedScoreRaw");
        }
        /**
         * @returns: Returns `null` if there are no assignments.
         */
        get calculateScore() {
            if (this.assignments.length <= 0)
                return null;
            // Disregard ungraded assignments
            const gradedAssignments = this.assignments.filter(value => value.actualScore != null);
            // If there are no grade calculation types, then just count it as is.
            if (this.gradeCalculation.length <= 0) {
                const totalActualScore = gradedAssignments.reduce((accum, current) => accum += current.actualScore, 0);
                const totalAssignedScore = gradedAssignments.reduce((accum, current) => accum += current.assignedScore, 0);
                return totalActualScore / totalAssignedScore;
            }
            var calculations = [];
            this.gradeCalculation.forEach(calc => calculations.push(new CalculateMarkScore(calc)));
            gradedAssignments.forEach(assignment => {
                calculations.forEach((markScore, index) => {
                    if (assignment.type.length <= 0 || markScore.type == assignment.type) {
                        calculations[index].actualScore += assignment.actualScore;
                        calculations[index].assignedScore += assignment.assignedScore;
                    }
                });
            });
            // Remove empty categories
            calculations = calculations.filter(calc => calc.actualScore != 0 && calc.assignedScore != 0);
            // Issue #1: If the weight total of non-zero categories do not add up to 100%, scale all other weights so it's equal to 100%.
            const weightSum = calculations.reduce((accum, current) => accum += current.weight, 0);
            const scaleFactor = 1 / weightSum;
            calculations.forEach(calc => calc.weight *= scaleFactor);
            return calculations.reduce((accum, calc) => accum += calc.weightedScore, 0);
        }
    }
    Mark.schema = {
        name: "Mark",
        properties: {
            name: "string",
            calculatedScoreString: "string",
            calculatedScoreRaw: "string",
            gradeCalculation: "AssignmentGradeCalc[]",
            assignments: "Assignment[]"
        }
    };
    EDUPoint.Mark = Mark;
})(EDUPoint || (EDUPoint = {}));
var EDUPoint;
(function (EDUPoint) {
    class ReportingPeriod {
        constructor(data) {
            this.index = +data.getAttribute("Index");
            this.gradePeriod = data.getAttribute("GradePeriod");
            this.startDate = dateFromAmericanShortFormat(data.getAttribute("StartDate"));
            this.endDate = dateFromAmericanShortFormat(data.getAttribute("EndDate"));
        }
    }
    ReportingPeriod.schema = {
        name: "ReportingPeriod",
        properties: {
            index: "number",
            gradePeriod: "string",
            startDate: "date",
            endDate: "date"
        }
    };
    EDUPoint.ReportingPeriod = ReportingPeriod;
})(EDUPoint || (EDUPoint = {}));
//# sourceMappingURL=app.js.map

module.exports = { EDUPoint }