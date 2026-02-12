/**
 * Seed script: populates the database with representative groups and guests
 * in various RSVP states for development/testing.
 *
 * Usage: npx tsx src/seed.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Group from './models/Group.js';
import Guest from './models/Guest.js';

dotenv.config();

const ALL_EVENTS = ['welcome', 'haldi', 'mehndi', 'baraat', 'wedding', 'cocktail', 'reception'] as const;

async function seed() {
  const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER, MONGODB_URI } = process.env;

  let uri: string;
  if (MONGO_USERNAME && MONGO_PASSWORD && MONGO_CLUSTER) {
    uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}`;
  } else if (MONGODB_URI) {
    uri = MONGODB_URI;
  } else {
    throw new Error('MongoDB credentials not found');
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected.');

  // Clear existing data
  await Guest.deleteMany({});
  await Group.deleteMany({});
  console.log('Cleared existing guests and groups.');

  // ─── Group 1: Fully confirmed family ───────────────────────────
  const smithFamily = await Group.create({ name: 'Smith Family' });
  await Guest.create([
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      groupId: smithFamily._id,
      rsvpStatus: 'confirmed',
      rsvpDate: new Date('2027-01-15'),
      events: [...ALL_EVENTS],
      dietaryRestrictions: '',
      allowedPlusOne: false,
      hasBooked: true,
      songRequest: 'September - Earth, Wind & Fire',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      groupId: smithFamily._id,
      rsvpStatus: 'confirmed',
      rsvpDate: new Date('2027-01-15'),
      events: [...ALL_EVENTS],
      dietaryRestrictions: 'Vegetarian',
      allowedPlusOne: false,
      hasBooked: true,
      songRequest: '',
    },
    {
      firstName: 'Emily',
      lastName: 'Smith',
      email: 'emily.smith@example.com',
      groupId: smithFamily._id,
      rsvpStatus: 'confirmed',
      rsvpDate: new Date('2027-01-15'),
      events: ['wedding', 'cocktail', 'reception'],
      dietaryRestrictions: 'Gluten free',
      allowedPlusOne: true,
      plusOne: { name: 'Alex Rivera', dietaryRestrictions: '' },
      songRequest: 'Levitating - Dua Lipa',
    },
  ]);

  // ─── Group 2: Fully declined couple ────────────────────────────
  const nguyenFamily = await Group.create({ name: 'Nguyen Family' });
  await Guest.create([
    {
      firstName: 'David',
      lastName: 'Nguyen',
      email: 'david.nguyen@example.com',
      groupId: nguyenFamily._id,
      rsvpStatus: 'declined',
      rsvpDate: new Date('2027-02-01'),
      events: [],
      allowedPlusOne: false,
    },
    {
      firstName: 'Lisa',
      lastName: 'Nguyen',
      email: 'lisa.nguyen@example.com',
      groupId: nguyenFamily._id,
      rsvpStatus: 'declined',
      rsvpDate: new Date('2027-02-01'),
      events: [],
      allowedPlusOne: false,
    },
  ]);

  // ─── Group 3: Mixed status (partial RSVP) ─────────────────────
  const patelGroup = await Group.create({ name: 'Patel Group' });
  await Guest.create([
    {
      firstName: 'Raj',
      lastName: 'Patel',
      email: 'raj.patel@example.com',
      groupId: patelGroup._id,
      rsvpStatus: 'confirmed',
      rsvpDate: new Date('2027-01-20'),
      events: ['welcome', 'haldi', 'baraat', 'wedding', 'reception'],
      dietaryRestrictions: '',
      allowedPlusOne: true,
      hasBooked: true,
      plusOne: { name: 'Priya Sharma', dietaryRestrictions: 'No shellfish' },
      songRequest: 'Chaiyya Chaiyya',
    },
    {
      firstName: 'Anita',
      lastName: 'Patel',
      email: 'anita.patel@example.com',
      groupId: patelGroup._id,
      rsvpStatus: 'maybe',
      rsvpDate: new Date('2027-01-20'),
      events: ['wedding', 'reception'],
      dietaryRestrictions: 'Vegan',
      allowedPlusOne: false,
      songRequest: '',
    },
    {
      firstName: 'Vikram',
      lastName: 'Patel',
      email: 'vikram.patel@example.com',
      groupId: patelGroup._id,
      rsvpStatus: 'pending',
      events: [],
      allowedPlusOne: false,
    },
  ]);

  // ─── Group 4: Solo guest, pending ─────────────────────────────
  const soloMike = await Group.create({ name: '' });
  await Guest.create({
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    groupId: soloMike._id,
    rsvpStatus: 'pending',
    events: [],
    allowedPlusOne: true,
  });

  // ─── Group 5: Solo guest, confirmed with plus one ─────────────
  const soloSarah = await Group.create({ name: '' });
  await Guest.create({
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@example.com',
    groupId: soloSarah._id,
    rsvpStatus: 'confirmed',
    rsvpDate: new Date('2027-02-10'),
    events: ['welcome', 'wedding', 'cocktail', 'reception'],
    dietaryRestrictions: 'Nut allergy',
    allowedPlusOne: true,
    hasBooked: true,
    plusOne: { name: 'Tom Williams', dietaryRestrictions: '' },
    songRequest: "Don't Stop Me Now - Queen",
  });

  // ─── Group 6: Solo guest, confirmed coming alone ──────────────
  const soloAlex = await Group.create({ name: '' });
  await Guest.create({
    firstName: 'Alex',
    lastName: 'Kim',
    email: 'alex.kim@example.com',
    groupId: soloAlex._id,
    rsvpStatus: 'confirmed',
    rsvpDate: new Date('2027-01-25'),
    events: [...ALL_EVENTS],
    dietaryRestrictions: '',
    allowedPlusOne: true,
    plusOne: null,
    songRequest: 'Uptown Funk - Bruno Mars',
  });

  // ─── Group 7: Couple, one confirmed one declined ──────────────
  const brownFamily = await Group.create({ name: 'Brown Family' });
  await Guest.create([
    {
      firstName: 'Chris',
      lastName: 'Brown',
      email: 'chris.brown@example.com',
      groupId: brownFamily._id,
      rsvpStatus: 'confirmed',
      rsvpDate: new Date('2027-02-05'),
      events: ['welcome', 'baraat', 'wedding', 'cocktail', 'reception'],
      dietaryRestrictions: 'Halal',
      allowedPlusOne: false,
      hasBooked: true,
      songRequest: '',
    },
    {
      firstName: 'Dana',
      lastName: 'Brown',
      email: 'dana.brown@example.com',
      groupId: brownFamily._id,
      rsvpStatus: 'declined',
      rsvpDate: new Date('2027-02-05'),
      events: [],
      allowedPlusOne: false,
    },
  ]);

  // ─── Group 8: Large party, all pending ────────────────────────
  const garciaCrew = await Group.create({ name: 'Garcia Crew' });
  await Guest.create([
    {
      firstName: 'Carlos',
      lastName: 'Garcia',
      email: 'carlos.garcia@example.com',
      groupId: garciaCrew._id,
      rsvpStatus: 'pending',
      events: [],
      allowedPlusOne: true,
    },
    {
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@example.com',
      groupId: garciaCrew._id,
      rsvpStatus: 'pending',
      events: [],
      allowedPlusOne: false,
    },
    {
      firstName: 'Sofia',
      lastName: 'Garcia',
      email: 'sofia.garcia@example.com',
      groupId: garciaCrew._id,
      rsvpStatus: 'pending',
      events: [],
      allowedPlusOne: false,
    },
    {
      firstName: 'Marco',
      lastName: 'Garcia',
      email: 'marco.garcia@example.com',
      groupId: garciaCrew._id,
      rsvpStatus: 'pending',
      events: [],
      allowedPlusOne: true,
    },
  ]);

  // ─── Group 9: Couple, both maybe ─────────────────────────────
  const taylorCouple = await Group.create({ name: 'Taylor Couple' });
  await Guest.create([
    {
      firstName: 'Jordan',
      lastName: 'Taylor',
      email: 'jordan.taylor@example.com',
      groupId: taylorCouple._id,
      rsvpStatus: 'maybe',
      rsvpDate: new Date('2027-02-08'),
      events: ['wedding', 'reception'],
      dietaryRestrictions: 'Pescatarian',
      allowedPlusOne: false,
      hasBooked: true,
      songRequest: 'Shake It Off - Taylor Swift',
    },
    {
      firstName: 'Morgan',
      lastName: 'Taylor',
      email: 'morgan.taylor@example.com',
      groupId: taylorCouple._id,
      rsvpStatus: 'maybe',
      rsvpDate: new Date('2027-02-08'),
      events: ['wedding', 'reception'],
      dietaryRestrictions: '',
      allowedPlusOne: false,
    },
  ]);

  // ─── Group 10: Solo guest, dietary restrictions, no plus one ──
  const soloPreeti = await Group.create({ name: '' });
  await Guest.create({
    firstName: 'Preeti',
    lastName: 'Kapoor',
    email: 'preeti.kapoor@example.com',
    groupId: soloPreeti._id,
    rsvpStatus: 'confirmed',
    rsvpDate: new Date('2027-01-18'),
    events: ['welcome', 'haldi', 'mehndi', 'baraat', 'wedding', 'cocktail', 'reception'],
    dietaryRestrictions: 'Strictly vegetarian, no eggs',
    allowedPlusOne: false,
    hasBooked: true,
    songRequest: 'Jai Ho',
  });

  // Summary
  const totalGroups = await Group.countDocuments();
  const totalGuests = await Guest.countDocuments();
  const confirmed = await Guest.countDocuments({ rsvpStatus: 'confirmed' });
  const maybe = await Guest.countDocuments({ rsvpStatus: 'maybe' });
  const declined = await Guest.countDocuments({ rsvpStatus: 'declined' });
  const pending = await Guest.countDocuments({ rsvpStatus: 'pending' });
  const hasBooked = await Guest.countDocuments({ hasBooked: true });

  console.log('\n=== Seed complete ===');
  console.log(`Groups:    ${totalGroups}`);
  console.log(`Guests:    ${totalGuests}`);
  console.log(`Confirmed: ${confirmed}`);
  console.log(`Maybe:     ${maybe}`);
  console.log(`Declined:  ${declined}`);
  console.log(`Pending:   ${pending}`);
  console.log(`Has booked: ${hasBooked}`);

  await mongoose.disconnect();
  console.log('Disconnected. Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
