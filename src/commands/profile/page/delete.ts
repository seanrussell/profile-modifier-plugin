import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { removeFromProfiles } from '../../../shared/delete';
import { getProfiles, readFiles } from '../../../shared/util';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('profile-modifier-plugin', 'page');

export default class Delete extends SfdxCommand {

  public static description = messages.getMessage('deleteCommandDescription');

  public static examples = [
    '$ sfdx profile:page:delete --name MyPage --profile "Admin"',
    '$ sfdx profile:page:delete --name MyPage'
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
  private data: string[];

  public async run(): Promise<AnyJson> {
    this.sourcePaths = ((await this.project.resolveProjectConfig())['packageDirectories'] as Array<{ path: string }>).map(d => d.path);

    const names = this.flags.name;
    const profiles = this.flags.profile;

    this.ux.startSpinner('Modifying profiles');

    const directories = (Array.isArray(this.sourcePaths)) ? this.sourcePaths.map(sp => `${this.project['path']}/${sp}/main/default/profiles/`) : [`${this.project['path']}/${this.sourcePaths}/main/default/profiles/`];

    if (profiles) {
      this.data = await removeFromProfiles(directories, getProfiles(profiles, this.project['path']), names, 'page');
    } else {
      this.data = await removeFromProfiles(directories, readFiles(directories), names, 'page');
    }

    this.ux.stopSpinner('Classes added to profiles successfully');

    this.ux.styledHeader('Results');
    this.ux.table(this.data, ['Profile Modified']);

    return {};
  }
}
