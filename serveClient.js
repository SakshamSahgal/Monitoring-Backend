const archiver = require('archiver');
const path = require('path');

module.exports = (app) => {
    
    app.get("/downloadData", (req, res) => {     
    
        const folderPath = path.join(__dirname,"..", 'uploads'); // Folder to be zipped
        
        const archive = archiver('zip', {  // Create a zip archive
            zlib: { level: 9 } // Set compression level (0-9)
        });
    
        const zipFileName = 'uploads.zip';      // Set the archive name
        res.attachment(zipFileName);
        archive.pipe(res);                      // Pipe the zip archive to the response stream
        archive.directory(folderPath, false);   // Add files from the folder to the zip archive (false means that the folder itself won't be added to the archive)
        archive.finalize();                     // Finalize the archive and send it to the client
    })

}