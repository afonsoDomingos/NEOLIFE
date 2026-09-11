import mongoose from 'mongoose';

// Node.js DNS resolution fix for local development environments
if (process.env.NODE_ENV === 'development' && typeof process !== 'undefined') {
  try {
    const dns = require('dns');
    if (typeof dns.getServers === 'function' && typeof dns.setServers === 'function') {
      const currentServers = dns.getServers();
      dns.setServers(['8.8.8.8', '1.1.1.1', ...currentServers]);
    }
  } catch {
    // Ignore in environments where custom DNS is restricted
  }
}

const MONGODB_URI = process.env.MONGODB_URI || '';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI não está configurada.');
    throw new Error('MONGODB_URI não configurada.');
  }

  if (cached.conn && cached.conn.connection?.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 20000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export { connectDB, connectDB as connectToDatabase };
export default connectDB;