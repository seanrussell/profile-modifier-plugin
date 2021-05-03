"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.readFiles = exports.getProfiles = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const fs = tslib_1.__importStar(require("fs"));
const util = tslib_1.__importStar(require("util"));
const execProm = util.promisify(child_process_1.exec);
exports.exec = execProm;
const FILE_SUFFIX = '.profile-meta.xml';
const getProfiles = profiles => {
    return profiles.map(profile => {
        return `${profile}${FILE_SUFFIX}`;
    });
};
exports.getProfiles = getProfiles;
const readFiles = directory => {
    return fs.readdirSync(directory);
};
exports.readFiles = readFiles;
//# sourceMappingURL=util.js.map