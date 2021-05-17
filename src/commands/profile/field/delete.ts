import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { removeFromProfiles } from '../../../shared/delete';
import { exec, getProfiles, readFiles } from '../../../shared/util';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('profile-modifier-plugin', 'field');
export default class Delete extends SfdxCommand {

  public static description = messages.getMessage('deleteCommandDescription');

  public static examples = [
    '$ sfdx profile:field:delete --name MyField --profile "Admin"',
    '$ sfdx profile:field:delete --name MyField'
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

    const names = this.flags.name;
    const profiles = this.flags.profile;
    const customDirectory = this.flags.filepath;
    const username = this.flags.username;

    this.ux.startSpinner('Processing');

    const directory = (customDirectory) ? `${this.project['path']}/${customDirectory}` : `${this.project['path']}/${this.sourcePaths}/main/default/profiles/`;
    let profilesModified;
    if (profiles) {
      profilesModified = removeFromProfiles(directory, getProfiles(profiles), names, 'field');
    } else {
      profilesModified = removeFromProfiles(directory, readFiles(directory), names, 'field');
    }

    if (username) {
      const profileNames = profilesModified.map(profile => {
        return `Profile:${profile.substr(0, profile.indexOf('.'))}`;
      });

      const command = `sfdx force:source:deploy -m "${profileNames.join(',')}" -u ${username}`;
      const result = await exec(command);

      this.ux.log(result.stdout);
      this.ux.stopSpinner(`Fields removed from profiles and pushed to org ${username} successfully.`);
    } else {
      this.ux.stopSpinner('Fields removed from profiles successfully');
    }

    return {};
  }
}
