const jsonSub = require('json-sub')();

export class RequisitionParser {
    parse(requisitionMessage: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const parsedRequisition = JSON.parse(requisitionMessage);
                //TODO: validate requisition
                const variablesReplacedRequisition = this.replaceVariables(parsedRequisition);
                resolve(variablesReplacedRequisition);
            } catch (err) {
                reject(err);
            }
        });
    }
    
    private replaceVariables(parsedRequisition: any): any {
        var requisitionWithNoVariables = Object.assign({}, parsedRequisition);
        let variables = parsedRequisition.variables;
        
        delete requisitionWithNoVariables.variables;
        return jsonSub.addresser(requisitionWithNoVariables, variables);
    }
}