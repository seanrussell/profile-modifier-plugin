import { exec } from 'child_process';
import fs = require('fs-extra');
import * as util from 'util';
import { getParsed } from '../../../../src/shared/util';

const execProm = util.promisify(exec);

const testProjectName = 'testProjectClass';
const apexclassName = 'MyClass';
const profileName = 'Admin';
const filePath = 'force-app/main/default/profiles/Admin.profile-meta.xml';

describe('profile:class:add', () => {
  jest.setTimeout(50000);

  beforeEach(async () => {
    await fs.remove(testProjectName);
    await exec(`sfdx force:project:create -n ${testProjectName}`);
    await fs.ensureDir(`${testProjectName}/force-app/main/default/profiles`);
    await fs.copy('test/helpers/dummy.profile-meta.xml', `${testProjectName}/${filePath}`);
  });

  test('adds disabled class to profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:class:add --name ${apexclassName} --profile ${profileName}`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const classes = json['Profile']['classAccesses'];

    expect(classes).not.toBeUndefined();

    const existingClass = classes.find(cls => {
      return cls.apexClass === apexclassName;
    });

    expect(existingClass.apexClass).not.toBeNull();
    expect(existingClass.apexClass).toEqual(apexclassName);
    expect(existingClass.enabled).toEqual('false');
  });

  test('adds enabled class to profile', async () => {
    expect(fs.existsSync(testProjectName)).toBe(true);

    await execProm(`sfdx profile:class:add --name ${apexclassName} --profile ${profileName} --enabled`, { cwd: testProjectName });

    const profilePath = `${testProjectName}/${filePath}`;

    expect(fs.existsSync(profilePath)).toBe(true);

    const json = await getParsed(await fs.readFile(profilePath));
    const classes = json['Profile']['classAccesses'];

    expect(classes).not.toBeUndefined();

    const existingClass = classes.find(cls => {
      return cls.apexClass === apexclassName;
    });

    expect(existingClass.apexClass).not.toBeNull();
    expect(existingClass.apexClass).toEqual(apexclassName);
    expect(existingClass.enabled).toEqual('true');
  });

});
