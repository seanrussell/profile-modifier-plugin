import { exec } from 'child_process';
import * as fs from 'fs';
import * as util from 'util';

const execProm = util.promisify(exec);

const FILE_SUFFIX = '.profile-meta.xml';

const getProfiles = profiles => {
  return profiles.map(profile => {
    return `${profile}${FILE_SUFFIX}`;
  });
};

const readFiles = directory => {
  return fs.readdirSync(directory);
};

export {
  getProfiles,
  readFiles,
  execProm as exec
};
