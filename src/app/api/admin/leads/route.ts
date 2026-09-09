import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllLeads, getLeadsByFilters } from '@/lib/db/leads-mongodb';

export async function GET(request: NextRequest) {
  try {
    // Bypass authentication in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      const cookieStore = await cookies();
      const session = cookieStore.get('admin_session');

      if (!session || session.value !== 'authenticated') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const searchParams = request.nextUrl.searchParams;
    
    function getBackupLeads() {
      try {
        const fs = require('fs');
        const path = require('path');
        const backupPath = path.join(process.cwd(), 'leads-backup.json');
        if (fs.existsSync(backupPath)) {
          return JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
        }
      } catch (e) {}
      return [];
    }

    // Check if there are filters
    if (searchParams.has('search') || searchParams.has('country') || 
        searchParams.has('theme') || searchParams.has('status')) {
      const filters: any = {};
      
      if (searchParams.has('search')) filters.search = searchParams.get('search');
      if (searchParams.has('country')) filters.country = searchParams.get('country');
      if (searchParams.has('theme')) filters.theme = searchParams.get('theme');
      if (searchParams.has('status')) filters.status = searchParams.get('status');
      
      const leads = await getLeadsByFilters(filters).catch(() => []);
      const backupLeads = getBackupLeads();
      return NextResponse.json([...backupLeads, ...leads]);
    }
    
    const leads = await getAllLeads().catch(() => []);
    const backupLeads = getBackupLeads();
    return NextResponse.json([...backupLeads, ...leads]);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Error fetching leads' },
      { status: 500 }
    );
  }
}