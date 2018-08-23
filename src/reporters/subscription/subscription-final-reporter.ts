import {TestModel} from '../../models/outputs/test-model';

export class SubscriptionFinalReporter {
    private messageReceivedTestName: string = `Message received`;
    private subscriptionAvoidedTestName: string = `Subscription avoided`;
    private noTimeOutTestName: string = `No time out`;

    private avoidable?: boolean;
    private hasMessage: boolean = false;
    private hasTimedOut: boolean;

    constructor(avoidable: boolean, hasMessage: boolean, hasTimedOut: boolean) {
        this.avoidable = avoidable;
        this.hasMessage = hasMessage;
        this.hasTimedOut = hasTimedOut;
    }

    public getReport(): TestModel[] {
        let tests: TestModel[] = [];
        if (this.avoidable) {
            tests = tests.concat(this.createAvoidableReport());
        } else {
            tests = tests.concat(this.createMessageReport());
        }
        if (this.hasTimedOut) {
            const timeoutReport = this.createTimeoutReport();
            if (timeoutReport) {
                tests = tests.concat(timeoutReport);
            }
        }
        return tests;
    }

    private createMessageReport(): TestModel {
        if (this.hasMessage) {
            return {
                valid: true,
                name: this.messageReceivedTestName,
                description: `Subscription has received its message`
            };
        } else {
            return {
                valid: false,
                name: this.messageReceivedTestName,
                description: `Subscription has not received its message`
            };
        }
    }
    private createTimeoutReport(): TestModel | undefined {
        if (!this.avoidable) {
            return {
                valid: false,
                name: this.noTimeOutTestName,
                description: `Not avoidable Subscription has timed out`
            };
        }
    }

    private createAvoidableReport() {
        if (this.hasMessage) {
            return {
                valid: false,
                name: this.subscriptionAvoidedTestName,
                description: `Avoidable subscription should not receive a message`
            };
        } else {
            return {
                valid: true,
                name: this.subscriptionAvoidedTestName,
                description: `Avoidable subscription has not received a message`
            };
        }
    }
}