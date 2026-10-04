import Event from './models/Event';
import connectDB from './mongodb';

export async function getActiveEvents() {
  await connectDB();
  return Event.find({ isActive: true }).sort({ date: 1 });
}

export async function getUpcomingEvents() {
  await connectDB();
  const now = new Date();
  return Event.find({ isActive: true, date: { $gte: now } }).sort({ date: 1 });
}

export async function getPastEvents() {
  await connectDB();
  const now = new Date();
  return Event.find({ isActive: true, date: { $lt: now } }).sort({ date: -1 });
}

export async function getNextEvent() {
  await connectDB();
  const now = new Date();
  return Event.findOne({ isActive: true, date: { $gte: now } }).sort({ date: 1 });
}
