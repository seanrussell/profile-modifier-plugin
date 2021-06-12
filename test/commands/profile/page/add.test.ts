import { exec } from 'child_process';
import fs = require('fs-extra');
import * as util from 'util';
import { getParsed } from '../../../../src/shared/util';

const execProm = util.promisify(exec);

const testProjectName = 'testProjectPage';
const apexpageName = 'MyPage';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';

describe('profile:page:add', () => {
  jest.setTimeout(50000);

  beforeEach(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
    await fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
    await fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
  });

  test('adds disabled page to profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:page:add --name ${apexpageName} --profile ${profileName}`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const pages = json['Profile']['pageAccesses'];

    expect(pages).not.toBeNull();

    const existingClass = pages.find(cls => {
      return cls.apexPage === apexpageName;
    });

    expect(existingClass.apexPage).not.toBeNull();
    expect(existingClass.apexPage).toEqual(apexpageName);
    expect(existingClass.enabled).toEqual('false');
  });

  test('adds enabled page to profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:page:add --name ${apexpageName} --profile ${profileName} --enabled`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const pages = json['Profile']['pageAccesses'];

    expect(pages).not.toBeNull();

    const existingClass = pages.find(cls => {
      return cls.apexPage === apexpageName;
    });

    expect(existingClass.apexPage).not.toBeNull();
    expect(existingClass.apexPage).toEqual(apexpageName);
    expect(existingClass.enabled).toEqual('true');
  });

});
