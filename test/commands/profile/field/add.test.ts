import { exec } from 'child_process';
import fs = require('fs-extra');
import * as util from 'util';
import { getParsed } from '../../../../src/shared/util';

const execProm = util.promisify(exec);

const testProjectName = 'testProjectField';
const apexfieldName = 'TestObject__c.TestField__c';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';

describe('profile:field:add', () => {
  jest.setTimeout(50000);

  beforeEach(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
    await fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
    await fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
  });

  test('adds read only field to profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:field:add --name "${apexfieldName}" --profile ${profileName} --permissions r`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const fields = json['Profile']['fieldPermissions'];

    expect(fields).not.toBeNull();

    const existingClass = fields.find(cls => {
      return cls.field === apexfieldName;
    });

    expect(existingClass.field).not.toBeNull();
    expect(existingClass.field).toEqual(apexfieldName);
    expect(existingClass.readable).toEqual('true');
    expect(existingClass.editable).toEqual('false');
  });

  test('adds read and edit field to profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:field:add --name ${apexfieldName} --profile ${profileName} --permissions re`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const fields = json['Profile']['fieldPermissions'];

    expect(fields).not.toBeNull();

    const existingClass = fields.find(cls => {
      return cls.field === apexfieldName;
    });

    expect(existingClass.field).not.toBeNull();
    expect(existingClass.field).toEqual(apexfieldName);
    expect(existingClass.readable).toEqual('true');
    expect(existingClass.editable).toEqual('true');
  });

});
