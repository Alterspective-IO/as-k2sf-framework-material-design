import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import * as chokidar from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

const account = 'asscripts';
const accountKey = 'KLn5W60MFY/hzs7cBJIERV/ECf3zKBq2UpHdpdqjPn3hVHbCuE79Iu2idPPphuwutWN+eT/ZrPyQQtTPAhrYJw==';
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);

const containerName = 'scripts/dev/assets';
const watchFolder = 'assets/CardBackgrounds';

async function uploadToBlob(filePath: string) {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = path.basename(filePath);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log(`Uploading ${filePath} to Azure Blob Storage...`);

    const uploadStream = fs.createReadStream(filePath);
    await blockBlobClient.uploadStream(uploadStream);

    console.log(`Uploaded ${filePath} successfully.`);
}

const watcher = chokidar.watch(watchFolder, {
    persistent: true,
});

watcher
    .on('add', path => uploadToBlob(path))
    .on('change', path => uploadToBlob(path));

console.log(`Watching ${watchFolder} for file additions or changes...`);
