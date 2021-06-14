import { exec } from 'child_process';
import fs = require('fs-extra');
import * as util from 'util';
import { getParsed } from '../../../../src/shared/util';

const execProm = util.promisify(exec);

const testProjectName = 'testProjectClass';
const apexclassName = 'MyApexClass';
const apexclassRename = 'MyModifiedClass';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';

describe('profile:class:edit', () => {
  jest.setTimeout(50000);

  beforeAll(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
    await fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
  });

  beforeEach(async () => {
    await fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
  });

  test('renames existing class in profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:class:edit --name ${apexclassName} --rename ${apexclassRename} --profile ${profileName} --enabled`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const existingClass = json['Profile']['classAccesses'];

    expect(existingClass).not.toBeUndefined();
    expect(existingClass.apexClass).not.toBeUndefined();
    expect(existingClass.apexClass).not.toEqual(apexclassName);
    expect(existingClass.apexClass).toEqual(apexclassRename);
    expect(existingClass.enabled).toEqual('true');
  });

  test('changes existing class permissions in profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:class:edit --name ${apexclassName} --profile ${profileName}`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const existingClass = json['Profile']['classAccesses'];

    expect(existingClass).not.toBeUndefined();
    expect(existingClass.apexClass).not.toBeUndefined();
    expect(existingClass.apexClass).toEqual(apexclassName);
    expect(existingClass.enabled).toEqual('false');
  });

});
