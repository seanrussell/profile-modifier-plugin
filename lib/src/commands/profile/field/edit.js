"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@salesforce/command");
const core_1 = require("@salesforce/core");
const edit_1 = require("../../../shared/edit");
const util_1 = require("../../../shared/util");
core_1.Messages.importMessagesDirectory(__dirname);
const messages = core_1.Messages.loadMessages('profile-modifier-plugin', 'field');
class Edit extends command_1.SfdxCommand {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.sourcePaths = (yield this.project.resolveProjectConfig())['packageDirectories'].map(d => d.path);
            const name = this.flags.name;
            const rename = this.flags.rename;
            const profiles = this.flags.profile;
            const permissions = this.flags.permissions;
            const alphabetize = this.flags.alphabetize || false;
            this.ux.startSpinner('Processing');
            const directories = (Array.isArray(this.sourcePaths)) ? this.sourcePaths.map(sp => `${this.project['path']}/${sp}/main/default/profiles/`) : [`${this.project['path']}/${this.sourcePaths}/main/default/profiles/`];
            const filesModified = yield edit_1.editInProfiles(util_1.getFileNames(directories, profiles, this.project['path']), name, rename, false, permissions, 'field', alphabetize);
            this.ux.stopSpinner('Done');
            this.ux.styledHeader('Fields edited in profiles');
            this.ux.table(util_1.getDataForDisplay(filesModified, this.project['path'].length, 'edit', 'field'), ['Action', 'MetadataType', 'ProjectFile']);
            return {};
        });
    }
}
exports.default = Edit;
Edit.description = messages.getMessage('editCommandDescription');
Edit.examples = [
    '$ sfdx profile:field:edit --name MyObject.MyField --rename YourObject.YourField --profile "Admin" --enabled',
    '$ sfdx profile:field:edit --name MyObject.MyField --rename YourObject.YourField --enabled'
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
    permissions: command_1.flags.string({
        char: 'm',
        description: messages.getMessage('permissionsFlagDescription')
    }),
    alphabetize: command_1.flags.boolean({
        char: 'a',
        description: messages.getMessage('alphabetizeFlagDescription')
    })
};
Edit.requiresProject = true;
//# sourceMappingURL=edit.js.map