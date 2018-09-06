import {NullDaemonInputAdapter} from "./null-daemon-input-adapter";
import {Logger} from "../../loggers/logger";
import {Injectable} from "conditional-injector";

jest.mock('../../loggers/logger');
const warningMock = jest.fn();
Logger.warning.mockImplementation(warningMock);

jest.mock('conditional-injector');
Injectable.mockImplementation();


describe('NullDaemonInputAdapter', () => {

    it('should be the null object implementation', () => {
        expect(Injectable).toBeCalledWith();
    });

    it('should return undefined', () => {
        const model = {type: 'unknown'};
        expect(new NullDaemonInputAdapter(model).adapt('any')).toBeUndefined();
        expect(warningMock).toBeCalledWith(`Adapter is not being able to adapt daemon-input of ${JSON.stringify(model)}`);
    });
});