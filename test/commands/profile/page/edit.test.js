"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const fs = require("fs-extra");
const util = tslib_1.__importStar(require("util"));
const util_1 = require("../../../../src/shared/util");
const execProm = util.promisify(child_process_1.exec);
const testProjectName = 'testProjectPage';
const apexpageName = 'MyVFP';
const apexpageRename = 'MyModifiedVFP';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';
describe('profile:page:edit', () => {
    jest.setTimeout(50000);
    beforeAll(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield fs.remove(testProjectName);
        yield child_process_1.exec(`sfdx force:project:create -n ${testProjectName}`);
        yield fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
    }));
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
    }));
    test('renames existing page in profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(fs.existsSync(testProjectName)).toBe(true);
        execProm(`sfdx profile:page:edit --name ${apexpageName} --rename ${apexpageRename} --profile ${profileName} --enabled`, { cwd: testProjectName })
            .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const profilePath = `${testProjectName}/${filePath}`;
            expect(fs.existsSync(profilePath)).toBe(true);
            const json = yield util_1.getParsed(yield fs.readFile(profilePath));
            const existingPage = json['Profile']['pageAccesses'];
            expect(existingPage).not.toBeUndefined();
            expect(existingPage.apexPage).not.toBeUndefined();
            expect(existingPage.apexPage).not.toEqual(apexpageName);
            expect(existingPage.apexPage).toEqual(apexpageRename);
            expect(existingPage.enabled).toEqual('true');
        }));
    }));
    test('changes existing page permissions in profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(fs.existsSync(testProjectName)).toBe(true);
        execProm(`sfdx profile:page:edit --name ${apexpageName} --profile ${profileName}`, { cwd: testProjectName })
            .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const profilePath = `${testProjectName}/${filePath}`;
            expect(fs.existsSync(profilePath)).toBe(true);
            const json = yield util_1.getParsed(yield fs.readFile(profilePath));
            const existingPage = json['Profile']['pageAccesses'];
            expect(existingPage).not.toBeUndefined();
            expect(existingPage.apexPage).not.toBeUndefined();
            expect(existingPage.apexPage).toEqual(apexpageName);
            expect(existingPage.enabled).toEqual('false');
        }));
    }));
});
//# sourceMappingURL=edit.test.js.map