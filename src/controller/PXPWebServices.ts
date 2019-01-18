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
    
        processWebRequest(functionToRun: PXPWebServicesFunction): Promise<XMLDocument> {
            const fullURL = this.edupointBaseURL + this.basePath
    
            const requestParameters: {[key: string]: string} = {
                userID: this.userID,
                password: this.password,
                skipLoginLog: "false",
                parent: "false",
                webServiceHandleName: 'PXPWebServices',
                methodName: PXPWebServicesFunction[functionToRun],
                paramStr: PXPWebServicesFunctionParameters(functionToRun)
            }
    
            return new Promise<Document>((resolve, reject) => {
                this.post(fullURL, requestParameters).then(document => {
                    const body = document.getElementsByTagName("string")[0].childNodes[0].nodeValue
                    const xmlBody = new DOMParser().parseFromString(body, "text/xml")
    
                    var error = xmlBody.getElementsByTagName("RT_ERROR")[0]
                    if (error != null) {
                        reject(Error(error.getAttribute("ERROR_MESSAGE")))
                    } else {
                        resolve(xmlBody)
                    }
                }, (function() {
                    reject()
                }))
            })
        }    
    
        post(url: string, parameters: {[key: string]: string}): Promise<Document> {
            return new Promise<Document>((resolve, reject) => {
                var request = new XMLHttpRequest()
                request.open('POST', url, true)
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8")
                
                request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {
                        resolve(request.responseXML)
                    } else {
                        reject(request.responseText)
                    }
                }                
                
                request.onerror = function() {
                    reject("Failed due to an unknown reason.")
                }
                
                request.send(serialize(parameters));
            })
        }
    
        getGradebook(): Promise<Gradebook> {
            return new Promise((resolve, reject) => {
                this.processWebRequest(PXPWebServicesFunction.Gradebook).then(xml => {
                    resolve(new Gradebook(xml))
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }    
}