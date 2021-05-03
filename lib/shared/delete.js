"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromProfiles = void 0;
const tslib_1 = require("tslib");
const fs = require("fs-extra");
const xml_formatter_1 = tslib_1.__importDefault(require("xml-formatter"));
const parser = tslib_1.__importStar(require("xml2json"));
const removeFromProfiles = async (directory, profiles, names, type) => {
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
                    }
                    if (classes) {
                        for (const name of names) {
                            let idx = -1;
                            for (let i = 0; i < classes.length; i++) {
                                const cls = classes[i];
                                if (cls.apexClass.$t === name) {
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
                                if (cls.field.$t === name) {
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
                                if (cls.object.$t === name) {
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
                                if (cls.apexPage.$t === name) {
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
            const stringified = JSON.stringify(json);
            const xml = parser.toXml(stringified);
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
exports.removeFromProfiles = removeFromProfiles;
//# sourceMappingURL=delete.js.map