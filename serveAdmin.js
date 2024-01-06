const { readDB } = require("./MongoOperations.js")

module.exports = (app) => {
    
    app.get("/getTargets", (req, res) => {
        readDB("Main", "Users", {})
            .then((result) => {
                res.json(result)
            })
            .catch((error) => {
                res.json(error)
            })
    })
}