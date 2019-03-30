// @ts-check
import mongodb from 'mongodb';
require('dotenv').config();

const MongoClient = mongodb.MongoClient;


export class Connection {
    /**
     * @returns {Promise<mongodb.Db>}
     */
    static connectToMongo() {
        if (this.db) return Promise.resolve(this.db);
        return new Promise(resolve => {
            MongoClient.connect(this.url, this.options)
                .then(db => {
                    console.log('Connected to MongoDB');
                    this.db = db.db('skypechat');
                    resolve(this.db);
                });
        });
    }
}

Connection.db = null;
Connection.url = process.env.DB_URL;
Connection.options = {
    bufferMaxEntries: 0,
    reconnectTries: 5000,
    useNewUrlParser: true
};
