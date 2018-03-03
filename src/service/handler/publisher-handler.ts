import {Publisher} from "../../requisition/start-event/publish/publisher";
import {FunctionExecutor} from "../../function-executor/function-executor";

export class PublisherHandler {
    private publisher: Publisher;
    private report: any = {};
    private prePublishingReport: any = {};
    private previousPayload: string | any;

    constructor(publisher: Publisher) {
        this.publisher = publisher;
        this.previousPayload = publisher.payload;
    }

    public publish(): Promise<Publisher> {
        return new Promise((resolve, reject) => {
            this.generatePayload();
            this.publisher.execute()
                .then((publisher: Publisher) => {
                    this.generateSuccessfulReport(publisher);
                    resolve();
                })
                .catch((err: any) => {
                this.generateErrorReport(err);
                    reject(err)
                });
        });
    }

    public getReport(): any {
        return this.report;
    }

    private generateSuccessfulReport(publisher: Publisher): void {
        this.report = {
            ...publisher,
            prePublishFunction: this.prePublishingReport,
            timestamp: new Date()
        }
        if (this.previousPayload != this.publisher.payload)
             this.report.previousPayload = this.previousPayload;
    }

    private generateErrorReport(error: any): void {
        this.report = {
            prePublishFunction: this.prePublishingReport,
            errorMessage: error,
            timestamp: new Date()
        }
        if (this.previousPayload != this.publisher.payload)
            this.report.previousPayload = this.previousPayload;
    }

    private generatePayload() {
        const functionToExecute: Function = this.publisher.createPrePublishingFunction();
        try {
            let publisherExecutor: FunctionExecutor = new FunctionExecutor(functionToExecute);
            publisherExecutor.execute();
            this.prePublishingReport = {
                tests: {
                    failing: publisherExecutor.getFailingTests(),
                    passing: publisherExecutor.getPassingTests(),
                    exception: publisherExecutor.getException()
                },
                reports: publisherExecutor.getReports()
            }
            this.previousPayload = this.publisher.payload;
            this.publisher.payload = publisherExecutor.getFunctionResponse().payload;
        } catch (exc) {
            this.prePublishingReport = {
                onMessageReceivedFunctionCreationException: exc
            }
        }
    }
}