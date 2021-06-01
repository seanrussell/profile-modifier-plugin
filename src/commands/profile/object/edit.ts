import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { editInProfiles } from '../../../shared/edit';
import { getProfiles, readFiles } from '../../../shared/util';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('profile-modifier-plugin', 'object');

export default class Edit extends SfdxCommand {

  public static description = messages.getMessage('editCommandDescription');

  public static examples = [
    '$ sfdx profile:object:edit --name MyObject --rename YourObject --profile "Admin" --enabled',
    '$ sfdx profile:object:edit --name MyObject --rename YourObject --enabled'
  ];

  protected static flagsConfig = {
    name: flags.string({
      char: 'n',
      required: true,
      description: messages.getMessage('nameFlagDescription')
    }),
    rename: flags.string({
      char: 'r',
      description: messages.getMessage('renameFlagDescription')
    }),
    profile: flags.array({
      char: 'p',
      description: messages.getMessage('profileNameFlagDescription')
    }),
    permissions: flags.string({
      char: 'm',
      description: messages.getMessage('permissionsFlagDescription')
    })
  };

  protected static requiresProject = true;

  private sourcePaths: string[];
  private data: string[];

  public async run(): Promise<AnyJson> {
    this.sourcePaths = ((await this.project.resolveProjectConfig())['packageDirectories'] as Array<{ path: string }>).map(d => d.path);

    const name = this.flags.name;
    const rename = this.flags.rename;
    const profiles = this.flags.profile;
    const permissions = this.flags.permissions;

    this.ux.startSpinner('Modifying profiles');

    const directories = (Array.isArray(this.sourcePaths)) ? this.sourcePaths.map(sp => `${this.project['path']}/${sp}/main/default/profiles/`) : [`${this.project['path']}/${this.sourcePaths}/main/default/profiles/`];

    if (profiles) {
      this.data = await editInProfiles(directories, getProfiles(profiles, this.project['path']), name, rename, false, permissions, 'object');
    } else {
      this.data = await editInProfiles(directories, readFiles(directories), name, rename, false, permissions, 'object');
    }

    this.ux.stopSpinner('Classes added to profiles successfully');

    this.ux.styledHeader('Results');
    this.ux.table(this.data, ['Profile Modified']);

    return {};
  }
}
