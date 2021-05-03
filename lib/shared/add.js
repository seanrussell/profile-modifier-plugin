"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToProfiles = void 0;
const tslib_1 = require("tslib");
const fs = require("fs-extra");
const xml_formatter_1 = tslib_1.__importDefault(require("xml-formatter"));
const parser = tslib_1.__importStar(require("xml2json"));
const addToProfiles = async (directory, profiles, names, enabled, permissions, type) => {
    for (const profile of profiles) {
        const fileName = `${directory}${profile}`;
        if (fs.existsSync(fileName)) {
            let json = '{}';
            const data = await fs.readFile(fileName, 'utf-8');
            json = JSON.parse(parser.toJson(data, { reversible: true }));
            switch (type) {
                case 'class':
                    let classes = json['Profile']['classAccesses'];
                    if (classes && !Array.isArray(classes)) {
                        classes = [classes];
                        json['Profile']['classAccesses'] = classes;
                    }
                    for (const name of names) {
                        let existingClass;
                        if (classes) {
                            existingClass = classes.find(cls => {
                                return cls.apexClass.$t === name;
                            });
                        }
                        else {
                            classes = [];
                            json['Profile']['classAccesses'] = classes;
                        }
                        if (!existingClass) {
                            const newClass = {
                                apexClass: {
                                    $t: name
                                },
                                enabled: {
                                    $t: (enabled) ? true : false
                                }
                            };
                            classes.push(newClass);
                        }
                    }
                    classes.sort((a, b) => (a['apexClass']['$t'] > b['apexClass']['$t']) ? 1 : -1);
                    break;
                case 'field':
                    let fields = json['Profile']['fieldPermissions'];
                    if (fields && !Array.isArray(fields)) {
                        fields = [fields];
                        json['Profile']['fieldPermissions'] = fields;
                    }
                    for (const name of names) {
                        let existingField;
                        if (fields) {
                            existingField = fields.find(cls => {
                                return cls.field.$t === name;
                            });
                        }
                        else {
                            fields = [];
                            json['Profile']['fieldPermissions'] = fields;
                        }
                        if (!existingField) {
                            const newField = {
                                editable: {
                                    $t: (!permissions || permissions.indexOf('e') !== -1)
                                },
                                field: {
                                    $t: name
                                },
                                readable: {
                                    $t: (!permissions || permissions.indexOf('r') !== -1)
                                }
                            };
                            fields.push(newField);
                        }
                    }
                    fields.sort((a, b) => (a['field']['$t'] > b['field']['$t']) ? 1 : -1);
                    json['Profile'] = Object.keys(json['Profile']).sort().reduce((obj, key) => {
                        obj[key] = json['Profile'][key];
                        return obj;
                    }, {});
                    break;
                case 'object':
                    let objects = json['Profile']['objectPermissions'];
                    if (objects && !Array.isArray(objects)) {
                        objects = [objects];
                        json['Profile']['objectPermissions'] = objects;
                    }
                    for (const name of names) {
                        let existingObject;
                        if (objects) {
                            existingObject = objects.find(cls => {
                                return cls.object.$t === name;
                            });
                        }
                        else {
                            objects = [];
                            json['Profile']['objectPermissions'] = objects;
                        }
                        if (!existingObject) {
                            const newObject = {
                                allowCreate: {
                                    $t: (!permissions || permissions.indexOf('c') !== -1)
                                },
                                allowDelete: {
                                    $t: (!permissions || permissions.indexOf('d') !== -1)
                                },
                                allowEdit: {
                                    $t: (!permissions || permissions.indexOf('e') !== -1)
                                },
                                allowRead: {
                                    $t: (!permissions || permissions.indexOf('r') !== -1)
                                },
                                modifyAllRecords: {
                                    $t: (!permissions || permissions.indexOf('m') !== -1)
                                },
                                object: {
                                    $t: name
                                },
                                viewAllRecords: {
                                    $t: (!permissions || permissions.indexOf('v') !== -1)
                                }
                            };
                            objects.push(newObject);
                        }
                    }
                    objects.sort((a, b) => (a['object']['$t'] > b['object']['$t']) ? 1 : -1);
                    break;
                case 'page':
                    let pages = json['Profile']['pageAccesses'];
                    if (pages && !Array.isArray(pages)) {
                        pages = [pages];
                        json['Profile']['pageAccesses'] = pages;
                    }
                    for (const name of names) {
                        let existingPage;
                        if (pages) {
                            existingPage = pages.find(cls => {
                                return cls.apexPage.$t === name;
                            });
                        }
                        else {
                            pages = [];
                            json['Profile']['pageAccesses'] = pages;
                        }
                        if (!existingPage) {
                            const newPage = {
                                apexPage: {
                                    $t: name
                                },
                                enabled: {
                                    $t: (enabled) ? true : false
                                }
                            };
                            pages.push(newPage);
                        }
                    }
                    pages.sort((a, b) => (a['apexPage']['$t'] > b['apexPage']['$t']) ? 1 : -1);
                    break;
            }
            const xml = parser.toXml(JSON.stringify(json));
            const formattedXml = xml_formatter_1.default(xml, {
                indentation: '    ',
                filter: node => node.type !== 'Comment',
                collapseContent: true,
                lineSeparator: '\n'
            });
            await fs.writeFile(fileName, formattedXml, 'utf-8');
            return profiles;
        }
    }
};
exports.addToProfiles = addToProfiles;
//# sourceMappingURL=add.js.map