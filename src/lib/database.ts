const MongoClient = require('mongodb').MongoClient;
class Database {
    async init() {
        const MONGO_DB = process.env.DATABASE || 'mongodb://localhost:27017/arlye';
        // Opciones de conexión
        const clientOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        const client = await MongoClient.connect(MONGO_DB, clientOptions);
        const db = client.db();

        // Comprobar si la conexión fue exitosa
        if (client) {
            console.log(`STATUS: Online`);
            console.log(`DATABASE: ${db.databaseName}`);
        }
        return db;
    }
}

export default Database;
