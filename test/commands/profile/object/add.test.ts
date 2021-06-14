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

  beforeAll(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
    await fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
  });

  beforeEach(async () => {
    await fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
  });

  test('adds read only object to profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    const cmd = `sfdx profile:object:add --name ${apexobjectName} --profile ${profileName} --permissions r`;

    await execProm(cmd, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
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
  });

  test('adds full access object to profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:object:add --name ${apexobjectName} --profile ${profileName} --permissions credmv`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
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
  });

});
