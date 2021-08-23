"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@salesforce/command");
const core_1 = require("@salesforce/core");
const delete_1 = require("../../../shared/delete");
const util_1 = require("../../../shared/util");
core_1.Messages.importMessagesDirectory(__dirname);
const messages = core_1.Messages.loadMessages('profile-modifier-plugin', 'field');
class Delete extends command_1.SfdxCommand {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.sourcePaths = (yield this.project.resolveProjectConfig())['packageDirectories'].map(d => d.path);
            const names = this.flags.name;
            const profiles = this.flags.profile;
            const alphabetize = this.flags.alphabetize || false;
            this.ux.startSpinner('Processing');
            const directories = (Array.isArray(this.sourcePaths)) ? this.sourcePaths.map(sp => `${this.project['path']}/${sp}/main/default/profiles/`) : [`${this.project['path']}/${this.sourcePaths}/main/default/profiles/`];
            const filesModified = yield delete_1.removeFromProfiles(util_1.getFileNames(directories, profiles, this.project['path']), names, 'field', alphabetize);
            this.ux.stopSpinner('Done');
            this.ux.styledHeader('Fields removed from profiles');
            this.ux.table(util_1.getDataForDisplay(filesModified, this.project['path'].length, 'delete', 'field'), ['Action', 'MetadataType', 'ProjectFile']);
            return {};
        });
    }
}
exports.default = Delete;
Delete.description = messages.getMessage('deleteCommandDescription');
Delete.examples = [
    '$ sfdx profile:field:delete --name MyField --profile "Admin"',
    '$ sfdx profile:field:delete --name MyField'
];
Delete.flagsConfig = {
    name: command_1.flags.array({
        char: 'n',
        required: true,
        description: messages.getMessage('nameFlagDescription')
    }),
    profile: command_1.flags.array({
        char: 'p',
        description: messages.getMessage('profileNameFlagDescription')
    }),
    alphabetize: command_1.flags.boolean({
        char: 'a',
        description: messages.getMessage('alphabetizeFlagDescription')
    })
};
Delete.requiresProject = true;
//# sourceMappingURL=delete.js.map