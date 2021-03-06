import {SubscriptionFinalReporter} from './subscription-final-reporter';

describe('SubscriptionFinalReporter', () => {

    it('No subscribed, no avoidable, no message, no timeout', () => {
        const subscribed = false;
        const avoidable = false;
        const hasMessage = false;
        const hasTimedOut = false;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Subscribed');
    });

    it('No subscribed, no avoidable, no message, timeout', () => {
        const subscribed = false;
        const avoidable = false;
        const hasMessage = false;
        const hasTimedOut = true;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Subscribed');
    });

    it('No subscribed, no avoidable, message, no timeout', () => {
        const subscribed = false;
        const avoidable = false;
        const hasMessage = true;
        const hasTimedOut = false;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Subscribed');
    });

    it('No subscribed, no avoidable, message, timeout', () => {
        const subscribed = false;
        const avoidable = false;
        const hasMessage = true;
        const hasTimedOut = true;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Subscribed');
    });

    it('No subscribed, avoidable, no message, no timeout', () => {
        const subscribed = false;
        const avoidable = true;
        const hasMessage = false;
        const hasTimedOut = false;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Subscribed');
    });

    it('No subscribed, avoidable, no message, timeout', () => {
        const subscribed = false;
        const avoidable = true;
        const hasMessage = false;
        const hasTimedOut = true;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Subscribed');
    });

    it('No subscribed, avoidable, message, no timeout', () => {
        const subscribed = false;
        const avoidable = true;
        const hasMessage = true;
        const hasTimedOut = false;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Subscribed');
    });

    it('No subscribed, avoidable, message, timeout', () => {
        const subscribed = false;
        const avoidable = true;
        const hasMessage = true;
        const hasTimedOut = true;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Subscribed');
    });

    it('Subscribed, no avoidable, no message, no timeout', () => {
        const subscribed = true;
        const avoidable = false;
        const hasMessage = false;
        const hasTimedOut = false;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Message received');
    });

    it('Subscribed, no avoidable, no message, timeout', () => {
        const subscribed = true;
        const avoidable = false;
        const hasMessage = false;
        const hasTimedOut = true;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(2);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Message received');
        expect(report[1].valid).toBeFalsy();
        expect(report[1].name).toBe('No time out');
    });

    it('Subscribed, no avoidable, message, no timeout', () => {
        const subscribed = true;
        const avoidable = false;
        const hasMessage = true;
        const hasTimedOut = false;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeTruthy();
        expect(report[0].name).toBe('Message received');
    });

    it('Subscribed, no avoidable, message, timeout', () => {
        const subscribed = true;
        const avoidable = false;
        const hasMessage = true;
        const hasTimedOut = true;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(2);
        expect(report[0].valid).toBeTruthy();
        expect(report[0].name).toBe('Message received');
        expect(report[1].valid).toBeFalsy();
        expect(report[1].name).toBe('No time out');

    });

    it('Subscribed, avoidable, no message, no timeout', () => {
        const subscribed = true;
        const avoidable = true;
        const hasMessage = false;
        const hasTimedOut = false;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeTruthy();
        expect(report[0].name).toBe('Subscription avoided');
    });

    it('Subscribed, avoidable, no message, timeout', () => {
        const subscribed = true;
        const avoidable = true;
        const hasMessage = false;
        const hasTimedOut = true;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeTruthy();
        expect(report[0].name).toBe('Subscription avoided');
    });

    it('Subscribed, avoidable, message, no timeout', () => {
        const subscribed = true;
        const avoidable = true;
        const hasMessage = true;
        const hasTimedOut = false;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Subscription avoided');
    });

    it('Subscribed, avoidable, message, timeout', () => {
        const subscribed = true;
        const avoidable = true;
        const hasMessage = true;
        const hasTimedOut = true;
        const finalReporter: SubscriptionFinalReporter = new SubscriptionFinalReporter(subscribed, avoidable, hasMessage, hasTimedOut);

        const report = finalReporter.getReport();

        expect(report.length).toBe(1);
        expect(report[0].valid).toBeFalsy();
        expect(report[0].name).toBe('Subscription avoided');
    });

});