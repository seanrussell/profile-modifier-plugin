"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editInProfiles = void 0;
const tslib_1 = require("tslib");
const fs = require("fs-extra");
const util_1 = require("./util");
const editInProfiles = (fileNames, name, rename, enabled, permissions, type, alphabetize) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
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
                        json['Profile']['classAccesses'] = classes;
                    }
                    let existingClass;
                    if (classes) {
                        existingClass = classes.find(cls => {
                            return cls.apexClass === name;
                        });
                    }
                    else {
                        classes = [];
                        json['Profile']['classAccesses'] = classes;
                    }
                    if (existingClass) {
                        if (rename) {
                            existingClass.apexClass = rename;
                        }
                        existingClass.enabled = (enabled) ? 'true' : 'false';
                    }
                    break;
                case 'field':
                    let fields = json['Profile']['fieldPermissions'];
                    if (fields && !Array.isArray(fields)) {
                        fields = [fields];
                        json['Profile']['fieldPermissions'] = fields;
                    }
                    let existingField;
                    if (fields) {
                        existingField = fields.find(cls => {
                            return cls.field === name;
                        });
                    }
                    else {
                        fields = [];
                        json['Profile']['fieldPermissions'] = fields;
                    }
                    if (existingField) {
                        if (rename) {
                            existingField.field = rename;
                        }
                        if (permissions) {
                            existingField.editable = (permissions.indexOf('e') !== -1) ? 'true' : 'false';
                            existingField.readable = (permissions.indexOf('r') !== -1) ? 'true' : 'false';
                        }
                    }
                    break;
                case 'object':
                    let objects = json['Profile']['objectPermissions'];
                    if (objects && !Array.isArray(objects)) {
                        objects = [objects];
                        json['Profile']['objectPermissions'] = objects;
                    }
                    let existingObject;
                    if (objects) {
                        existingObject = objects.find(cls => {
                            return cls.object === name;
                        });
                    }
                    else {
                        objects = [];
                        json['Profile']['objectPermissions'] = objects;
                    }
                    if (existingObject) {
                        if (rename) {
                            existingObject.object = rename;
                        }
                        if (permissions) {
                            existingObject.allowRead = (permissions.indexOf('r') !== -1) ? 'true' : 'false';
                            existingObject.allowCreate = (permissions.indexOf('c') !== -1) ? 'true' : 'false';
                            existingObject.allowDelete = (permissions.indexOf('d') !== -1) ? 'true' : 'false';
                            existingObject.allowEdit = (permissions.indexOf('e') !== -1) ? 'true' : 'false';
                            existingObject.modifyAllRecords = (permissions.indexOf('m') !== -1) ? 'true' : 'false';
                            existingObject.viewAllRecords = (permissions.indexOf('v') !== -1) ? 'true' : 'false';
                        }
                    }
                    break;
                case 'page':
                    let pages = json['Profile']['pageAccesses'];
                    if (pages && !Array.isArray(pages)) {
                        pages = [pages];
                        json['Profile']['pageAccesses'] = pages;
                    }
                    let existingPage;
                    if (pages) {
                        existingPage = pages.find(cls => {
                            return cls.apexPage === name;
                        });
                    }
                    else {
                        pages = [];
                        json['Profile']['pageAccesses'] = pages;
                    }
                    if (existingPage) {
                        if (rename) {
                            existingPage.apexPage = rename;
                        }
                        existingPage.enabled = (enabled) ? 'true' : 'false';
                    }
                    break;
            }
            yield fs.writeFile(fileName, util_1.formatMetadata(json, alphabetize), 'utf-8');
            filesModified.push(fileName);
        }
    }
    return filesModified;
});
exports.editInProfiles = editInProfiles;
//# sourceMappingURL=edit.js.map