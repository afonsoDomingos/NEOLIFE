import { NextRequest, NextResponse } from 'next/server';
import Event from '@/lib/db/models/Event';
import connectDB from '@/lib/db/mongodb';

// GET - Fetch all events
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ date: -1 });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, date, time, platform, meetingId, passcode, link, isActive } = body;

    if (!title || !description || !date || !time || !link) {
      return NextResponse.json(
        { error: 'title, description, date, time, and link are required' },
        { status: 400 }
      );
    }

    await connectDB();
    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      time,
      platform: platform || 'Zoom',
      meetingId,
      passcode,
      link,
      isActive: isActive !== undefined ? isActive : true,
    });

    await newEvent.save();
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
