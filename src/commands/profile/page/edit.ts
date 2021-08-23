import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { editInProfiles } from '../../../shared/edit';
import { getDataForDisplay, getFileNames } from '../../../shared/util';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('profile-modifier-plugin', 'page');

export default class Edit extends SfdxCommand {

  public static description = messages.getMessage('editCommandDescription');

  public static examples = [
    '$ sfdx profile:page:edit --name MyPage --rename YourPage --profile "Admin" --enabled',
    '$ sfdx profile:page:edit --name MyPage --rename YourPage --enabled'
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
    enabled: flags.boolean({
      char: 'e',
      description: messages.getMessage('enabledFlagDescription')
    }),
    alphabetize: flags.boolean({
      char: 'a',
      description: messages.getMessage('alphabetizeFlagDescription')
    })
  };

  protected static requiresProject = true;

  private sourcePaths: string[];

  public async run(): Promise<AnyJson> {
    this.sourcePaths = ((await this.project.resolveProjectConfig())['packageDirectories'] as Array<{ path: string }>).map(d => d.path);

    const name = this.flags.name;
    const rename = this.flags.rename;
    const profiles = this.flags.profile;
    const enabled = this.flags.enabled || false;
    const alphabetize = this.flags.alphabetize || false;

    this.ux.startSpinner('Modifying profiles');

    const directories = (Array.isArray(this.sourcePaths)) ? this.sourcePaths.map(sp => `${this.project['path']}/${sp}/main/default/profiles/`) : [`${this.project['path']}/${this.sourcePaths}/main/default/profiles/`];

    const filesModified = await editInProfiles(getFileNames(directories, profiles, this.project['path']), name, rename, enabled, '', 'page', alphabetize);

    this.ux.stopSpinner('Done');

    this.ux.styledHeader('Pages edited in profiles');
    this.ux.table(getDataForDisplay(filesModified, this.project['path'].length, 'edit', 'page'), ['Action', 'MetadataType', 'ProjectFile']);

    return {};
  }
}
