import {Db, InsertOneWriteOpResult, MongoClient} from 'mongodb';
import assert from 'assert';

import { Fingerprint } from './entities/fingerprint';
import { MONGO_TUNNEL_LOCAL_PORT } from './config';
 
const url = `mongodb://localhost:${MONGO_TUNNEL_LOCAL_PORT}`;
 
const dbName = 'fingerprintComponents';
 
export async function saveFingerprnt(fingerprint: Fingerprint) {
    const collection = await connect(db => db.collection('documents'));
    return new Promise<InsertOneWriteOpResult<Fingerprint>>((resolve, reject) => {
        collection.insertOne(fingerprint, (err, result) => {
            if(err) {
                reject(err);
            }
            resolve(result);
        });
    })
}

export function pingDb() {
    return connect((_, client) => Boolean(client?.isConnected)); 
}

type DbConnectHandler<T> = (db: Db, client?: MongoClient) => T;
function connect<T>(handler: DbConnectHandler<T>) {
    return (new Promise<T>((resolve, reject) => {
        let aliveSession: MongoClient | null = null;
        try {
            // Use connect method to connect to the server
            MongoClient.connect(url, {
                useUnifiedTopology: true,
                connectTimeoutMS: 2000,
                serverSelectionTimeoutMS: 1000
            }, function(err, client) {
                if(err !== null) {
                    return reject(err);
                }
                
                aliveSession = client;
                
                const db = client.db(dbName);
                
                resolve(handler(db, client));
            });
        } catch(error) {
            console.log("Connected successfully to DB server");
            reject(error);
        } finally {
            aliveSession?.close();
        }
    }));
}