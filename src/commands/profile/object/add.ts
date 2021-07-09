import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { addToProfiles } from '../../../shared/add';
import { getDataForDisplay, getFileNames, getObjectFieldFileNames } from '../../../shared/util';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('profile-modifier-plugin', 'object');

export default class Add extends SfdxCommand {

  public static description = messages.getMessage('addCommandDescription');

  public static examples = [
    '$ sfdx profile:object:add --name MyObject --profile "Admin" --permissions cred',
    '$ sfdx profile:object:add --name MyObject --permissions cred'
  ];

  protected static flagsConfig = {
    name: flags.array({
      char: 'n',
      required: true,
      description: messages.getMessage('nameFlagDescription')
    }),
    profile: flags.array({
      char: 'p',
      description: messages.getMessage('profileNameFlagDescription')
    }),
    permissions: flags.string({
      char: 'm',
      description: messages.getMessage('permissionsFlagDescription')
    }),
    alphabetize: flags.boolean({
      char: 'a',
      description: messages.getMessage('alphabetizeFlagDescription')
    }),
    addfields: flags.boolean({
      char: 'f',
      description: messages.getMessage('addFieldsFlagDescription')
    })
  };

  protected static requiresProject = true;

  private sourcePaths: string[];

  public async run(): Promise<AnyJson> {
    this.sourcePaths = ((await this.project.resolveProjectConfig())['packageDirectories'] as Array<{ path: string }>).map(d => d.path);

    const names = this.flags.name;
    const profiles = this.flags.profile;
    const permissions = this.flags.permissions;
    const alphabetize = this.flags.alphabetize;
    const addfields = this.flags.addfields || false;

    this.ux.startSpinner('Processing');

    const directories = (Array.isArray(this.sourcePaths)) ? this.sourcePaths.map(sp => `${this.project['path']}/${sp}/main/default/profiles/`) : [`${this.project['path']}/${this.sourcePaths}/main/default/profiles/`];

    const fileNames = getFileNames(directories, profiles, this.project['path']);
    const filesModified = await addToProfiles(fileNames, names, false, permissions, 'object', alphabetize);

    if (!addfields) {
      this.ux.stopSpinner('Done');
      this.ux.styledHeader('Objects added to profiles');
      this.ux.table(getDataForDisplay(filesModified, this.project['path'].length, 'add', 'object'), ['Action', 'MetadataType', 'ProjectFile']);
    } else {
      let fieldDirectories = [];

      for (const name of names) {
        const fieldDirs = (Array.isArray(this.sourcePaths)) ? this.sourcePaths.map(sp => `${this.project['path']}/${sp}/main/default/objects/${name}/fields/`) : [`${this.project['path']}/${this.sourcePaths}/main/default/objects/${name}/fields/`];
        for (const fieldDir of fieldDirs) {
          fieldDirectories.push(fieldDir);
        }
      }

      const fieldFileNames = await getObjectFieldFileNames(fieldDirectories);
      const filesModified = await addToProfiles(getFileNames(directories, profiles, this.project['path']), fieldFileNames, false, permissions, 'field', alphabetize);

      this.ux.stopSpinner('Done');
      this.ux.styledHeader('Objects and fields added to profiles');
      this.ux.table(getDataForDisplay(filesModified, this.project['path'].length, 'add', 'object'), ['Action', 'MetadataType', 'ProjectFile']);
    }

    return {};
  }
}
