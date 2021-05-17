import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { addToProfiles } from '../../../shared/add';
import { exec, getProfiles, readFiles } from '../../../shared/util';

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
    filepath: flags.boolean({
      char: 'f',
      description: messages.getMessage('filePathDescription')
    }),
    username: flags.string({
      char: 'u',
      description: messages.getMessage('usernameDescription')
    })
  };

  private sourcePaths: string[];

  public async run(): Promise<AnyJson> {
    this.sourcePaths = ((await this.project.resolveProjectConfig())['packageDirectories'] as Array<{ path: string }>).map(d => d.path);

    const names = this.flags.name;
    const profiles = this.flags.profile;
    const enabled = this.flags.enabled;
    const customDirectory = this.flags.filepath;
    const username = this.flags.username;

    this.ux.startSpinner('Processing');

    const directory = (customDirectory) ? `${this.project['path']}/${customDirectory}` : `${this.project['path']}/${this.sourcePaths}/main/default/profiles/`;

    let profilesModified;
    if (profiles) {
      profilesModified = await addToProfiles(directory, getProfiles(profiles), names, enabled, '', 'class');
    } else {
      profilesModified = await addToProfiles(directory, readFiles(directory), names, enabled, '', 'class');
    }

    if (username) {
      const profileNames = profilesModified.map(profile => {
        return `Profile:${profile.substr(0, profile.indexOf('.'))}`;
      });

      const command = `sfdx force:source:deploy -m "${profileNames.join(',')}" -u ${username}`;
      const result = await exec(command);

      this.ux.log(result.stdout);
      this.ux.stopSpinner(`Classes added to profiles and pushed to org ${username} successfully.`);
    } else {
      this.ux.stopSpinner('Classes added to profiles successfully');
    }

    return {};
  }
}
