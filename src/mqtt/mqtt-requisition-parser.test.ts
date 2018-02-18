import { MqttRequisitionFileParser } from './mqtt-requisition-file-parser';
import { expect } from 'chai';
import 'mocha';
import { Subscription } from './mqtt-requisition-file';

describe('MqttRequisitionFile test', function() {
    describe('Constructor', function() {
        const mqttRequisitionFileParser = new MqttRequisitionFileParser();
        const filename = "resources/test/mqtt-test.json";

        it('should raise exception if file does not exist', function() {
            const nonExistentFile = "nonExistentFile";

            expect(() => mqttRequisitionFileParser.parse(nonExistentFile)).to.throw();
        });

        it('should parse all subscriptions', function() {
            const mqttRequisitionFile = mqttRequisitionFileParser.parse(filename);
            const expectedSubscriptions = [
                {
                    timeout: 2000,
                    topic: "1",
                    testFunctionBody: "console.log(\"body:\" + JSON.stringify(response)); test['value'] = false;"                    
                },
                {
                    timeout: null,
                    testFunctionBody: null, 
                    topic: "2/#"
                }];

            const actualSubscriptions = mqttRequisitionFile.subscriptions;
            for (let index: number = 0; index < actualSubscriptions.length; ++index) {
                expect(actualSubscriptions[index]).to.be.deep.equal(expectedSubscriptions[index]);
            }
            expect(actualSubscriptions.length).to.be.equal(expectedSubscriptions.length);
        });

        it('should parse topicToPublish', function() {
            const mqttRequisitionFile = mqttRequisitionFileParser.parse(filename);

            const actualTopic = mqttRequisitionFile.publish.topic;
            const expectedTopic = "topicToPublish";
            expect(actualTopic).to.be.equal(expectedTopic);
        });

        it('should parse topicToPublish', function() {
            const mqttRequisitionFile = mqttRequisitionFileParser.parse("resources/test/mqtt-no-publish.json");

            expect(mqttRequisitionFile.publish).to.be.null;
        });

        it('should parse brokerAddress', function() {
            const mqttRequisitionFile = mqttRequisitionFileParser.parse(filename);

            const actualBrokerAddress = mqttRequisitionFile.brokerAddress;
            const expectedBrokerAddress = "brokerAddress";
            expect(actualBrokerAddress).to.be.equal(expectedBrokerAddress);
        });

    });
});