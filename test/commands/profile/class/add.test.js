"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const fs = require("fs-extra");
const util = tslib_1.__importStar(require("util"));
const util_1 = require("../../../../src/shared/util");
const execProm = util.promisify(child_process_1.exec);
const testProjectName = 'testProjectClass';
const apexclassName = 'MyClass';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';
describe('profile:class:add', () => {
    jest.setTimeout(50000);
    beforeAll(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield fs.remove(testProjectName);
        yield child_process_1.exec(`sfdx force:project:create -n ${testProjectName}`);
        yield fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
    }));
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
    }));
    test('adds disabled class to profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(fs.existsSync(testProjectName)).toBe(true);
        execProm(`sfdx profile:class:add --name ${apexclassName} --profile ${profileName}`, { cwd: testProjectName })
            .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const profilePath = `${testProjectName}/${filePath}`;
            expect(fs.existsSync(profilePath)).toBe(true);
            const json = yield util_1.getParsed(yield fs.readFile(profilePath));
            const classes = json['Profile']['classAccesses'];
            expect(classes).not.toBeUndefined();
            const existingClass = classes.find(cls => {
                return cls.apexClass === apexclassName;
            });
            expect(existingClass.apexClass).not.toBeNull();
            expect(existingClass.apexClass).toEqual(apexclassName);
            expect(existingClass.enabled).toEqual('false');
        }));
    }));
    test('adds enabled class to profile', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        expect(fs.existsSync(testProjectName)).toBe(true);
        execProm(`sfdx profile:class:add --name ${apexclassName} --profile ${profileName} --enabled`, { cwd: testProjectName })
            .then(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const profilePath = `${testProjectName}/${filePath}`;
            expect(fs.existsSync(profilePath)).toBe(true);
            const json = yield util_1.getParsed(yield fs.readFile(profilePath));
            const classes = json['Profile']['classAccesses'];
            expect(classes).not.toBeUndefined();
            const existingClass = classes.find(cls => {
                return cls.apexClass === apexclassName;
            });
            expect(existingClass.apexClass).not.toBeNull();
            expect(existingClass.apexClass).toEqual(apexclassName);
            expect(existingClass.enabled).toEqual('true');
        }));
    }));
});
//# sourceMappingURL=add.test.js.map