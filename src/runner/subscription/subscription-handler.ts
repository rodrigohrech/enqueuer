import {FunctionExecutor} from "../../executor/function-executor";
import {OnMessageReceivedSubscriptionFunction} from "../../executor/on-message-received-subscription-function";
import {Subscription} from "../../subscription/subscription";
import {SubscriptionFactory} from "../../subscription/subscription-factory";
import {Logger} from "../../log/logger";
import {DateController} from "../../date/date-controller";

export class SubscriptionHandler {

    private timer: any;
    private subscription: Subscription;
    private report: any = {};
    private startTime: DateController;
    private onTimeOutCallback: Function = () => {};
    private hasTimedOut: boolean = false;

    constructor(subscriptionAttributes: any) {
        this.subscription = new SubscriptionFactory().createSubscription(subscriptionAttributes);
        this.startTime = new DateController();
    }

    public onTimeout(onTimeOutCallback: Function) {
        this.onTimeOutCallback = onTimeOutCallback;
    }

    public connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.subscription.connect()
                .then(() => {
                    this.report = {
                        ...this.report,
                        connectionTime: new DateController().toString()
                    };
                    this.initializeTimeout();
                    resolve();
                })
                .catch((err) => reject(err));
        });
    }

    public receiveMessage(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.subscription.receiveMessage()
                .then((message) => {
                    this.executeSubscriptionFunction();
                    if (!this.hasTimedOut) {
                        this.subscription.messageReceived = message;
                        Logger.info("Subscription stop waiting because it has already received its message");
                        global.clearTimeout(this.timer);
                        this.subscription.unsubscribe();
                        resolve();
                    }
                })
                .catch((err) => {
                    this.subscription.unsubscribe();
                    reject(err);
                });
        });
    }

    public getReport() {
        this.report = {
            ...this.report,
            subscription: this.subscription,
            hasReceivedMessage: this.subscription.messageReceived != null,
            hasTimedOut: this.hasTimedOut
        };
        this.subscription.unsubscribe();
        return this.report;
    }

    private initializeTimeout() {
        if (this.subscription.timeout) {
            this.timer = global.setTimeout(() => {
                Logger.info("Subscription stop waiting because it has timed out");
                this.subscription.unsubscribe();
                this.hasTimedOut = true;
                this.onTimeOutCallback();
            }, this.subscription.timeout);
        }
    }

    private executeSubscriptionFunction() {
        const onMessageReceivedSubscription = new OnMessageReceivedSubscriptionFunction(this.subscription);
        const functionResponse = new FunctionExecutor(onMessageReceivedSubscription).execute();
        this.report = {
            ...this.report,
            functionReport: functionResponse.report,
            messageReceivedTimestamp: new DateController().toString()
        }
    }

}