import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { addToProfiles } from '../../../shared/add';
import { getDataForDisplay, getFileNames } from '../../../shared/util';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('profile-modifier-plugin', 'class');

export default class Add extends SfdxCommand {

  public static description = messages.getMessage('addCommandDescription');

  public static examples = [
    '$ sfdx profile:class:add --name MyClass --profile "Admin" --enabled',
    '$ sfdx profile:class:add --name MyClass --enabled'
  ];

  protected static requiresProject = true;

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
    }),
    alphabetize: flags.boolean({
      char: 'a',
      description: messages.getMessage('alphabetizeFlagDescription')
    })
  };

  private sourcePaths: string[];

  public async run(): Promise<AnyJson> {
    this.sourcePaths = ((await this.project.resolveProjectConfig())['packageDirectories'] as Array<{ path: string }>).map(d => d.path);

    const names = this.flags.name;
    const profiles = this.flags.profile;
    const enabled = this.flags.enabled || false;
    const alphabetize = this.flags.alphabetize || false;

    this.ux.startSpinner('Processing');

    const directories = (Array.isArray(this.sourcePaths)) ? this.sourcePaths.map(sp => `${this.project['path']}/${sp}/main/default/profiles/`) : [`${this.project['path']}/${this.sourcePaths}/main/default/profiles/`];

    const filesModified = await addToProfiles(getFileNames(directories, profiles, this.project['path']), names, enabled, '', 'class', alphabetize);

    this.ux.stopSpinner('Done');

    this.ux.styledHeader('Classes added to profiles');
    this.ux.table(getDataForDisplay(filesModified, this.project['path'].length, 'add', 'class'), ['Action', 'MetadataType', 'ProjectFile']);

    return {};
  }
}
