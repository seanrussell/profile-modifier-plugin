import { exec } from 'child_process';
import fs = require('fs-extra');
import * as util from 'util';
import { getParsed } from '../../../../src/shared/util';

const execProm = util.promisify(exec);

const testProjectName = 'testProjectField';
const apexfieldName = 'Account.AccountNumber';
const apexfieldRename = 'Account.Account_Identifier__c';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';

describe('profile:field:edit', () => {
  jest.setTimeout(50000);

  beforeEach(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
    await fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
    await fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
  });

  test('renames existing field in profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:field:edit --name "${apexfieldName}" --rename "${apexfieldRename}" --profile ${profileName}`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const existingField = json['Profile']['fieldPermissions'];

    expect(existingField).not.toBeUndefined();
    expect(existingField.field).not.toBeUndefined();
    expect(existingField.field).not.toEqual(apexfieldName);
    expect(existingField.field).toEqual(apexfieldRename);
    expect(existingField.readable).toEqual('false');
    expect(existingField.editable).toEqual('false');
  });

  test('changes existing field permissions in profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:field:edit --name "${apexfieldName}" --profile ${profileName} --permissions re`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const existingField = json['Profile']['fieldPermissions'];

    expect(existingField).not.toBeUndefined();
    expect(existingField.field).not.toBeUndefined();
    expect(existingField.field).toEqual(apexfieldName);
    expect(existingField.readable).toEqual('true');
    expect(existingField.editable).toEqual('true');
  });

});
