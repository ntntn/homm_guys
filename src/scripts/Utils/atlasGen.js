const chalk = require('chalk')
const path = require('path');
const fs = require('fs');
const texturePacker = require('free-tex-packer-core');
const { hashElement } = require('folder-hash');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

const DB_PATH = path.join(__dirname, 'ATLAS_DB.json');
let DB;

function generateKeysJSON(images, atlasFolder) {
    const keys = {};

    for (let image of images) {
        const imageName = image.path.split('.')[0];
        keys[imageName] = imageName;
    }

    fs.writeFileSync(path.join(atlasFolder, 'keys.json'), JSON.stringify(keys));
}

function printImportSnippets(atlasFolder) {
    const atlasName = path.basename(atlasFolder);
    const assetString = `\t${atlasName}: { image: '${atlasName}/texture.png', json: '${atlasName}/texture.json' },`
    const importString = `\timport ${atlasName}Keys from '../assets/atlases/${atlasName}/keys.json';`
    const atlasObjectString = `\texport const ${atlasName} = { Key: Atlases.${atlasName}, ...${atlasName}Keys };`

    console.log(assetString);
    console.log('');
    console.log(importString);
    console.log(atlasObjectString);
}

async function CreteAtlas(assetsPath, imagesPath) {
    const atlasName = imagesPath.split('@')[1];

    console.log(chalk.redBright(`=== ${atlasName} - Changed! `.padEnd(47, '=')));
    console.log(chalk.redBright('==============================================='));
    console.log('');

    const files = fs.readdirSync(imagesPath);
    const images = [];

    files.forEach(file => {
        images.push({ path: file, contents: fs.readFileSync(path.join(imagesPath, file)) });
    });

    const items = await texturePacker.packAsync(images, {
        textureName: 'texture',
        allowRotation: false,
        packer: 'OptimalPacker',
        exporter: 'Phaser3',
        prependFolderName: true,
        removeFileExtension: true,
        width: 2048,
        height: 2048,
        detectIdentical: true,
        allowTrim: true,
        padding: 2,
        extrude: 2
    });

    const atlasFolder = path.join(assetsPath, 'atlases', atlasName);

    if (fs.existsSync(atlasFolder)) fs.rmSync(atlasFolder, { recursive: true, force: true });
    fs.mkdirSync(atlasFolder);

    generateKeysJSON(images, atlasFolder);

    for (let item of items) {
        const filePath = path.join(atlasFolder, item.name);

        fs.writeFileSync(filePath, item.buffer);
    }

    printImportSnippets(atlasFolder);

    console.log('');
    console.log(chalk.greenBright('==============================================='));
    console.log(chalk.greenBright(`=== ${atlasName} - Saved! `.padEnd(47, '=')));
}

function initDB() {
    DB = new JsonDB(new Config(DB_PATH, true, true, '/'));
}

function getFolderHashFromDB(folder) {
    try {
        const data = DB.getData(`/${folder}`);
        return data;
    } catch (e) {
        return undefined;
    }
}

function addFolderHashToDB(folder, hash) {
    return DB.push(`/${folder}`, hash);
}

(async() => {
    console.log(chalk.yellowBright('\n==============================================='));
    console.log(chalk.yellowBright('=== AtlasBuilder START ========================'));
    console.log(chalk.yellowBright('==============================================='));

    const projectPath = path.join(__dirname, '..');
    const assetsPath = path.join(projectPath, '../', 'assets/');
    const imagesPath = path.join(assetsPath, 'img');

    initDB();

    const foldersToProcess = [];

    fs.readdirSync(imagesPath).filter(f => f.startsWith('@')).forEach((file) => {
        const filePath = path.join(imagesPath, file);
        const isValidDirectory = fs.lstatSync(filePath).isDirectory();

        if (isValidDirectory) foldersToProcess.push(filePath);
    });

    for (folder of[...foldersToProcess]) {
        const folderName = `@${folder.split('@')[1]}`;
        const atlasFolder = path.join(assetsPath, 'atlases', folder.split('@')[1]);
        const folderData = await hashElement(folder);
        const folderLastHash = getFolderHashFromDB(folderName);

        if (!fs.existsSync(atlasFolder) || folderLastHash === undefined || (folderLastHash !== folderData.hash)) {
            addFolderHashToDB(folderName, folderData.hash);
        } else {
            foldersToProcess.splice(foldersToProcess.indexOf(folder), 1);
        }
    }

    if (foldersToProcess.length === 0) {
        console.log(chalk.greenBright(`Nothing to update!`));
    }

    for (let i = 0; i < foldersToProcess.length; i++) {
        const folder = foldersToProcess[i];
        await CreteAtlas(assetsPath, folder);

        if (i + 1 !== foldersToProcess.length) console.log(chalk.yellowBright('==============================================='));
    }

    console.log(chalk.yellowBright('==============================================='));
    console.log(chalk.yellowBright('=== AtlasBuilder END =========================='));
    console.log(chalk.yellowBright('===============================================\n'));

})();