"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const fs = require("fs-extra");
const util = tslib_1.__importStar(require("util"));
const util_1 = require("../../../../src/shared/util");
const execProm = util.promisify(child_process_1.exec);
const testProjectName = 'testProjectObject';
const apexobjectName = 'TestObject__c';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';
describe('profile:object:add', () => {
    jest.setTimeout(50000);
    beforeAll(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield fs.remove(testProjectName);
        yield child_process_1.exec(`sfdx force:project:create -n ${testProjectName}`);
        yield fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
    }));
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
    }));
    test('adds full access object to profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(fs.existsSync(testProjectName)).toBe(true);
        execProm(`sfdx profile:object:add --name ${apexobjectName} --profile ${profileName} --permissions credmv`, { cwd: testProjectName })
            .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const profilePath = `${testProjectName}/${filePath}`;
            expect(fs.existsSync(profilePath)).toBe(true);
            const json = yield util_1.getParsed(yield fs.readFile(profilePath));
            const objects = json['Profile']['objectPermissions'];
            expect(objects).not.toBeUndefined();
            const existingObject = objects.find(cls => {
                return cls.object === apexobjectName;
            });
            expect(existingObject.object).not.toBeNull();
            expect(existingObject.object).toEqual(apexobjectName);
            expect(existingObject.allowRead).toEqual('true');
            expect(existingObject.allowEdit).toEqual('true');
            expect(existingObject.allowCreate).toEqual('true');
            expect(existingObject.allowDelete).toEqual('true');
            expect(existingObject.modifyAllRecords).toEqual('true');
            expect(existingObject.viewAllRecords).toEqual('true');
        }));
    }));
    test('adds read only object to profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(fs.existsSync(testProjectName)).toBe(true);
        execProm(`sfdx profile:object:add --name ${apexobjectName} --profile ${profileName} --permissions r`, { cwd: testProjectName })
            .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const profilePath = `${testProjectName}/${filePath}`;
            expect(fs.existsSync(profilePath)).toBe(true);
            const json = yield util_1.getParsed(yield fs.readFile(profilePath));
            const objects = json['Profile']['objectPermissions'];
            expect(objects).not.toBeUndefined();
            const existingObject = objects.find(cls => {
                return cls.object === apexobjectName;
            });
            expect(existingObject.object).not.toBeNull();
            expect(existingObject.object).toEqual(apexobjectName);
            expect(existingObject.allowRead).toEqual('true');
            expect(existingObject.allowEdit).toEqual('false');
            expect(existingObject.allowCreate).toEqual('false');
            expect(existingObject.allowDelete).toEqual('false');
            expect(existingObject.modifyAllRecords).toEqual('false');
            expect(existingObject.viewAllRecords).toEqual('false');
        }));
    }));
});
//# sourceMappingURL=add.test.js.map