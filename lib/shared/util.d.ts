/// <reference types="node" />
import { exec } from 'child_process';
declare const execProm: typeof exec.__promisify__;
declare const getProfiles: (profiles: any) => any;
declare const readFiles: (directory: any) => string[];
export { getProfiles, readFiles, execProm as exec };
