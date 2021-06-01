import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const execProm = util.promisify(exec);

const FILE_SUFFIX = '.profile-meta.xml';

const getProfiles = (profiles, basepath) => {
  return profiles.map(profile => {
    if (profile.indexOf('/') !== -1 || profile.indexOf('\\') !== -1) {
      let filePath;
      if (profile.endsWith(FILE_SUFFIX)) {
        filePath = `${basepath}${profile}`;
      } else {
        filePath = `${basepath}${profile}${FILE_SUFFIX}`;
      }
      return filePath;
    }
    return `${profile}${FILE_SUFFIX}`;
  });
};

const readFiles = directories => {
  let files = [];
  for (const directory of directories) {
    if (fs.existsSync(directory)) {
      const filesRead = fs.readdirSync(directory).filter(f => path.extname(f) === '.xml');
      if (filesRead.length) {
        files = [...files, ...filesRead];
      }
    }
  }
  return files;
};

export {
  getProfiles,
  readFiles,
  execProm as exec
};
