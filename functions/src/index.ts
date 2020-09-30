// Module Data
import { addModules } from "./modules";
import { addIconModules } from "./iconModules";
import { addMenuPanorama } from "./panoramaModules";

// Archiver
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Usefull tools
import { v4 as uuidv4 } from 'uuid';

// Firebase
import * as functions from 'firebase-functions';
import { Bucket } from "@google-cloud/storage";
import * as admin from 'firebase-admin';
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: "faithfultweaks-bedrock.appspot.com"
});

// Delete all the genrated packs every day (ABOUT MIDNIGHT EST)
exports.deletePacks = functions.pubsub.schedule('0 4 * * *').onRun(async (cxt) => {
    const bucket = admin.storage().bucket(); // Storage bucket

    // Delete everything in FaithfulTweaks/
    bucket.deleteFiles({
        prefix: 'FaithfulTweaks/'
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('All the zip files in FaithfulTweaks/ have been deleted');
        }
    });

});

// Create a zip file from file in storage ----- CLOUD FUNCTION -----
exports.makePack = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', process.env.NODE_ENV !== 'production' ? '*' : 'https://faithfultweaks.com');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Content-Type', 'application/json');

    const bucket: Bucket = admin.storage().bucket(); // Storage bucket
    const tempFilePath = path.join(os.tmpdir(), 'texturepack.zip'); // Zip path

    // Get body data
    const modules: string[] = req.body.modules;
    const iconModules: string[] = req.body.iconModules;
    const panoOption: string = req.body.panoOption;

    // ----- CREATE THE ARCHIVE -----
    const output = fs.createWriteStream(tempFilePath); // create a file to stream archive data to.
    // init zip file
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // Catch warnings
    archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
        console.log("WARNING: "+err);
    } else {
        // throw error
        throw err;
    }
    });

    archive.on('error', (err) => { throw err; }); // Catch errors

    archive.pipe(output); // pipe archive data to the file


    // ----- ADD FILES TO THE ARCHIVE -----
    archive.append(mcManifest, {name: 'manifest.json'}); // add mcmeta file
    archive.append(moduleSelection(modules, iconModules, panoOption), {name: 'modules.txt'}); // add modules.txt file
    archive.append(creditsTxt, {name: 'credits.txt'}); // add credits.txt file
    
    archive.file(path.join('images', 'pack_icon.png'), {name: 'pack_icon.png'});
    
    if (modules !== undefined && modules !== null) {
        await addModules(archive, modules, bucket); // Add modules to the pack
    }

    if (iconModules !== undefined && iconModules !== null) {
        await addIconModules(iconModules, archive, bucket); // Add icon modules to icons.png
    }
    
    if (panoOption !== undefined && panoOption !== null) {
        await addMenuPanorama(panoOption, archive, bucket); // Add menu panorama
    }

    await archive.finalize(); // finalize the archive

    // ----- UPLOAD THE ARCHIVE -----
    const fileUUID = uuidv4();
    const tokenUUID = uuidv4();

    const newPackPath = path.join('FaithfulTweaks', fileUUID + '.mcpack'); // New file upload path

    // Metadata
    const metadata = {
        contentType: 'application/zip',
        metadata: {
            firebaseStorageDownloadTokens: tokenUUID,
        }
    };
    
    // Log and upload when file has been made
    output.on('close', async () => {
        console.log('Archiver has been finalized and the output file descriptor has closed. File size: ' + archive.pointer() + ' bytes');
        
        // Actual upload
        await bucket.upload(tempFilePath, {
            destination: newPackPath,
            metadata: metadata,
        }).then((data) => {
            const file = data[0];
            // Respond with URL
            res.status(200).send({ "url": "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + tokenUUID });
            fs.unlinkSync(tempFilePath); // Unlink file
            return;
        });
    });

    output.on('end', () => { console.log('Data has been drained'); }); // Log when file is drained

    
});

// Make the manifest.json file
const mcManifest = `{
    "format_version": 2,
    "header": {
        "description": "§b§nfaithfultweaks.com",
        "name": "§aFaithful Tweaks",
        "uuid": "${uuidv4()}",
        "version": [0, 0, 1],
        "min_engine_version": [ 1, 14, 0 ]
    },
    "modules": [
        {
            "description": "§aFaithful Tweaks §6- §b§nfaithfultweaks.com",
            "type": "resources",
            "uuid": "${uuidv4()}",
            "version": [0, 0, 1]
        }
    ]
}`;

// Make the modules.txt file
function moduleSelection(modules: string[], iconModules: string[], panoOption: string) {
    // Make string of modules
    let modStr = '';
    if (modules !== undefined && modules !== null) {
        modStr = modStr + '\nPacks:\n';
        modules.forEach((modName) => {
            modStr = modStr + '    '+modName+'\n';
        });
    }

    // Make string of HUD modules
    let hudStr = '';
    if (iconModules !== undefined && iconModules !== null) {
        hudStr = hudStr + '\nHUD Packs:\n';
        iconModules.forEach((hudName) => {
            hudStr = hudStr + '    '+hudName+'\n';
        });
    }

    // Make string with options background
    let panoStr = '';
    if (panoOption !== undefined && panoOption !== null) {
        panoStr = panoStr + '\nPanorama Background:\n';
        panoStr = panoStr + '    '+panoOption+'\n';

    }

    return ('Faithful Tweaks generated pack.\n'+modStr+hudStr+panoStr);
}

// The credits.txt file contents
const creditsTxt = `Credits:
Vanilla Tweaks by Xisumavoid: https://www.xisumavoid.com/vanillatweaks
Faithful Textures by xMrVizzy: https://faithful.team

This pack is a modification of The Faithful 32x pack. 
Modifications are based off of/inspired by the packs by Vanilla tweaks.`