"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@salesforce/command");
const core_1 = require("@salesforce/core");
const add_1 = require("../../../shared/add");
const util_1 = require("../../../shared/util");
// Initialize Messages with the current plugin directory
core_1.Messages.importMessagesDirectory(__dirname);
// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core_1.Messages.loadMessages('profile-additions', 'field');
class Add extends command_1.SfdxCommand {
    async run() {
        this.sourcePaths = (await this.project.resolveProjectConfig())['packageDirectories'].map(d => d.path);
        const names = this.flags.name;
        const profiles = this.flags.profile;
        const permissions = this.flags.permissions;
        const customDirectory = this.flags.filepath;
        const username = this.flags.username;
        this.ux.startSpinner('Processing');
        const directory = (customDirectory) ? `${this.project['path']}/${customDirectory}` : `${this.project['path']}/${this.sourcePaths}/main/default/profiles/`;
        let profilesModified;
        if (profiles) {
            profilesModified = add_1.addToProfiles(directory, util_1.getProfiles(profiles), names, false, permissions, 'field');
        }
        else {
            profilesModified = add_1.addToProfiles(directory, util_1.readFiles(directory), names, false, permissions, 'field');
        }
        if (username) {
            const profileNames = profilesModified.map(profile => {
                return `Profile:${profile.substr(0, profile.indexOf('.'))}`;
            });
            const command = `sfdx force:source:deploy -m "${profileNames.join(',')}" -u ${username}`;
            const result = await util_1.exec(command);
            this.ux.log(result.stdout);
            this.ux.stopSpinner(`Fields added to profiles and pushed to org ${username} successfully.`);
        }
        else {
            this.ux.stopSpinner('Fields added to profiles successfully');
        }
        return {};
    }
}
exports.default = Add;
Add.description = messages.getMessage('addCommandDescription');
Add.examples = [
    '$ sfdx profile:field:add --name MyField --profile "Admin" --permissions re',
    '$ sfdx profile:field:add --name MyField --permissions re'
];
Add.flagsConfig = {
    name: command_1.flags.array({
        char: 'n',
        required: true,
        description: messages.getMessage('nameFlagDescription')
    }),
    profile: command_1.flags.array({
        char: 'p',
        description: messages.getMessage('profileNameFlagDescription')
    }),
    permissions: command_1.flags.string({
        char: 'm',
        description: messages.getMessage('permissionsFlagDescription')
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
Add.requiresProject = true;
//# sourceMappingURL=add.js.map