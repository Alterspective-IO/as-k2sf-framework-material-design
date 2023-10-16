import * as fs from "fs";
import * as path from "path";
import chokidar from "chokidar";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  ContainerClient,
  BlockBlobClient,
  BlobUploadCommonResponse,
} from "@azure/storage-blob";
import archiver from "archiver";

// Azure Storage account and container information
const accountName = "asscripts";
const containerName = "scripts/dev";
const sharedKey =
  "KLn5W60MFY/hzs7cBJIERV/ECf3zKBq2UpHdpdqjPn3hVHbCuE79Iu2idPPphuwutWN+eT/ZrPyQQtTPAhrYJw==";

// Local directory containing the files to upload
const localDirectory =
  "/Users/igor/Documents/GitHub/as-k2sf-framework-material-design/dist";

function createZip() {
  console.log("Creating the ZIP...")
  const zipFilePath = localDirectory + "/output.zip"; // Replace with the desired output zip file path

  //Delete the zipFile if it exists
  if (fs.existsSync(zipFilePath)) {
    fs.unlinkSync(zipFilePath);
  }

  const outputZip = fs.createWriteStream(zipFilePath);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Compression level (0-9)
  });
  const output = fs.createWriteStream(zipFilePath);

  // Pipe the archive data to the output stream
  archive.pipe(output);

  // Add files from the folder to the archive
  archive.directory(localDirectory, false); // The second argument indicates whether to include the root folder

  // Finalize the archive
  archive.finalize();

  // Listen for the 'close' event to know when the archive has been created
  output.on("close", () => {
    console.log(`Archive has been created: ${archive.pointer()} total bytes`);
  });
}
// Create a StorageSharedKeyCredential
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  sharedKey
);

// Create a BlobServiceClient
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// Get a ContainerClient
const containerClient: ContainerClient =
  blobServiceClient.getContainerClient(containerName);

// Variable to store the current upload promise
// let currentUploadPromise: Promise<void> | null = null;

type TUploadPromise = {
  error: any | undefined;
  filePath: string;
  fileName: string;
  promise: Promise<BlobUploadCommonResponse> | null;
  status?: "pending" | "uploading" | "cancelled" | "completed" | "error";
  size?: string;
  counter: number;
  start: Date;
  end: Date | undefined;
  duration: () => number | undefined;
  waitingFor: TUploadPromise | undefined;
};

let uploadPromises: Array<TUploadPromise> = [];

// Function to convert bytes to megabytes
function bytesToMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(2); // Convert to MB and round to 2 decimal places
}

// Function to upload a file to Azure Blob Storage
async function uploadFile(filePath: string) {
  try {
    // let newUploadPromise :TUploadPromise =
    // {
    //   filePath: filePath,
    //   promise: null,
    //   status: 'pending'
    // }

    // console.log("uploadPromises", uploadPromises);

    let allOthers = uploadPromises.filter((item) => item.filePath === filePath);

    let otherPending = uploadPromises.filter(
      (item) => item.filePath === filePath && item.status === "pending"
    );

    let otherUploading = uploadPromises.filter(
      (item) => item.filePath === filePath && item.status === "uploading"
    );

    //if there is an existing upload promise, cancel it
    otherPending.forEach((item) => {
      console.log("Cancelling previous upload");
      item.status = "cancelled";
      // item.promise = null;
    });

    // Create a new upload promise
    let newUploadPromise: TUploadPromise = {
      fileName: filePath.split("/").pop() || "",
      filePath: filePath,
      promise: null,
      status: "pending",
      size: "",
      counter: allOthers.length + 1,
      start: new Date(),
      end: undefined,
      duration: () => {
        let endDateToUser = newUploadPromise.end || new Date();
        if (newUploadPromise.status === "cancelled") {
          return 0;
        }
        return endDateToUser.getTime() - newUploadPromise.start.getTime();
      },
      error: undefined,
      waitingFor: undefined,
    };

    uploadPromises.push(newUploadPromise);

    // Extract the file name from the file path
    const fileName = path.basename(filePath);

    // Get the file size in bytes
    const fileStats = await fs.promises.stat(filePath);
    const fileSizeInBytes = fileStats.size;

    // Convert file size to megabytes
    const fileSizeInMB = bytesToMB(fileSizeInBytes);
    newUploadPromise.size = fileSizeInMB;

    // Create a BlobClient for the file
    const blobClient: BlockBlobClient =
      containerClient.getBlockBlobClient(fileName);

    console.log(`Uploading: ${fileName} (Size: ${fileSizeInMB} MB)`);
    // Upload the file to Azure Blob Storage

    if (otherUploading[0]) {
      console.log("otherUploading adding to queue", otherUploading[0]);
      newUploadPromise.waitingFor = otherUploading[0];
      otherUploading[0].promise?.then((response) => {
        if (newUploadPromise.status === "cancelled") {
          return;
        }
        newUploadPromise.status = "uploading";
        newUploadPromise.promise = blobClient.uploadFile(filePath, {
          blobHTTPHeaders: {
            blobContentType: "application/javascript", // Set the content type here
          },
        });
      });
    } else {
      newUploadPromise.status = "uploading";
      newUploadPromise.promise = blobClient.uploadFile(filePath, {
        blobHTTPHeaders: {
          blobContentType: "application/javascript", // Set the content type here
        },
      });
    }

    newUploadPromise.promise
      ?.then((response) => {
        console.log(`Uploaded: ${fileName} (Size: ${fileSizeInMB} MB)`);
        newUploadPromise.status = "completed";
        newUploadPromise.end = new Date();

        // console.log("uploadPromises", uploadPromises);
      })
      .finally(() => {
        newUploadPromise.status = "completed";
        //remove from the array
        uploadPromises = uploadPromises.filter(
          (item) => item.filePath !== filePath
        );
      })
      .catch((error: any) => {
        console.error("Error uploading file:", error.message);
        newUploadPromise.status = "error";
        newUploadPromise.error = error;
      });
  } catch (error: any) {
    console.error("Error uploading file:", error.message);
  }
}

// function runFilesChanges()
// {

// }

// let debouncedRunFilesChanged = debounce(runFilesChanges,1000)



// Create a chokidar watcher to monitor changes in the local directory
const watcher = chokidar.watch(localDirectory, {
  ignored: /(^|[/\\])\../, // Ignore hidden files
  persistent: true,
});

watcher.on("add", async (filePath) => {
  console.log(`File added: ${filePath}`);

  // If there is a previous upload in progress, cancel it
  // if (currentUploadPromise) {
  //   console.log('Cancelling previous upload');
  //   currentUploadPromise = null;
  // }

  // Cancel all previous uploads

  try {
    // Start a new upload and store the promise
    // runFilesChanges();
    uploadFile(filePath);
  } catch (error: any) {
    console.error("Error during upload:", error.message);
  }
});

watcher.on("change", (filePath) => {
  console.log(`File changed: ${filePath}`);
  // Upload the changed file; the previous upload is already cancelled
  try {
    // runFilesChanges();
    uploadFile(filePath);
  } catch (error: any) {
    console.error("Error during upload:", error.message);
  }
});

// Error handling for the watcher
watcher.on("error", (error) => {
  console.error("Watcher error:", error);
});

setInterval(() => {
  let newData = uploadPromises.map((item) => {
    let newItem = {
      fileName: item.fileName,
      status: item.status,
      size: item.size,
      counter: item.counter,
      duration: item.duration(),
      waitingFor: item.waitingFor?.counter,
    };

    return newItem;
  });

  if (newData.length > 0) {
    console.table(newData);
  }
}, 1000);

console.log(`Watching folder: ${localDirectory}`);
