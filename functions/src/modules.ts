import { Archiver } from "archiver";
import {Bucket} from '@google-cloud/storage';
import * as path from 'path';

// ----- MODULES -----
const modulesData: Record<string, any> = {
//  ModuleID               : require('./path/to/moduleid.js'),
    TestModule             : '/modules/test/TestModule/',
}

// Figure out which modules to add
export async function addModules(archive: Archiver, modules: string[], bucket: Bucket) {
    // For each module
    const promises = modules.map(async (modName) => {
        // If the module exists
        if (modulesData[modName] !== undefined && modulesData[modName] !== null) {
            // Try to get module path
            const directory = modulesData[modName];
            
            // Make path to files
            const DLPath = path.join('images', directory);

            // List files
            archive.directory(DLPath, false);
        }
    });
    return Promise.all(promises);
}