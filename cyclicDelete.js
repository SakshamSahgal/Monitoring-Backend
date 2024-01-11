
const path = require("path");
const fs = require("fs");

//this function ensures cyclic deletion of files
//it takes the name of the client as a parameter
//it first checks if there is a folder for the client in the uploads folder
//if there is no folder then it creates one
//then it checks if there are any files in the folder
//if there are files then it checks the oldest file
//if the oldest file is older than the maximum file age then it deletes the oldest file
//if the oldest file is not older than the maximum file age then it does nothing

function cyclicDelete(Name) {
    console.log("cyclicDelete called for " + Name);
    let dir = path.join(__dirname, 'uploads', Name);
    if (fs.existsSync(dir)) {
        let files = fs.readdirSync(dir);
        if (files.length > 0) {
            let oldestFile = files[0];
            let oldestFileDate = oldestFile.split("_")[1].split(".")[0];
            let currentDate = Date.now().toString();
            let timeDifference = currentDate - oldestFileDate;
            console.log("Time difference = " + timeDifference);

            if (timeDifference > parseInt(process.env.MAXIMUM_FILE_AGE)) {
                console.log("Deleting file " + oldestFile);
                fs.unlinkSync(path.join(dir, oldestFile));
                console.log("File deleted");
            }
            else {
                console.log("No need to delete file " + oldestFile);
            }
        }
        else {
            console.log(`No files found in ${Name}, so no need to delete anything`);
        }
    }
    else {
        console.log(`No folder found for ${Name}, creating one`);
        fs.mkdirSync(path.join(__dirname, 'uploads', Name));
    }
}

module.exports = cyclicDelete;