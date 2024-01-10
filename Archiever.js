// Description: This file contains the code to zip the uploads folder and download it.

const archiver = require('archiver');
const { hasAccess } = require("./Auth/Middlewares.js")
const path = require('path');
const fs = require("fs")

module.exports = (app) => {

    app.get("/downloadAllData", hasAccess, (req, res) => {

        const folderPath = path.join(__dirname, 'uploads');     // Folder to be zipped

        const archive = archiver('zip', {                       // Create a zip archive
            zlib: { level: 9 }                                  // Set compression level (0-9)
        });

        const zipFileName = 'uploads.zip';                      // Set the archive name
        res.attachment(zipFileName);
        archive.pipe(res);                                      // Pipe the zip archive to the response stream
        archive.directory(folderPath, false);                   // Add files from the folder to the zip archive (false means that the folder itself won't be added to the archive)
        archive.finalize();                                     // Finalize the archive and send it to the client
    })


    //this route is used to download a particular Target's folder

    app.get("/downloadData/:Name", hasAccess, (req, res) => {

        console.log(`Archiving ${req.params.Name}'s Activity`)
        
        const folderPath = path.join(__dirname, 'uploads', req.params.Name);     // Folder to be zipped
        if (fs.existsSync(folderPath)) {

            const archive = archiver('zip', {                       // Create a zip archive
                zlib: { level: 9 }                                  // Set compression level (0-9)
            });

            const zipFileName = `${req.params.Name}.zip`;    // Set the archive name
            res.attachment(zipFileName);
            archive.pipe(res);                                      // Pipe the zip archive to the response stream
            archive.directory(folderPath, false);                   // Add files from the folder to the zip archive (false means that the folder itself won't be added to the archive)
            archive.finalize();                                     // Finalize the archive and send it to the client
        }
        else {
            res.json({
                success: false,
                message: "Folder doesn't exist"
            })
        }
    })

}



