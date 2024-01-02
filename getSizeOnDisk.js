const fs = require('fs');
const path = require('path');
const { hasAccess } = require("./Auth/Middlewares.js")

const os = require('os');

module.exports = (app) => {

    // Get the size of uploads folder in bytes

    function GetUploadsSizeOnDisk() {
        const folderPath = path.join(__dirname, 'uploads');
        //size in bytes
        let size = 0;
        //iterate over each folder in the folderPath
        fs.readdirSync(folderPath).forEach(folder => {
            //iterate over each file in the folder
            fs.readdirSync(path.join(folderPath, folder)).forEach(file => {
                //get the size of the file
                size += fs.statSync(path.join(folderPath, folder, file)).size;
            })
        })

        return size;
    }


    app.get("/getUploadsSizeOnDisk", hasAccess, (req, res) => {
        console.log("Sending uploads size on disk")

        //get the size of the uploads folder
        let uploadSize = GetUploadsSizeOnDisk();
        
        res.json({
            success: true,
            TotalSizeInBytes : os.totalmem(),
            AlreadyFilledSizeinBytes : os.totalmem() - os.freemem() - uploadSize,
            uploadSizeInBytes : uploadSize,
            availableSizeInBytes : os.freemem(),
        })
    })
}



