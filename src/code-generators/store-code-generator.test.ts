import {StoreCodeGenerator} from './store-code-generator';
import {Event} from '../events/event';

const event: Event = {
    store: {
        first: 'firstValue',
        second: 'secondValue',
    }
};

describe('StoreCodeGenerator', () => {

    it('Should create code', () => {
        const storeCodeGenerator: StoreCodeGenerator = new StoreCodeGenerator('testerName', 'storeName');
        const code: string = storeCodeGenerator.generate(event.store);

        expect(code).toBe('try {\n' +
            '                        storeName[\'first\'] = firstValue;\n' +
            '                    } catch (err) {\n' +
            '                        testerName.addTest({\n' +
            '                                errorDescription: `Error executing store \'first\' code: \'${err}\'`,\n' +
            '                                valid: false,\n' +
            '                                label: \"Valid \'store\' in event auto-generated code\"\n' +
            '                            });\n' +
            '                    }\n' +
            'try {\n' +
            '                        storeName[\'second\'] = secondValue;\n' +
            '                    } catch (err) {\n' +
            '                        testerName.addTest({\n' +
            '                                errorDescription: `Error executing store \'second\' code: \'${err}\'`,\n' +
            '                                valid: false,\n' +
            '                                label: \"Valid \'store\' in event auto-generated code\"\n' +
            '                            });\n' +
            '                    }\n');
    });

});