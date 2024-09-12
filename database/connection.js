const mongoose = require('mongoose');
async function connectToDatabase() {
    try {
        main().catch(err => console.log(err));

        async function main() {
        await mongoose.connect('mongodb://127.0.0.1:27017/NextWatch');

            // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
        }
    }
    catch(error)
    {
        console.log(error);
    }
}

module.exports = connectToDatabase;