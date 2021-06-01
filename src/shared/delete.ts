import fs = require('fs-extra');
import format from 'xml-formatter';
import * as parser from 'xml2json';

const removeFromProfiles = async (directories: string[], profiles: string[], names: string[], type: string) => {
  const profilesModified = [];
  for (const profile of profiles) {
    let fileNames;
    if (profile.indexOf('/') !== -1 || profile.indexOf('\\') !== -1) {
      fileNames = [`${profile}`];
    } else {
      fileNames = directories.map(directory => `${directory}${profile}`);
    }

    for (const fileName of fileNames) {
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

        const formattedXml = format(xml, {
            indentation: '    ',
            filter: node => node.type !== 'Comment',
            collapseContent: true,
            lineSeparator: '\n'
        });

        await fs.writeFile(fileName, formattedXml, 'utf-8');

        profilesModified.push(profile);
      }
    }
  }
  return profilesModified;
};

export {removeFromProfiles };
