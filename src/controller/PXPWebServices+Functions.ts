enum PXPWebServicesFunction {
    Gradebook
}

function PXPWebServicesFunctionParameters(serviceFunction: PXPWebServicesFunction): string {
    switch (serviceFunction) {
        case PXPWebServicesFunction.Gradebook:
        return "<Parms><ChildIntID>0</ChildIntID></Parms>"
    }
}