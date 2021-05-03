"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@salesforce/command");
const core_1 = require("@salesforce/core");
const edit_1 = require("../../../shared/edit");
const util_1 = require("../../../shared/util");
// Initialize Messages with the current plugin directory
core_1.Messages.importMessagesDirectory(__dirname);
// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core_1.Messages.loadMessages('profile-additions', 'class');
class Edit extends command_1.SfdxCommand {
    async run() {
        this.sourcePaths = (await this.project.resolveProjectConfig())['packageDirectories'].map(d => d.path);
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
            profilesModified = edit_1.editInProfiles(directory, util_1.getProfiles(profiles), name, rename, enabled, '', 'class');
        }
        else {
            profilesModified = edit_1.editInProfiles(directory, util_1.readFiles(directory), name, rename, enabled, '', 'class');
        }
        if (username) {
            const profileNames = profilesModified.map(profile => {
                return `Profile:${profile.substr(0, profile.indexOf('.'))}`;
            });
            const command = `sfdx force:source:deploy -m "${profileNames.join(',')}" -u ${username}`;
            const result = await util_1.exec(command);
            this.ux.log(result.stdout);
            this.ux.stopSpinner(`Classes edited in profiles and pushed to org ${username} successfully.`);
        }
        else {
            this.ux.stopSpinner('Classes edited in profiles successfully');
        }
        return {};
    }
}
exports.default = Edit;
Edit.description = messages.getMessage('editCommandDescription');
Edit.examples = [
    '$ sfdx profile:class:edit --name MyClass --rename YourClass --profile "Admin" --enabled',
    '$ sfdx profile:class:edit --name MyClass --rename YourClass --enabled'
];
Edit.flagsConfig = {
    name: command_1.flags.string({
        char: 'n',
        required: true,
        description: messages.getMessage('nameFlagDescription')
    }),
    rename: command_1.flags.string({
        char: 'r',
        description: messages.getMessage('renameFlagDescription')
    }),
    profile: command_1.flags.array({
        char: 'p',
        description: messages.getMessage('profileNameFlagDescription')
    }),
    enabled: command_1.flags.boolean({
        char: 'e',
        description: messages.getMessage('enabledFlagDescription')
    }),
    filepath: command_1.flags.boolean({
        char: 'f',
        description: messages.getMessage('filePathDescription')
    }),
    username: command_1.flags.boolean({
        char: 'u',
        description: messages.getMessage('usernameDescription')
    })
};
Edit.requiresProject = true;
//# sourceMappingURL=edit.js.map