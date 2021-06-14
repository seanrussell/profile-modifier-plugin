import { exec } from 'child_process';
import fs = require('fs-extra');
import * as util from 'util';
import { getParsed } from '../../../../src/shared/util';

const execProm = util.promisify(exec);

const testProjectName = 'testProjectObject';
const apexobjectName = 'MyCustomObject__c';
const apexobjectRename = 'YourCustomObject__c';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';

describe('profile:object:edit', () => {
  jest.setTimeout(50000);

  beforeAll(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
    await fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
  });

  beforeEach(async () => {
    await fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
  });

  test('renames existing object in profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:object:edit --name ${apexobjectName} --rename ${apexobjectRename} --profile ${profileName} --permissions credmv`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const existingObject = json['Profile']['objectPermissions'];

    expect(existingObject).not.toBeUndefined();
    expect(existingObject.object).not.toBeUndefined();
    expect(existingObject.object).not.toEqual(apexobjectName);
    expect(existingObject.object).toEqual(apexobjectRename);
    expect(existingObject.allowRead).toEqual('true');
    expect(existingObject.allowEdit).toEqual('true');
    expect(existingObject.allowCreate).toEqual('true');
    expect(existingObject.allowDelete).toEqual('true');
    expect(existingObject.modifyAllRecords).toEqual('true');
    expect(existingObject.viewAllRecords).toEqual('true');
  });

  test('changes existing object permissions in profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:object:edit --name ${apexobjectName} --profile ${profileName}`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const existingObject = json['Profile']['objectPermissions'];

    expect(existingObject).not.toBeUndefined();
    expect(existingObject.object).not.toBeUndefined();
    expect(existingObject.object).toEqual(apexobjectName);
    expect(existingObject.allowRead).toEqual('true');
    expect(existingObject.allowEdit).toEqual('true');
    expect(existingObject.allowCreate).toEqual('true');
    expect(existingObject.allowDelete).toEqual('true');
    expect(existingObject.modifyAllRecords).toEqual('true');
    expect(existingObject.viewAllRecords).toEqual('true');
  });

});
