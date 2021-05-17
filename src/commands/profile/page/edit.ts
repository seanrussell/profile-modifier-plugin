import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { editInProfiles } from '../../../shared/edit';
import { exec, getProfiles, readFiles } from '../../../shared/util';

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
    filepath: flags.boolean({
      char: 'f',
      description: messages.getMessage('filePathDescription')
    }),
    username: flags.boolean({
      char: 'u',
      description: messages.getMessage('usernameDescription')
    })
  };

  protected static requiresProject = true;

  private sourcePaths: string[];

  public async run(): Promise<AnyJson> {
    this.sourcePaths = ((await this.project.resolveProjectConfig())['packageDirectories'] as Array<{ path: string }>).map(d => d.path);

    const name = this.flags.name;
    const rename = this.flags.rename;
    const profiles = this.flags.profile;
    const enabled = this.flags.enabled;
    const customDirectory = this.flags.filepath;
    const username = this.flags.username;

    this.ux.startSpinner('Processing');

    const directory = (customDirectory) ? `${this.project['path']}/${customDirectory}` : `${this.project['path']}/${this.sourcePaths}/main/default/profiles/`;

    let profilesModified;
    if (profiles) {
      profilesModified = editInProfiles(directory, getProfiles(profiles), name, rename, enabled, '', 'page');
    } else {
      profilesModified = editInProfiles(directory, readFiles(directory), name, rename, enabled, '', 'page');
    }

    if (username) {
      const profileNames = profilesModified.map(profile => {
        return `Profile:${profile.substr(0, profile.indexOf('.'))}`;
      });

      const command = `sfdx force:source:deploy -m "${profileNames.join(',')}" -u ${username}`;
      const result = await exec(command);

      this.ux.log(result.stdout);
      this.ux.stopSpinner(`Pages edited in profiles and pushed to org ${username} successfully.`);
    } else {
      this.ux.stopSpinner('Pages edited in profiles successfully');
    }

    return {};
  }
}
