const fs = require('fs');
const path = require('path');
const { statfs } = require('fs/promises');  // Use fs/promises for promise-based statfs
const { hasAccess } = require("./Auth/Middlewares");

function GetUploadsSizeOnDisk(folderPath) {
    let size = 0;

    //reading the uploads folder
    fs.readdirSync(folderPath).forEach(folder => {

        //reading the target's HighQuality folder
        //folder = targetName
        fs.readdirSync(path.join(folderPath, folder,"HighQuality")).forEach(file => {
            size += fs.statSync(path.join(folderPath, folder,"HighQuality", file)).size;
        });
        //reading the target's LowQuality folder
        //folder = targetName
        fs.readdirSync(path.join(folderPath, folder,"LowQuality")).forEach(file => {
            size += fs.statSync(path.join(folderPath, folder,"LowQuality", file)).size;
        });
    });

    return size;
}

async function getDiskInfo(pathToCheck) {
    try {
        const stats = await statfs(pathToCheck);
        const blockSize = stats.bsize;
        const totalBlocks = stats.blocks;
        const freeBlocks = stats.bfree;
        const availableBlocks = stats.bavail;

        const totalSizeInBytes = blockSize * totalBlocks;
        const alreadyFilledSizeInBytes = blockSize * (totalBlocks - freeBlocks);
        const availableSizeInBytes = blockSize * availableBlocks;

        return {
            TotalSizeInBytes: totalSizeInBytes,
            AlreadyFilledSizeInBytes: alreadyFilledSizeInBytes,
            AvailableSizeInBytes: availableSizeInBytes,
        };
    } catch (err) {
        throw err;
    }
}

module.exports = (app) => {
    // Example usage in your /getUploadsSizeOnDisk endpoint
    app.get("/getUploadsSizeOnDisk", hasAccess, async (req, res) => {
        console.log("Sending uploads size on disk");

        // Additional logic for calculating uploadSize
        const folderPath = path.join(__dirname, 'uploads');
        const uploadSize = GetUploadsSizeOnDisk(folderPath);

        const pathToCheck = '/';  // Adjust the path as needed

        try {
            const diskInfo = await getDiskInfo(pathToCheck);

            res.json({
                success: true,
                TotalSizeInBytes: diskInfo.TotalSizeInBytes,
                AlreadyFilledSizeinBytes: diskInfo.AlreadyFilledSizeInBytes - uploadSize,
                uploadSizeInBytes: uploadSize,
                availableSizeInBytes: diskInfo.AvailableSizeInBytes,
            });
        } catch (err) {
            console.error('Error getting disk information:', err);
            res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    });
};
