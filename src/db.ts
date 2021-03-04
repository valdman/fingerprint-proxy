import {Db, InsertOneWriteOpResult, MongoClient} from 'mongodb';

import {MONGO_HOST, MONGO_PORT, MONGO_LOGIN, MONGO_PASS, MONGO_DB} from './config';
import {FingerprintDto} from './entities/fingerprint';

const CONNECTION_STRING = `mongodb://${MONGO_LOGIN}${MONGO_PASS && `:${MONGO_PASS}`}@${MONGO_HOST}:${MONGO_PORT}${
    MONGO_DB && `/${MONGO_DB}`
}`;

export async function saveFingerprnt(fingerprint: FingerprintDto) {
    const collection = await connect((db) => db.collection<FingerprintDto>('documents'));
    return new Promise<InsertOneWriteOpResult<FingerprintDto>>((resolve, reject) => {
        collection.insertOne(fingerprint, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

export function pingDb() {
    return connect((_, client) => Boolean(client?.isConnected));
}

type DbConnectHandler<T> = (db: Db, client?: MongoClient) => T;
function connect<T>(handler: DbConnectHandler<T>) {
    return new Promise<T>((resolve, reject) => {
        let aliveSession: MongoClient | null = null;
        try {
            // Use connect method to connect to the server
            MongoClient.connect(
                CONNECTION_STRING,
                {
                    useUnifiedTopology: true,
                    connectTimeoutMS: 2000,
                },
                function (err, client) {
                    if (err !== null) {
                        return reject(err);
                    }

                    aliveSession = client;

                    const db = client.db(MONGO_DB);

                    resolve(handler(db, client));
                },
            );
        } catch (error) {
            console.log('Connected successfully to DB server');
            reject(error);
        } finally {
            aliveSession?.close();
        }
    });
}
