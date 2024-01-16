const { readDB, updateDB } = require("./MongoOperations.js")
const fs = require("fs")
const { hasAccess } = require("./Auth/Middlewares.js")
const path = require("path")
module.exports = (app) => {

    app.get("/getTargets", hasAccess, async (req, res) => {

        readDB("Main", "Users", {})
            .then((result) => {
                res.json({ success: true, targets: result })
            })
            .catch((error) => {
                res.json({ success: false, message: error })
            })
    })

    app.put("/updatePermissions/:targetName/:newPermision", hasAccess, (req, res) => {

        console.log(`Got a request to update permissions of ${req.params.targetName} to ${req.params.newPermision}`)

        readDB("Main", "Users", { Name: req.params.targetName }).then((result) => {
            if (result.length > 0) {
                let newPermission = req.params.newPermision
                let oldPermission = result[0].Allowed
                let UpdateQuery = { $set: { Allowed: newPermission } };
                updateDB("Main", "Users", { Name: req.params.targetName }, UpdateQuery).then((result) => {
                    res.json({ success: true, message: "Permission of " + req.params.targetName + " changed from " + oldPermission + " to " + newPermission + " successfully" })
                }).catch((error) => {
                    res.json({ success: false, message: error })
                })
            }
            else {
                res.json({ success: false, message: "Target doesn't exist" })
            }
        })
    })

    //This route is used to get the activity of a target
    //It first makes sure that admin is logged in using the hasAccess middleware
    //It takes the name of the target as a parameter
    //It then ensures that the directory for the target exists and if it doesn't then it creates it
    //It then reads all the filenames in the directory and pushes them in an array
    //It also calculates the size of the directory
    //It then sends the array as a response

    app.get("/getActivity/:TargetName", hasAccess, (req, res) => {

        let TargetDir = path.join(__dirname, "uploads", req.params.TargetName)
        let HQdir = path.join(TargetDir, "HighQuality");
        let LQdir = path.join(TargetDir, "LowQuality");

        //make sure that the directory exists

        if (!fs.existsSync(TargetDir)) {
            fs.mkdirSync(TargetDir)
        }

        if (!fs.existsSync(HQdir)) {
            fs.mkdirSync(HQdir)
        }

        if (!fs.existsSync(LQdir)) {
            fs.mkdirSync(LQdir)
        }

        //read all the filenames in the directory and push them in an array
        let response = {
            success: true,
            files: [],
            sizeInBytes: 0
        }

        //read all the filenames in the directory and push them in an array
        //also calculate the size of the directory

        fs.readdirSync(HQdir).forEach(file => {
            //just send the file name not the extension
            response.sizeInBytes += fs.statSync(path.join(HQdir, file)).size
            file = file.split(".")[0]
            response.files.push(file)
        })

        //send the array as a response`
        res.json(response)
    })

    app.delete("/deleteImage/:targetName", hasAccess, (req, res) => {
        let DeleteArray = req.body;
        console.log(`Got a request to delete files of : ${req.params.targetName}`)
        //Iterate over the array and delete each file
        DeleteArray.forEach((file) => {
            console.log(file)
            let HQdelDir = path.join(__dirname, "uploads", req.params.targetName, "HighQuality", file + ".png")
            let LQdelDir = path.join(__dirname, "uploads", req.params.targetName, "LowQuality", file + ".jpg")
            if (fs.existsSync(HQdelDir)) {
                fs.unlinkSync(HQdelDir)
            }
            else {
                console.log(`HQ File ${file} doesn't exist`)
            }
            if (fs.existsSync(LQdelDir)) {
                fs.unlinkSync(LQdelDir)
            }
            else {
                console.log(`LQ File ${file} doesn't exist`)
            }
        })

        res.json({
            success: true,
            message: "File deleted successfully"
        })
    })
}