import * as fs from 'fs-extra';
import * as path from 'path';
import format from 'xml-formatter';
import * as xml2js from 'xml2js';

const FILE_SUFFIX = '.profile-meta.xml';

const readFiles = directories => {
  const files = [];
  for (const directory of directories) {
    if (fs.existsSync(directory)) {
      const filesRead = fs.readdirSync(directory).filter(f => path.extname(f) === '.xml');
      for (const fileRead of filesRead) {
        files.push(`${directory}${fileRead}`);
      }
    }
  }
  return files;
};

const getFileNames = (directories, profiles, basepath) => {
  if (profiles) {
    const profilePaths = [];
    for (const profile of profiles) {
      if (profile.indexOf('/') !== -1 || profile.indexOf('\\') !== -1) {
        profilePaths.push((profile.endsWith(FILE_SUFFIX)) ? `${basepath}${profile}` : `${basepath}${profile}${FILE_SUFFIX}`);
      } else {
        for (const directory of directories) {
          profilePaths.push((profile.endsWith(FILE_SUFFIX)) ? `${directory}${profile}` : `${directory}${profile}${FILE_SUFFIX}`);
        }
      }
    }
    return profilePaths;
  } else {
   return readFiles(directories);
  }
};

const getObjectFieldFileNames = async (directories) => {
  let fields = [];

  for (const directory of directories) {
    if (fs.existsSync(directory)) {
      const parts = directory.split('/');
      const objName = parts[parts.length - 3];
      const files = fs.readdirSync(directory);
      for (const file of files) {
        const filepath = `${directory}${file}`;

        if (fs.existsSync(filepath)) {
          const json = await getParsed(await fs.readFile(filepath));

          if (json['CustomField']['type'] !== 'MasterDetail' &&
             (!json['CustomField']['required'] || json['CustomField']['required'] !== 'true')) {
            fields.push(`${objName}.${json['CustomField']['fullName']}`);
          }
        }
      }
    }
  }

  return fields;
};

const getDataForDisplay = (filesModified, startPos, action, metadata) => {
  return filesModified.map(file => {
    return {
      Action: action,
      MetadataType: metadata,
      ProjectFile: file.substring(startPos)
    };
  });
};

const formatMetadata = (json, alphabetize: boolean) => {
  console.log('ALPHA: ' + alphabetize);
  if (alphabetize) {
    json['Profile'] = Object.keys(json['Profile']).sort().reduce((obj, key) => {
        obj[key] = json['Profile'][key];
        return obj;
    }, {});
  }

  const builder = new xml2js.Builder({
    headless: true
  });

  const xml = builder.buildObject(json);

  const xmlDoc = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n${xml}`;

  const formattedXml = format(xmlDoc, {
      indentation: '    ',
      filter: node => node.type !== 'Comment',
      collapseContent: true,
      lineSeparator: '\n'
  });

  return formattedXml;
};

// tslint:disable-next-line: no-any
const getParsed = async (xmlToParse, explicitArray = false): Promise<any> => {
  const p = new xml2js.Parser({ explicitArray });

  return new Promise((resolve, reject) => {
      // tslint:disable-next-line: no-any
      p.parseString(xmlToParse, (err, json: any) => {
          if (err) {
              reject(err);
          } else {
              resolve(json);
          }
      });
  });
};

export {
  getFileNames,
  getObjectFieldFileNames,
  getDataForDisplay,
  formatMetadata,
  getParsed
};
