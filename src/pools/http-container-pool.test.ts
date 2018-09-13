import {HttpContainerPool} from "./http-container-pool";
import {HttpContainer} from "./http-container";
import {HttpContainer} from "./http-container";
import {Logger} from "../loggers/logger";

let acquireMock = jest.fn(() => Promise.resolve('acquireReturn'));
let releaseMock = jest.fn();

jest.mock("./http-container");
let constructorHttpContainer = jest.fn(() => {
    return {
        acquire: acquireMock,
        release: releaseMock
    }
});
HttpContainer.mockImplementation(constructorHttpContainer);

jest.mock("../loggers/logger");
const warningLogMock = jest.fn();
Logger.warning.mockImplementation(warningLogMock);

describe('HttpContainerPool', () => {

    beforeEach(() => {
        acquireMock.mockClear();
        releaseMock.mockClear();
    });

    it('create new App', done => {
        const port = 987;
        const secure = true;
        const credentials = {key: 'value'};

        const appPromise = HttpContainerPool.getApp(port, secure, credentials);

        appPromise.then((some) => {
            expect(some).toBe('acquireReturn');
            done();
        });
        expect(constructorHttpContainer).toHaveBeenCalledWith(port, secure, credentials);
        expect(acquireMock).toHaveBeenCalled();
    });

    it('reuse App', done => {

        const port = 987;
        const secure = true;
        const credentials = {key: 'value'};

        HttpContainerPool.getApp(port, secure, credentials);
        const appPromise = HttpContainerPool.getApp(port, secure, credentials);

        appPromise.then((some) => {
            expect(some).toBe('acquireReturn');
            done();
        });
        expect(constructorHttpContainer).toHaveBeenCalledTimes(1);
        expect(acquireMock).toHaveBeenCalledTimes(2);
    });

    it('release App', done => {
        const port = 987;

        HttpContainerPool.getApp(port).then(() => {
            HttpContainerPool.releaseApp(port);
            expect(releaseMock).toHaveBeenCalledTimes(1);
            done();
        });

    });

    it('release non existent App', () => {
        const port = 32456;
        HttpContainerPool.releaseApp(port);

        expect(releaseMock).not.toHaveBeenCalled();
        expect(warningLogMock).toHaveBeenCalledWith(`No bound http-container to be released (${port})`);
    });

});