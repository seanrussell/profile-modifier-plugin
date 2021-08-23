"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const fs = require("fs-extra");
const util = tslib_1.__importStar(require("util"));
const util_1 = require("../../../../src/shared/util");
const execProm = util.promisify(child_process_1.exec);
const testProjectName = 'testProjectClass';
const apexclassName = 'MyApexClass';
const apexclassRename = 'MyModifiedClass';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';
describe('profile:class:edit', () => {
    jest.setTimeout(50000);
    beforeAll(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield fs.remove(testProjectName);
        yield child_process_1.exec(`sfdx force:project:create -n ${testProjectName}`);
        yield fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
    }));
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
    }));
    test('renames existing class in profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(fs.existsSync(testProjectName)).toBe(true);
        execProm(`sfdx profile:class:edit --name ${apexclassName} --rename ${apexclassRename} --profile ${profileName} --enabled`, { cwd: testProjectName })
            .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const profilePath = `${testProjectName}/${filePath}`;
            expect(fs.existsSync(profilePath)).toBe(true);
            const json = yield util_1.getParsed(yield fs.readFile(profilePath));
            const existingClass = json['Profile']['classAccesses'];
            expect(existingClass).not.toBeUndefined();
            expect(existingClass.apexClass).not.toBeUndefined();
            expect(existingClass.apexClass).not.toEqual(apexclassName);
            expect(existingClass.apexClass).toEqual(apexclassRename);
            expect(existingClass.enabled).toEqual('true');
        }));
    }));
    test('changes existing class permissions in profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(fs.existsSync(testProjectName)).toBe(true);
        execProm(`sfdx profile:class:edit --name ${apexclassName} --profile ${profileName}`, { cwd: testProjectName })
            .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const profilePath = `${testProjectName}/${filePath}`;
            expect(fs.existsSync(profilePath)).toBe(true);
            const json = yield util_1.getParsed(yield fs.readFile(profilePath));
            const existingClass = json['Profile']['classAccesses'];
            expect(existingClass).not.toBeUndefined();
            expect(existingClass.apexClass).not.toBeUndefined();
            expect(existingClass.apexClass).toEqual(apexclassName);
            expect(existingClass.enabled).toEqual('false');
        }));
    }));
});
//# sourceMappingURL=edit.test.js.map