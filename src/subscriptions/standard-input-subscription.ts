import {Subscription} from './subscription';
import {SubscriptionModel} from '../models/inputs/subscription-model';
import {Injectable} from 'conditional-injector';

@Injectable({predicate: (subscriptionAttributes: any) => subscriptionAttributes.type === 'standard-input'})
export class StandardInputSubscription extends Subscription {
    private value?: string;

    constructor(subscriptionModel: SubscriptionModel) {
        super(subscriptionModel);
    }

    public receiveMessage(): Promise<any> {
        return new Promise((resolve) => {
            process.stdin.on('end', () => {
                if (this.value) {
                    resolve(this.value);
                }
            });
        });
    }

    public subscribe(): Promise<void> {
        process.stdin.setEncoding('utf8');
        process.stdin.resume();
        process.stdin.on('data', (chunk) => {
            if (!this.value) {
                this.value = chunk;
            } else {
                this.value += chunk;
            }
        });
        return Promise.resolve();
    }

    public async unsubscribe(): Promise<void> {
        process.stdin.pause();
    }

}