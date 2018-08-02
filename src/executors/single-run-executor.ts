import {EnqueuerExecutor} from './enqueuer-executor';
import {MultiPublisher} from '../publishers/multi-publisher';
import {SingleRunInput} from './single-run-input';
import {Configuration} from '../configurations/configuration';
import {Logger} from '../loggers/logger';
import {Injectable} from 'conditional-injector';
import {RunnableRunner} from '../runnables/runnable-runner';
import {MultiResultCreator} from '../single-run-result-creators/multi-result-creator';

@Injectable({predicate: enqueuerConfiguration => enqueuerConfiguration['single-run']})
export class SingleRunExecutor extends EnqueuerExecutor {

    private multiPublisher: MultiPublisher;
    private singleRunInput: SingleRunInput;
    private multiResultCreator: MultiResultCreator;

    constructor(enqueuerConfiguration: any) {
        super();
        Logger.info('Executing in Single-Run mode');
        const singleRunConfiguration = enqueuerConfiguration['single-run'];
        this.multiResultCreator = new MultiResultCreator(enqueuerConfiguration['single-run'].reports);

        this.multiPublisher = new MultiPublisher(new Configuration().getOutputs());
        this.singleRunInput = new SingleRunInput(singleRunConfiguration.fileNamePattern);
    }

    public async init(): Promise<void> {
        Logger.info('Initializing Single-Run mode');
        return this.singleRunInput.syncDir();
    }

    public execute(): Promise<boolean> {
        return new Promise((resolve) => {
            this.singleRunInput.onNoMoreFilesToBeRead(() => {
                Logger.info('There is no more requisition to be ran');
                this.multiResultCreator.create();
                return resolve(this.multiResultCreator.isValid());
            });
            this.singleRunInput.receiveRequisition()
                .then(runnable => new RunnableRunner(runnable).run())
                .then(report => {
                    Logger.trace('Adding test suite');
                    this.multiResultCreator.addTestSuite(report);
                    return report;
                })
                .then(report => this.multiPublisher.publish(JSON.stringify(report, null, 2)))
                .then( () => resolve(this.execute())) //Runs the next one
                .catch((err) => {
                    Logger.error(`Single-run error reported: ${JSON.stringify(err, null, 4)}`);
                    this.multiResultCreator.addError(err);
                    this.multiPublisher.publish(JSON.stringify(err, null, 2)).then().catch(console.log.bind(console));
                    resolve(this.execute()); //Runs the next one
                });
        });
    }

}