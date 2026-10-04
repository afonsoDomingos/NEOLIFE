import { NextRequest, NextResponse } from 'next/server';
import Event from '@/lib/db/models/Event';
import connectDB from '@/lib/db/mongodb';

// PUT - Update event
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, date, time, platform, meetingId, passcode, link, isActive } = body;

    await connectDB();
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description,
        date: date ? new Date(date) : undefined,
        time,
        platform,
        meetingId,
        passcode,
        link,
        isActive,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE - Delete event
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
