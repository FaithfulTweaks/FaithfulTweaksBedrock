import * as path from 'path';
import { Archiver } from 'archiver';
import { Bucket } from '@google-cloud/storage';

const packFilesPath = "modules/panoramas";
const folders: Record<string, string> = {
    ClassicPano: "ClassicPanorama",
    BastionPano: "PiglinBastion",
    EndPano: "TheEnd",
    SeirinsPano: "SeirinsSurvival",
};

export async function addMenuPanorama(moduleName: string, archive: Archiver, bucket: Bucket){
    // If it exists
    if (folders[moduleName] !== undefined && folders[moduleName] !== null) {
        archive.directory(path.join("images", packFilesPath, folders[moduleName]), false);
    }
    return;
};