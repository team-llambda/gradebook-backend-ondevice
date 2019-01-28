module EDUPoint {
    export class PXPWebServices {
        basePath = "Service/PXPCommunication.asmx/ProcessWebServiceRequest"
        userID: string
        password: string
        edupointBaseURL: string
    
        constructor(userID: string, password: string, edupointBaseURL: string) {
            this.userID = userID
            this.password = password
            this.edupointBaseURL = edupointBaseURL
        }
    
        processWebRequest(functionToRun: WebServiceFunction, parameters?: string): Promise<any> {
            const fullURL = this.edupointBaseURL + this.basePath
    
            const requestParameters: {[key: string]: string} = {
                userID: this.userID,
                password: this.password,
                skipLoginLog: "false",
                parent: "false",
                webServiceHandleName: 'PXPWebServices',
                methodName: WebServiceFunction[functionToRun],
                paramStr: parameters || ""
            }
    
            return new Promise<any>((resolve, reject) => {
                this.post(fullURL, requestParameters).then(documentParser => {
                    const body = documentParser.getElementsByTagName("string")[0].value
                    const fixedBody = body.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
                    const xmlBody = new XMLParser().parseFromString(fixedBody)
                    // const xmlBody = new DOMParser().parseFromString(body, "text/xml")
    
                    var error = xmlBody.getElementsByTagName("RT_ERROR")[0]
                    if (error != null) {
                        reject(Error(error.attributes["ERROR_MESSAGE"]))
                    } else {
                        resolve(xmlBody)
                    }
                }, (function() {
                    reject()
                }))
            })
        }    
    
        post(url: string, parameters: {[key: string]: string}): Promise<any> {
            return new Promise<any>((resolve, reject) => {
                var request = new XMLHttpRequest()
                request.open('POST', url, true)
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8")
                
                request.onload = function() {
                    const response = new XMLParser().parseFromString(request.responseText)
                    if (request.status >= 200 && request.status < 400) {
                        resolve(response)
                    } else {
                        reject(response)
                    }
                }                
                
                request.onerror = function() {
                    reject("Failed due to an unknown reason.")
                }
                
                request.send(serialize(parameters));
            })
        }
    
        getGradebook(reportingPeriodIndex?: number): Promise<Gradebook> {
            var parameter: string
            if (reportingPeriodIndex != null) {
                parameter = "<Parms><ChildIntID>0</ChildIntID><ReportPeriod>" + reportingPeriodIndex + "</ReportPeriod></Parms>"
            } else {
                parameter = "<Parms><ChildIntID>0</ChildIntID></Parms>"
            }

            return new Promise((resolve, reject) => {
                this.processWebRequest(WebServiceFunction.Gradebook, parameter).then(xml => {
                    resolve(new Gradebook(xml))
                }).catch(error => {
                    reject(error)
                })
            })
        }

        getChildList(): Promise<Child> {
            return new Promise((resolve, reject) => {
                this.processWebRequest(WebServiceFunction.ChildList).then(xml => {                    
                    const childElement = xml.getElementsByTagName("Child")
                    if (childElement.length <= 0) {
                        reject(new Error("An unknown error occurred."))
                    }
                    resolve(new Child(childElement[0]))
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }    
}