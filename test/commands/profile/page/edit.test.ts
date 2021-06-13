import { exec } from 'child_process';
import fs = require('fs-extra');
import * as util from 'util';
import { getParsed } from '../../../../src/shared/util';

const execProm = util.promisify(exec);

const testProjectName = 'testProjectPage';
const apexpageName = 'MyVFP';
const apexpageRename = 'MyModifiedVFP';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';

describe('profile:page:edit', () => {
  jest.setTimeout(50000);

  beforeEach(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
    await fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
    await fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
  });

  test('renames existing page in profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:page:edit --name ${apexpageName} --rename ${apexpageRename} --profile ${profileName} --enabled`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const existingPage = json['Profile']['pageAccesses'];

    expect(existingPage).not.toBeUndefined();
    expect(existingPage.apexPage).not.toBeUndefined();
    expect(existingPage.apexPage).not.toEqual(apexpageName);
    expect(existingPage.apexPage).toEqual(apexpageRename);
    expect(existingPage.enabled).toEqual('true');
  });

  test('changes existing page permissions in profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:page:edit --name ${apexpageName} --profile ${profileName}`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const existingPage = json['Profile']['pageAccesses'];

    expect(existingPage).not.toBeUndefined();
    expect(existingPage.apexPage).not.toBeUndefined();
    expect(existingPage.apexPage).toEqual(apexpageName);
    expect(existingPage.enabled).toEqual('false');
  });

});
