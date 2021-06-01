import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { addToProfiles } from '../../../shared/add';
import { getProfiles, readFiles } from '../../../shared/util';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('profile-modifier-plugin', 'page');

export default class Add extends SfdxCommand {

  public static description = messages.getMessage('addCommandDescription');

  public static examples = [
    '$ sfdx profile:page:add --name MyVfPage --profile "Admin" --enabled',
    '$ sfdx profile:page:add --name MyVfPage --enabled'
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
    enabled: flags.boolean({
      char: 'e',
      description: messages.getMessage('enabledFlagDescription')
    })
  };

  protected static requiresProject = true;

  private sourcePaths: string[];
  private data: string[];

  public async run(): Promise<AnyJson> {
    this.sourcePaths = ((await this.project.resolveProjectConfig())['packageDirectories'] as Array<{ path: string }>).map(d => d.path);

    const names = this.flags.name;
    const profiles = this.flags.profile;
    const enabled = this.flags.enabled;

    this.ux.startSpinner('Modifying profiles');

    const directories = (Array.isArray(this.sourcePaths)) ? this.sourcePaths.map(sp => `${this.project['path']}/${sp}/main/default/profiles/`) : [`${this.project['path']}/${this.sourcePaths}/main/default/profiles/`];

    if (profiles) {
      this.data = await addToProfiles(directories, getProfiles(profiles, this.project['path']), names, enabled, '', 'page');
    } else {
      this.data = await addToProfiles(directories, readFiles(directories), names, enabled, '', 'page');
    }

    this.ux.stopSpinner('Classes added to profiles successfully');

    this.ux.styledHeader('Results');
    this.ux.table(this.data, ['Profile Modified']);

    return {};
  }
}
