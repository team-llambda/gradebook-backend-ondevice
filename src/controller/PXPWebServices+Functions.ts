module EDUPoint {
    export enum WebServiceFunction {
        Gradebook,
        ChildList
    }
    
    export function WebServiceFunctionParameter(serviceFunction: WebServiceFunction): string {
        switch (serviceFunction) {
            case WebServiceFunction.Gradebook: return "<Parms><ChildIntID>0</ChildIntID></Parms>"
            case WebServiceFunction.ChildList: return ""
        }
    }
}