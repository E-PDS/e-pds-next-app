import { MongoClient } from 'mongodb';
import dns from 'dns';

// Fix for querySrv ECONNREFUSED on some networks/Windows setups
if (typeof dns.setServers === 'function') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    console.warn('Failed to set custom DNS servers:', e);
  }
}

const uri = process.env.DB_URI;
const dbName = process.env.DB;

let cached = global._mongo;

if (!cached) {
  cached = global._mongo = { client: null, promise: null };
}

export default async function connectToDatabase() {
  if (cached.client) {
    return cached.client.db(dbName);
  }

  if (!cached.promise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 10000,
    });
    cached.promise = client.connect();
  }

  try {
    cached.client = await cached.promise;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // retry ONCE
    cached.promise = null;

    const retryClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 0,
      maxPoolSize: 5,
    });

    cached.promise = retryClient.connect();
    cached.client = await cached.promise;
  }

  return cached.client.db(dbName);
}
