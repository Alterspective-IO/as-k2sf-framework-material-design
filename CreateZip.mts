import * as fs from "fs";
import archiver from "archiver";
import { DeferredPromise } from "./DefferedPromise.mjs";


export function createZip() {

    let deferred = new DeferredPromise<string>();
    // Local directory containing the files to upload

    //get the current directory
    let currDir = process.cwd();

    //get the local directory
    let localDirectory = currDir + "/dist";
    let zipDirectory = currDir + "/dist_zip";
  

    console.log("Creating the ZIP...")
    const zipFilePath = zipDirectory + "/as_md_framework.zip"; // Replace with the desired output zip file path

    //Delete the zipFile if it exists
    if (fs.existsSync(zipFilePath)) {
        fs.unlinkSync(zipFilePath);
    }

    const archive = archiver("zip", {
        zlib: { level: 9 }, // Compression level (0-9)
    });
    const output = fs.createWriteStream(zipFilePath);

    // Pipe the archive data to the output stream
    archive.pipe(output);


    //loop though all files in the directory and add them to the zip
    let files = fs.readdirSync(localDirectory);
    files.forEach(file => {
        console.log("Adding file to zip: " + file);
        archive.file(localDirectory + "/" + file, { name: file });
    });
    

    // Add files from the folder to the archive
    // archive.file(localDirectory, false); // The second argument indicates whether to include the root folder

    // Finalize the archive
    archive.finalize();

    // Listen for the 'close' event to know when the archive has been created
    output.on("close", () => {
        console.log(`Archive has been created: ${archive.pointer()} total bytes`);
        deferred.resolve(zipFilePath);
    });


    return deferred.promise;


}