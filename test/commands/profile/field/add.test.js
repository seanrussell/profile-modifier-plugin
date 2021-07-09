"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const fs = require("fs-extra");
const util = tslib_1.__importStar(require("util"));
const util_1 = require("../../../../src/shared/util");
const execProm = util.promisify(child_process_1.exec);
const testProjectName = 'testProjectField';
const apexfieldName = 'TestObject__c.TestField__c';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';
describe('profile:field:add', () => {
    jest.setTimeout(50000);
    beforeAll(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield fs.remove(testProjectName);
        yield child_process_1.exec(`sfdx force:project:create -n ${testProjectName}`);
        yield fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
    }));
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
    }));
    test('adds read only field to profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(fs.existsSync(testProjectName)).toBe(true);
        execProm(`sfdx profile:field:add --name "${apexfieldName}" --profile ${profileName} --permissions r`, { cwd: testProjectName })
            .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const profilePath = `${testProjectName}/${filePath}`;
            expect(fs.existsSync(profilePath)).toBe(true);
            const json = yield util_1.getParsed(yield fs.readFile(profilePath));
            const fields = json['Profile']['fieldPermissions'];
            expect(fields).not.toBeUndefined();
            const existingField = fields.find(cls => {
                return cls.field === apexfieldName;
            });
            expect(existingField.field).not.toBeNull();
            expect(existingField.field).toEqual(apexfieldName);
            expect(existingField.readable).toEqual('true');
            expect(existingField.editable).toEqual('false');
        }));
    }));
    test('adds read and edit field to profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(fs.existsSync(testProjectName)).toBe(true);
        execProm(`sfdx profile:field:add --name ${apexfieldName} --profile ${profileName} --permissions re`, { cwd: testProjectName })
            .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const profilePath = `${testProjectName}/${filePath}`;
            expect(fs.existsSync(profilePath)).toBe(true);
            const json = yield util_1.getParsed(yield fs.readFile(profilePath));
            const fields = json['Profile']['fieldPermissions'];
            expect(fields).not.toBeUndefined();
            const existingField = fields.find(cls => {
                return cls.field === apexfieldName;
            });
            expect(existingField.field).not.toBeNull();
            expect(existingField.field).toEqual(apexfieldName);
            expect(existingField.readable).toEqual('true');
            expect(existingField.editable).toEqual('true');
        }));
    }));
});
//# sourceMappingURL=add.test.js.map