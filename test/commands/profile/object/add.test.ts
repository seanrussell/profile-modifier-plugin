import { exec } from 'child_process';
import fs = require('fs-extra');
import * as util from 'util';
import { getParsed } from '../../../../src/shared/util';

const execProm = util.promisify(exec);

const testProjectName = 'testProjectObject';
const apexobjectName = 'TestObject__c';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';

describe('profile:object:add', () => {
  jest.setTimeout(50000);

  beforeEach(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
    await fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
    await fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
  });

  test('adds read only object to profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:object:add --name "${apexobjectName}" --profile ${profileName} --permissions r`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const objects = json['Profile']['objectPermissions'];

    expect(objects).not.toBeNull();

    const existingClass = objects.find(cls => {
      return cls.object === apexobjectName;
    });

    expect(existingClass.object).not.toBeNull();
    expect(existingClass.object).toEqual(apexobjectName);
    expect(existingClass.allowRead).toEqual('true');
    expect(existingClass.allowEdit).toEqual('false');
    expect(existingClass.allowCreate).toEqual('false');
    expect(existingClass.allowDelete).toEqual('false');
    expect(existingClass.modifyAllRecords).toEqual('false');
    expect(existingClass.viewAllRecords).toEqual('false');
  });

  test('adds full access object to profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:object:add --name ${apexobjectName} --profile ${profileName} --permissions creadmv`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const objects = json['Profile']['objectPermissions'];

    expect(objects).not.toBeNull();

    const existingClass = objects.find(cls => {
      return cls.object === apexobjectName;
    });

    expect(existingClass.object).not.toBeNull();
    expect(existingClass.object).toEqual(apexobjectName);
    expect(existingClass.allowRead).toEqual('true');
    expect(existingClass.allowEdit).toEqual('true');
    expect(existingClass.allowCreate).toEqual('true');
    expect(existingClass.allowDelete).toEqual('true');
    expect(existingClass.modifyAllRecords).toEqual('true');
    expect(existingClass.viewAllRecords).toEqual('true');
  });

});
