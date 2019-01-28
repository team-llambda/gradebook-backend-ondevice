var EDUPoint;
(function (EDUPoint) {
    var WebServiceFunction;
    (function (WebServiceFunction) {
        WebServiceFunction[WebServiceFunction["Gradebook"] = 0] = "Gradebook";
        WebServiceFunction[WebServiceFunction["ChildList"] = 1] = "ChildList";
    })(WebServiceFunction = EDUPoint.WebServiceFunction || (EDUPoint.WebServiceFunction = {}));
})(EDUPoint || (EDUPoint = {}));
//# sourceMappingURL=PXPWebServices+Functions.js.map
var EDUPoint;
(function (EDUPoint) {
    var PXPWebServices = /** @class */ (function () {
        function PXPWebServices(userID, password, edupointBaseURL) {
            this.basePath = "Service/PXPCommunication.asmx/ProcessWebServiceRequest";
            this.userID = userID;
            this.password = password;
            this.edupointBaseURL = edupointBaseURL;
        }
        PXPWebServices.prototype.processWebRequest = function (functionToRun, parameters) {
            var _this = this;
            var fullURL = this.edupointBaseURL + this.basePath;
            var requestParameters = {
                userID: this.userID,
                password: this.password,
                skipLoginLog: "false",
                parent: "false",
                webServiceHandleName: 'PXPWebServices',
                methodName: EDUPoint.WebServiceFunction[functionToRun],
                paramStr: parameters || ""
            };
            return new Promise(function (resolve, reject) {
                _this.post(fullURL, requestParameters).then(function (documentParser) {
                    var body = documentParser.getElementsByTagName("string")[0].value;
                    var fixedBody = body.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                    var xmlBody = new XMLParser().parseFromString(fixedBody);
                    // const xmlBody = new DOMParser().parseFromString(body, "text/xml")
                    var error = xmlBody.getElementsByTagName("RT_ERROR")[0];
                    if (error != null) {
                        reject(Error(error.attributes["ERROR_MESSAGE"]));
                    }
                    else {
                        resolve(xmlBody);
                    }
                }, (function () {
                    reject();
                }));
            });
        };
        PXPWebServices.prototype.post = function (url, parameters) {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.open('POST', url, true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                request.onload = function () {
                    var response = new XMLParser().parseFromString(request.responseText);
                    if (request.status >= 200 && request.status < 400) {
                        resolve(response);
                    }
                    else {
                        reject(response);
                    }
                };
                request.onerror = function () {
                    reject("Failed due to an unknown reason.");
                };
                request.send(serialize(parameters));
            });
        };
        PXPWebServices.prototype.getGradebook = function (reportingPeriodIndex) {
            var _this = this;
            var parameter;
            if (reportingPeriodIndex != null) {
                parameter = "<Parms><ChildIntID>0</ChildIntID><ReportPeriod>" + reportingPeriodIndex + "</ReportPeriod></Parms>";
            }
            else {
                parameter = "<Parms><ChildIntID>0</ChildIntID></Parms>";
            }
            return new Promise(function (resolve, reject) {
                _this.processWebRequest(EDUPoint.WebServiceFunction.Gradebook, parameter).then(function (xml) {
                    resolve(new EDUPoint.Gradebook(xml));
                }).catch(function (error) {
                    reject(error);
                });
            });
        };
        PXPWebServices.prototype.getChildList = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.processWebRequest(EDUPoint.WebServiceFunction.ChildList).then(function (xml) {
                    var childElement = xml.getElementsByTagName("Child");
                    if (childElement.length <= 0) {
                        reject(new Error("An unknown error occurred."));
                    }
                    resolve(new EDUPoint.Child(childElement[0]));
                }).catch(function (error) {
                    reject(error);
                });
            });
        };
        return PXPWebServices;
    }());
    EDUPoint.PXPWebServices = PXPWebServices;
})(EDUPoint || (EDUPoint = {}));
//# sourceMappingURL=PXPWebServices.js.map
/**
 * 1. OK: `MM/DD/YY` (where `YY == 19YY-19YY`, for example: `12 == 1912`).
 * 2. OK: `MM/DD/YYYY`
 * 3. Not OK: `DD/MM/YYYY`
 * 4. Not OK: `YYYY/MM/DD`
 *
 * @param {string} string
 */
