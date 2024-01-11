const { readDB, updateDB } = require("./MongoOperations");
const fs = require("fs")
const path = require("path")

async function EnsureEarliestActivity() {
    //read all the target names from the database
    readDB("Main", "Users", {}).then((result) => {
        let targets = result
        //for each target name
        targets.forEach(async (target) => {
            //read all the filenames in the directory and push them in an array
            console.log(target.Name)
            
            if(!fs.existsSync(path.join(__dirname, "uploads", target.Name)))
                fs.mkdirSync(path.join(__dirname, "uploads", target.Name))

            let files = fs.readdirSync(path.join(__dirname, "uploads", target.Name))
            //if the array is not empty, then the first element of the array is the earliest activity, so we update the database with it
            //if the array is empty, then we update the database with null
            //take the first element the filename looks like this - filename = textData.clientName + "_" + (Date.now().toString()) + ".png";
            //so we split the filename by "_" and take the second element
            //then we split the second element by "." and take the first element
            //this gives us the timestamp
            //then we update the database with this timestamp
            // console.log(files)
            let timestamp = null
            if (files.length > 0) {
                timestamp = files[0].split("_")[1].split(".")[0]
            }
            const response = await updateDB("Main", "Users", { Name: target.Name }, { $set: { EarliestActivityStored: new Date(parseInt(timestamp)) } })
            // console.log(response)
        })
    })
}

module.exports = EnsureEarliestActivity