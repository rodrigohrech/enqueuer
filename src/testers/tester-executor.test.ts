import {TesterExecutor} from './tester-executor';
import {Tester} from "./tester";
import {Store} from "./store";

const testIsEqualToMock = jest.fn();
const testGetReportMock = jest.fn(() => {
    return "anything";
});

jest.mock("./tester");
Tester.mockImplementation(() => {
    return {
        isEqualTo: testIsEqualToMock,
        getReport: testGetReportMock
    };
});

const testDeleteEnqueuerMock = jest.fn();
const testPersistEnqueuerMock = jest.fn();
const testPersistSessionMock = jest.fn();
const testGetVariableMock = jest.fn();

jest.mock("./store");
Store.mockImplementation(() => {
    return {
        deleteEnqueuerVariable: testDeleteEnqueuerMock,
        setEnqueuerVariable: testPersistEnqueuerMock,
        setSessionVariable: testPersistSessionMock,
        getVariable: testGetVariableMock
    };
});

describe('TesterExecutor', () => {

    it('Should add argument and pass it to the function', () => {
        const testerExecutor: TesterExecutor = new TesterExecutor('name.value++;');
        const arg = {value: 2};

        testerExecutor.addArgument('name', arg);
        testerExecutor.execute();

        expect(arg.value).toBe(3);
    });

    it('Should call tester assertions', () => {
        const testerExecutor: TesterExecutor = new TesterExecutor(`tester.isEqualTo('label', 2, 3);`);

        const tests = testerExecutor.execute();

        expect(tests).toBe("anything");
        expect(testIsEqualToMock).toHaveBeenCalledWith('label', 2, 3);
        expect(testGetReportMock).toHaveBeenCalled();
    });

    it('Should call store methods', () => {
        const testerExecutor: TesterExecutor = new TesterExecutor(`store.deleteEnqueuerVariable('del');` +
                                                                    `store.setEnqueuerVariable('enq', 2);` +
                                                                    `store.getVariable('enq');` +
                                                                    `store.setSessionVariable('ses', 3);`);

        testerExecutor.execute();

        expect(testDeleteEnqueuerMock).toHaveBeenCalledWith('del');
        expect(testGetVariableMock).toHaveBeenCalledWith('enq');
        expect(testPersistEnqueuerMock).toHaveBeenCalledWith('enq', 2);
        expect(testPersistSessionMock).toHaveBeenCalledWith('ses', 3);
    });

    it('Should catch function creation error', () => {
        const testerExecutor: TesterExecutor = new TesterExecutor('invalid statement');

        const tests = testerExecutor.execute();

        expect(tests.length).toBe(1);
        expect(tests[0].valid).toBeFalsy();
        expect(tests[0].label).toBe("Function created");
        expect(tests[0].description).toBe("SyntaxError: Unexpected identifier");
    });

    it('Should catch function execution error', () => {
        const testerExecutor: TesterExecutor = new TesterExecutor('notDefined++');

        const tests = testerExecutor.execute();

        expect(tests.length).toBe(1);
        expect(tests[0].valid).toBeFalsy();
        expect(tests[0].label).toBe("Function executed");
        expect(tests[0].description).toBe("ReferenceError: notDefined is not defined");
    });

});

