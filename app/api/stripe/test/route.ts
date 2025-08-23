import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('🧪 Test webhook endpoint hit!');
  console.log('Headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    const body = await request.text();
    console.log('Body:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test endpoint working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}
