const mongoose = require("mongoose")
 mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_USER}`)
    .then(() => {
        console.log("Connection successfully");
    }).catch((error) => {
        console.log("Connection failed");
    });

// console.log(process.env)