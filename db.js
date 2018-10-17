//database
const bcrypt = require('bcryptjs');
const mongoist = require('mongoist');
const connectionString = 'mongodb://localhost:27017/mydb';
const connectionOptions = { useNewUrlParser: true };
//this will create the database if it does not exist
const conn = mongoist(connectionString, connectionOptions);

module.exports.conn = conn;

module.exports.init = async function () {
    try {
        //create the collection if it does not exist
        let collectionNames = await conn.getCollectionNames();
        let collectionName = collectionNames.find(q => q == 'datas');
        
        if (!collectionName) {
            let collection = await conn.createCollection('datas');
            //add a record so we have at least one
            await collection.insert({ name: 'data1', value: 'data1value', generatedBy: 'me' });
        }

        collectionName = collectionNames.find(q => q == 'users');
        if (!collectionName) {
            let collection = await conn.createCollection('users');
            let salt = bcrypt.genSaltSync();
            let hash = bcrypt.hashSync('password', salt);
            await collection.insert({ email: 'a@b.co', password: hash });
        }
    } catch (err) {
        console.log(err);
    }
}