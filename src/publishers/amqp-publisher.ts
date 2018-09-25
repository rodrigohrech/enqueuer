import {Publisher} from './publisher';
import {Injectable} from 'conditional-injector';
import {PublisherModel} from '../models/inputs/publisher-model';
import {Logger} from '../loggers/logger';
import * as amqp from 'amqp';

@Injectable({predicate: (publishRequisition: any) => publishRequisition.type === 'amqp'})
export class AmqpPublisher extends Publisher {
    private connection: any;
    private messageOptions: any;

    constructor(publish: PublisherModel) {
        super(publish);
        this.messageOptions = publish.messageOptions || {};
    }

    public publish(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection = amqp.createConnection(this.options);
            this.connection.once('ready', () => {
                const exchange = this.getExchange();
                Logger.debug(`Exchange to publish: '${this.exchange || 'default'}' created`);
                exchange.once('open', () => {
                    this.exchangeOpen(exchange, reject, resolve);
                });
            });
            this.connection.on('error', (err: any) => {
                return reject(err);
            });
        });
    }

    private getExchange() {
        return this.connection.exchange(this.exchange || '', {confirm: true, passive: true});
    }

    private exchangeOpen(exchange: any, reject: any, resolve: any) {
        Logger.debug(`Exchange '${this.exchange || 'default'}' is opened, publishing to routingKey ${this.routingKey}`);
        exchange.publish(this.routingKey, this.payload, this.messageOptions, (errored: any, err: any) => {
            Logger.trace(`Exchange published callback`);
            this.connection.disconnect();
            this.connection.end();
            if (errored) {
                return reject(err);
            }
            Logger.trace(`AMQP message published`);
            resolve();
        });
    }
}