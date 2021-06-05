import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { removeFromProfiles } from '../../../shared/delete';
import { getDataForDisplay, getFileNames } from '../../../shared/util';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('profile-modifier-plugin', 'class');

export default class Delete extends SfdxCommand {

  public static description = messages.getMessage('deleteCommandDescription');

  public static examples = [
    '$ sfdx profile:class:delete --name MyClass --profile "Admin"',
    '$ sfdx profile:class:delete --name MyClass'
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
    })
  };

  protected static requiresProject = true;

  private sourcePaths: string[];

  public async run(): Promise<AnyJson> {
    this.sourcePaths = ((await this.project.resolveProjectConfig())['packageDirectories'] as Array<{ path: string }>).map(d => d.path);

    const names = this.flags.name;
    const profiles = this.flags.profile;

    this.ux.startSpinner('Processing');

    const directories = (Array.isArray(this.sourcePaths)) ? this.sourcePaths.map(sp => `${this.project['path']}/${sp}/main/default/profiles/`) : [`${this.project['path']}/${this.sourcePaths}/main/default/profiles/`];

    const filesModified = await removeFromProfiles(getFileNames(directories, profiles, this.project['path']), names, 'class');

    this.ux.stopSpinner('Done');

    this.ux.styledHeader('Classes removed from profiles');
    this.ux.table(getDataForDisplay(filesModified, this.project['path'].length, 'delete', 'class'), ['Action', 'MetadataType', 'ProjectFile']);

    return {};
  }
}
