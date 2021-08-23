"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromProfiles = void 0;
const tslib_1 = require("tslib");
const fs = require("fs-extra");
const util_1 = require("./util");
const removeFromProfiles = (fileNames, names, type, alphabetize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const filesModified = [];
    for (const fileName of fileNames) {
        if (fs.existsSync(fileName)) {
            let json = '{}';
            json = yield util_1.getParsed(yield fs.readFile(fileName));
            switch (type) {
                case 'class':
                    let classes = json['Profile']['classAccesses'];
                    if (classes && !Array.isArray(classes)) {
                        classes = [classes];
                    }
                    if (classes) {
                        for (const name of names) {
                            let idx = -1;
                            for (let i = 0; i < classes.length; i++) {
                                const cls = classes[i];
                                if (cls.apexClass === name) {
                                    idx = i;
                                    break;
                                }
                            }
                            if (idx > -1) {
                                classes.splice(idx, 1);
                                json['Profile']['classAccesses'] = classes;
                            }
                        }
                    }
                    break;
                case 'field':
                    let fields = json['Profile']['fieldPermissions'];
                    if (fields && !Array.isArray(fields)) {
                        fields = [fields];
                    }
                    if (fields) {
                        for (const name of names) {
                            let idx = -1;
                            for (let i = 0; i < fields.length; i++) {
                                const cls = fields[i];
                                if (cls.field === name) {
                                    idx = i;
                                    break;
                                }
                            }
                            if (idx > -1) {
                                fields.splice(idx, 1);
                                json['Profile']['fieldPermissions'] = fields;
                            }
                        }
                    }
                    break;
                case 'object':
                    let objects = json['Profile']['objectPermissions'];
                    if (objects && !Array.isArray(objects)) {
                        objects = [objects];
                    }
                    if (objects) {
                        for (const name of names) {
                            let idx = -1;
                            for (let i = 0; i < objects.length; i++) {
                                const cls = objects[i];
                                if (cls.object === name) {
                                    idx = i;
                                    break;
                                }
                            }
                            if (idx > -1) {
                                objects.splice(idx, 1);
                                json['Profile']['objectPermissions'] = objects;
                            }
                        }
                    }
                    break;
                case 'page':
                    let pages = json['Profile']['pageAccesses'];
                    if (pages && !Array.isArray(pages)) {
                        pages = [pages];
                    }
                    if (pages) {
                        for (const name of names) {
                            let idx = -1;
                            for (let i = 0; i < pages.length; i++) {
                                const cls = pages[i];
                                if (cls.apexPage === name) {
                                    idx = i;
                                    break;
                                }
                            }
                            if (idx > -1) {
                                pages.splice(idx, 1);
                                json['Profile']['pageAccesses'] = pages;
                            }
                        }
                    }
                    break;
            }
            yield fs.writeFile(fileName, util_1.formatMetadata(json, alphabetize), 'utf-8');
            filesModified.push(fileName);
        }
    }
    return filesModified;
});
exports.removeFromProfiles = removeFromProfiles;
//# sourceMappingURL=delete.js.map