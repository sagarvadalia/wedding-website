/**
 * One-time fix: sync Guest collection indexes so the email index is sparse.
 * Run this if you see E11000 duplicate key on email: null when importing guests without email.
 *
 * Usage: from server dir: npm run sync-guest-indexes  or  npx tsx scripts/sync-guest-indexes.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Guest from '../src/models/Guest.js';

dotenv.config();

async function main() {
  const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER, MONGODB_URI } = process.env;

  let uri: string;
  if (MONGO_USERNAME && MONGO_PASSWORD && MONGO_CLUSTER) {
    uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}`;
  } else if (MONGODB_URI) {
    uri = MONGODB_URI;
  } else {
    throw new Error('MongoDB credentials not found. Set MONGO_* or MONGODB_URI.');
  }

  await mongoose.connect(uri);
  try {
    await Guest.syncIndexes();
    console.log('Guest indexes synced. Email index is now sparse (multiple null emails allowed).');
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