function dateFromAmericanShortFormat(input) {
    var firstDelimiterIndex = input.indexOf("/");
    var secondDelimiterIndex = input.indexOf("/", firstDelimiterIndex + 1);
    // "+" prefix casts the string into an integer.
    var monthNumber = +input.substring(0, firstDelimiterIndex);
    var dayNumber = +input.substring(firstDelimiterIndex + 1, secondDelimiterIndex);
    var yearNumber = +input.substring(secondDelimiterIndex + 1, input.length);
    return new Date(yearNumber, monthNumber - 1, dayNumber);
}
//# sourceMappingURL=date.js.map
function serialize(obj) {
    var str = [];
    for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
}
//# sourceMappingURL=urlSerialize.js.map
/**
 * From: https://github.com/matanshiloah/xml-parser
 */
var XMLParser = /** @class */ (function () {
    function class_1() {
    }
    class_1.prototype._parseFromString = function (xmlText) {
        var _this = this;
        var cleanXmlText = xmlText.replace(/\s{2,}/g, ' ').replace(/\\t\\n\\r/g, '').replace(/>/g, '>\n');
        var rawXmlData = [];
        cleanXmlText.split('\n').map(function (element) {
            element = element.trim();
            if (!element || element.indexOf('?xml') > -1) {
                return;
            }
            if (element.indexOf('<') == 0 && element.indexOf('CDATA') < 0) {
                var parsedTag = _this._parseTag(element);
                rawXmlData.push(parsedTag);
                if (element.match(/\/\s*>$/)) {
                    rawXmlData.push(_this._parseTag('</' + parsedTag.name + '>'));
                }
            }
            else {
                rawXmlData[rawXmlData.length - 1].value = _this._parseValue(element);
            }
        });
        return this._convertTagsArrayToTree(rawXmlData)[0];
    };
    class_1.prototype._getElementsByTagName = function (tagName) {
        var matches = [];
        if (tagName == '*' || this.name.toLowerCase() === tagName.toLowerCase()) {
            matches.push(this);
        }
        this.children.map(function (child) {
            matches = matches.concat(child.getElementsByTagName(tagName));
        });
        return matches;
    };
    class_1.prototype._parseTag = function (tagText, parent) {
        var cleanTagText = tagText.match(/([^\s]*)=('([^']*?)'|"([^"]*?)")|([\/?\w\-\:]+)/g);
        var tag = {
            name: cleanTagText.shift().replace(/\/\s*$/, ''),
            attributes: {},
            children: [],
            value: '',
            getElementsByTagName: this._getElementsByTagName
        };
        cleanTagText.map(function (attribute) {
            var attributeKeyVal = attribute.split('=');
            if (attributeKeyVal.length < 2) {
                return;
            }
            tag.attributes[attributeKeyVal[0]] = 'string' === typeof attributeKeyVal[1] ? (attributeKeyVal[1].replace(/^"/g, '').replace(/^'/g, '').replace(/"$/g, '').replace(/'$/g, '').trim()) : attributeKeyVal[1];
        });
        return tag;
    };
    class_1.prototype._parseValue = function (tagValue) {
        if (tagValue.indexOf('CDATA') < 0) {
            return tagValue.trim();
        }
        return tagValue.substring(tagValue.lastIndexOf('[') + 1, tagValue.indexOf(']'));
    };
    class_1.prototype._convertTagsArrayToTree = function (xml) {
        var xmlTree = [];
        if (xml.length == 0) {
            return xmlTree;
        }
        var tag = xml.shift();
        if (tag.value.indexOf('</') > -1 || tag.name.match(/\/$/)) {
            tag.name = tag.name.replace(/\/$/, '').trim();
            tag.value = tag.value.substring(0, tag.value.indexOf('</'));
            xmlTree.push(tag);
            xmlTree = xmlTree.concat(this._convertTagsArrayToTree(xml));
            return xmlTree;
        }
        if (tag.name.indexOf('/') == 0) {
            return xmlTree;
        }
        xmlTree.push(tag);
        tag.children = this._convertTagsArrayToTree(xml);
        xmlTree = xmlTree.concat(this._convertTagsArrayToTree(xml));
        return xmlTree;
    };
    class_1.prototype._toString = function (xml) {
        var _this = this;
        var xmlText = this._convertTagToText(xml);
        if (xml.children.length > 0) {
            xml.children.map(function (child) {
                xmlText += _this._toString(child);
            });
            xmlText += '</' + xml.name + '>';
        }
        return xmlText;
    };
    class_1.prototype._convertTagToText = function (tag) {
        var tagText = '<' + tag.name;
        var attributesText = [];
        for (var attribute in tag.attributes) {
            tagText += ' ' + attribute + '="' + tag.attributes[attribute] + '"';
        }
        if (tag.value.length > 0) {
            tagText += '>' + tag.value + '</' + tag.name + '>';
        }
        else {
            tagText += '>';
        }
        if (tag.children.length === 0) {
            tagText += '</' + tag.name + '>';
        }
        return tagText;
    };
    class_1.prototype.parseFromString = function (xmlText) {
        return this._parseFromString(xmlText);
    };
    class_1.prototype.toString = function (xml) {
        return this._toString(xml);
    };
    return class_1;
}());
//# sourceMappingURL=xmlParser.js.map
var EDUPoint;
(function (EDUPoint) {
    var Assignment = /** @class */ (function () {
        function Assignment(isArbitrary, type, assignedScore, actualScore, notes) {
            this.isArbitrary = isArbitrary;
            this.type = type;
            this.actualScore = actualScore;
            this.assignedScore = assignedScore;
            this.notes = notes;
        }
        Assignment.initializeFromElement = function (data) {
            var type = data.attributes["Type"];
            var notes = data.attributes["Notes"];
            var parsedScores = parseScore(data.attributes["Points"]);
            var assignment = new Assignment(false, type, parsedScores[0], parsedScores[1], notes);
            assignment.gradebookID = data.attributes["GradebookID"];
            assignment.measure = data.attributes["Measure"];
            assignment.date = dateFromAmericanShortFormat(data.attributes["Date"]);
            assignment.dueDate = dateFromAmericanShortFormat(data.attributes["DueDate"]);
            return assignment;
        };
        Object.defineProperty(Assignment.prototype, "scorePercentage", {
            /**
             * @returns A percentage (in decimal form) of this assignment's scores. `null` implies that this assignment hasn't been graded yet.
             */
            get: function () {
                if (this.actualScore == null) {
                    return null;
                }
                if (this.assignedScore == 0) {
                    return this.actualScore;
                } // Extra credit.
                return this.actualScore / this.assignedScore;
            },
            enumerable: true,
            configurable: true
        });
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
        return Assignment;
    }());
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
    var delimiterIndex = scoreString.indexOf("/");
    // Ungraded assignment only return an assigned score.
    if (delimiterIndex <= -1) {
        return [+scoreString.substring(0, scoreString.indexOf(" ")), null];
    }
    var assigned = +scoreString.substring(delimiterIndex + 1, scoreString.length - 1); // plus one for the trailing space.
    var actual = +scoreString.substring(0, delimiterIndex - 1); // minus one for the leading space.
    return [assigned, actual];
}
/**
 * <Assignment GradebookID="258296" Measure="Song Presentation" Type="Total Points" Date="11/1/2018" DueDate="1/18/2019" Score="135 out of 150.0000" ScoreType="Raw Score" Points="135.00 / 150.0000" Notes="" TeacherID="3474" StudentID="4634" MeasureDescription="" HasDropBox="false" DropStartDate="11/1/2018" DropEndDate="11/2/2018">
 */
//# sourceMappingURL=Assignment.js.map
var EDUPoint;
(function (EDUPoint) {
    var AssignmentGradeCalc = /** @class */ (function () {
        /**
         *
         * @param type The name of this category.
         * @param weight The percentage weight of this category in decimal form (e.g. `75% == 0.75`). This value cannot be exceed `1.0`.
         */
        function AssignmentGradeCalc(type, weight) {
            if (weight > 1.0) {
                throw "Weight must be less than or equal to 100% (`1.0`).";
            }
            this.type = type;
            this.weight = weight;
        }
        AssignmentGradeCalc.initializeFromElement = function (data) {
            var typeValue = data.attributes["Type"];
            var weightValueAsPercentage = data.attributes["Weight"];
            var weightValueAsDecimal = +weightValueAsPercentage.substring(0, weightValueAsPercentage.indexOf("%")) / 100;
            return new AssignmentGradeCalc(typeValue, weightValueAsDecimal);
        };
        AssignmentGradeCalc.schema = {
            name: "AssignmentGradeCalc",
            properties: {
                type: "string",
                weight: "number"
            }
        };
        return AssignmentGradeCalc;
    }());
    EDUPoint.AssignmentGradeCalc = AssignmentGradeCalc;
})(EDUPoint || (EDUPoint = {}));
//# sourceMappingURL=AssignmentGradeCalc.js.map
var CalculateMarkScore = /** @class */ (function () {
    function CalculateMarkScore(gradeCalc) {
        this.type = gradeCalc.type;
        this.weight = gradeCalc.weight;
        this.actualScore = 0;
        this.assignedScore = 0;
    }
    Object.defineProperty(CalculateMarkScore.prototype, "weightedScore", {
        /**
         * @returns: The weighted score of this category as a percentage (in decimal form).
         */
        get: function () {
            if (this.actualScore == 0 || this.assignedScore == 0) {
                return 0;
            }
            return (this.actualScore / this.assignedScore) * this.weight;
        },
        enumerable: true,
        configurable: true
    });
    return CalculateMarkScore;
}());
//# sourceMappingURL=CalculateMarkScore.js.map
var EDUPoint;
(function (EDUPoint) {
    var Child = /** @class */ (function () {
        function Child(data) {
            this.studentGU = data.attributes["StudentGU"];
            this.childName = data.getElementsByTagName("ChildName")[0].value;
            this.organizationName = data.getElementsByTagName("OrganizationName")[0].value;
            this.grade = data.getElementsByTagName("Grade")[0].value;
        }
        return Child;
    }());
    EDUPoint.Child = Child;
})(EDUPoint || (EDUPoint = {}));
//# sourceMappingURL=Child.js.map
var EDUPoint;
(function (EDUPoint) {
    var Course = (function () {
        function Course(data) {
            this.marks = [];
            var markChildren = data.getElementsByTagName("Mark");
            for (var i = 0; i <= markChildren.length; i++) {
                var mark = markChildren[i];
                if (mark == undefined)
                    continue;
                this.marks.push(new EDUPoint.Mark(mark));
            }
            this.staffGU = data.attributes["StaffGU"];
            this.period = data.attributes["Period"];
            this.title = data.attributes["Title"];
            this.room = data.attributes["Room"];
            this.staff = data.attributes["Staff"];
            this.staffEmail = data.attributes["StaffEmail"];
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
        return Course;
    }());
    EDUPoint.Course = Course;
})(EDUPoint || (EDUPoint = {}));
//# sourceMappingURL=Course.js.map
var EDUPoint;
(function (EDUPoint) {
    var Gradebook = /** @class */ (function () {
        function Gradebook(data) {
            console.log(data);
            this.reportingPeriods = [];
            // const parsedData = new XMLParser().parseFromString(data)
            var allReportingPeriods = data.getElementsByTagName("ReportingPeriods");
            for (var reportPeriodIndex = 0; reportPeriodIndex <= allReportingPeriods.length; reportPeriodIndex++) {
                var reportingPeriods = allReportingPeriods[reportPeriodIndex];
                if (reportingPeriods == undefined)
                    continue;
                var individualReportPeriods = reportingPeriods.children;
                for (var individualIndex = 0; individualIndex <= individualReportPeriods.length; individualIndex++) {
                    var period = individualReportPeriods[individualIndex];
                    if (period == undefined)
                        continue;
                    this.reportingPeriods.push(new EDUPoint.ReportingPeriod(period));
                }
            }
            this.courses = [];
            var coursesElements = data.getElementsByTagName("Course");
            for (var index = 0; index <= coursesElements.length; index++) {
                var item = coursesElements[index];
                if (item == undefined)
                    continue;
                this.courses.push(new EDUPoint.Course(item));
            }
        }
        Gradebook.schema = {
            name: "Gradebook",
            properties: {
                reportingPeriods: "ReportingPeriod[]",
                courses: "Course[]"
            }
        };
        return Gradebook;
    }());
    EDUPoint.Gradebook = Gradebook;
})(EDUPoint || (EDUPoint = {}));
//# sourceMappingURL=Gradebook.js.map
var EDUPoint;
(function (EDUPoint) {
    var Mark = /** @class */ (function () {
        function Mark(data) {
            this.gradeCalculation = [];
            this.assignments = [];
            var gradeCalculationChildren = data.getElementsByTagName("AssignmentGradeCalc");
            for (var i = 0; i <= gradeCalculationChildren.length; i++) {
                var gradeCalculation = gradeCalculationChildren[i];
                if (gradeCalculation == undefined)
                    continue;
                var gradeCalc = EDUPoint.AssignmentGradeCalc.initializeFromElement(gradeCalculation);
                if (gradeCalc.type != "TOTAL")
                    this.gradeCalculation.push(gradeCalc);
            }
            var assignmentChildren = data.getElementsByTagName("Assignment");
            for (var i = 0; i <= assignmentChildren.length; i++) {
                var assignment = assignmentChildren[i];
                if (assignment == undefined)
                    continue;
                this.assignments.push(EDUPoint.Assignment.initializeFromElement(assignment));
            }
            this.name = data.attributes["MarkName"];
            this.calculatedScoreString = data.attributes["CalculatedScoreString"];
            this.calculatedScoreRaw = data.attributes["CalculatedScoreRaw"];
        }
        Object.defineProperty(Mark.prototype, "calculateScore", {
            /**
             * @returns: Returns `null` if there are no assignments.
             */
            get: function () {
                if (this.assignments.length <= 0)
                    return null;
                // Disregard ungraded assignments
                var gradedAssignments = this.assignments.filter(function (value) { return value.actualScore != null; });
                // If there are no grade calculation types, then just count it as is.
                if (this.gradeCalculation.length <= 0) {
                    var totalActualScore = gradedAssignments.reduce(function (accum, current) { return accum += current.actualScore; }, 0);
                    var totalAssignedScore = gradedAssignments.reduce(function (accum, current) { return accum += current.assignedScore; }, 0);
                    return totalActualScore / totalAssignedScore;
                }
                var calculations = [];
                this.gradeCalculation.forEach(function (calc) { return calculations.push(new CalculateMarkScore(calc)); });
                gradedAssignments.forEach(function (assignment) {
                    calculations.forEach(function (markScore, index) {
                        if (assignment.type.length <= 0 || markScore.type == assignment.type) {
                            calculations[index].actualScore += assignment.actualScore;
                            calculations[index].assignedScore += assignment.assignedScore;
                        }
                    });
                });
                // Remove empty categories
                calculations = calculations.filter(function (calc) { return calc.actualScore != 0 && calc.assignedScore != 0; });
                // Issue #1: If the weight total of non-zero categories do not add up to 100%, scale all other weights so it's equal to 100%.
                var weightSum = calculations.reduce(function (accum, current) { return accum += current.weight; }, 0);
                var scaleFactor = 1 / weightSum;
                calculations.forEach(function (calc) { return calc.weight *= scaleFactor; });
                return calculations.reduce(function (accum, calc) { return accum += calc.weightedScore; }, 0);
            },
            enumerable: true,
            configurable: true
        });
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
        return Mark;
    }());
    EDUPoint.Mark = Mark;
})(EDUPoint || (EDUPoint = {}));
//# sourceMappingURL=Mark.js.map
var EDUPoint;
(function (EDUPoint) {
    var ReportingPeriod = /** @class */ (function () {
        function ReportingPeriod(data) {
            this.index = +data.attributes["Index"];
            this.gradePeriod = data.attributes["GradePeriod"];
            this.startDate = dateFromAmericanShortFormat(data.attributes["StartDate"]);
            this.endDate = dateFromAmericanShortFormat(data.attributes["EndDate"]);
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
        return ReportingPeriod;
    }());
    EDUPoint.ReportingPeriod = ReportingPeriod;
})(EDUPoint || (EDUPoint = {}));
//# sourceMappingURL=ReportingPeriod.js.map

module.exports = EDUPoint