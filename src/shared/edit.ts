import fs = require('fs-extra');
import format from 'xml-formatter';
import * as parser from 'xml2json';

const editInProfiles = async (directory: string, profiles: string[], name: string, rename: string, enabled: boolean, permissions: string, type: string) => {
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
          let existingClass;
          if (classes) {
            existingClass = classes.find(cls => {
              return cls.apexClass.$t === name;
            });
          } else {
            classes = [];
            json['Profile']['classAccesses'] = classes;
          }
          if (existingClass) {
            if (rename) {
              existingClass.apexClass.$t = rename;
            }
            existingClass.enabled.$t = enabled;
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
              return cls.field.$t === name;
            });
          } else {
            fields = [];
            json['Profile']['fieldPermissions'] = fields;
          }
          if (existingField) {
            if (rename) {
              existingField.field.$t = rename;
            }
            existingField.editable.$t = (!permissions || permissions.indexOf('e') !== -1);
            existingField.readable.$t = (!permissions || permissions.indexOf('r') !== -1);
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
              return cls.object.$t === name;
            });
          } else {
            objects = [];
            json['Profile']['objectPermissions'] = objects;
          }
          if (existingObject) {
            if (rename) {
              existingObject.object.$t = rename;
            }
            existingObject.allowCreate.$t = (!permissions || permissions.indexOf('c') !== -1);
            existingObject.allowDelete.$t = (!permissions || permissions.indexOf('d') !== -1);
            existingObject.allowEdit.$t = (!permissions || permissions.indexOf('e') !== -1);
            existingObject.modifyAllRecords.$t = (!permissions || permissions.indexOf('m') !== -1);
            existingObject.viewAllRecords.$t = (!permissions || permissions.indexOf('v') !== -1);
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
              return cls.apexPage.$t === name;
            });
          } else {
            pages = [];
            json['Profile']['pageAccesses'] = pages;
          }
          if (existingPage) {
            if (rename) {
              existingPage.apexPage.$t = rename;
            }
            existingPage.enabled.$t = enabled;
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

      return profiles;
    }
  }
};

export { editInProfiles };
