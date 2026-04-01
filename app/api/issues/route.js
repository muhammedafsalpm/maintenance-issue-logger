import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { validateIssue } from '@/lib/validation';

function generateTicketNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `MNT-${year}${month}${day}-${random}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const property = searchParams.get('property');
    const urgency = searchParams.get('urgency');
    
    let query = supabase
      .from('maintenance_issues')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (property && property !== '') {
      query = query.eq('property_name', property);
    }
    if (urgency && urgency !== '') {
      query = query.eq('urgency', urgency);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const validationErrors = validateIssue(body);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      );
    }
    
    const ticketNumber = generateTicketNumber();
    
    const { data, error } = await supabase
      .from('maintenance_issues')
      .insert([
        {
          ticket_number: ticketNumber,
          property_name: body.propertyName,
          category: body.category,
          urgency: body.urgency,
          description: body.description,
          photo_url: body.photoUrl || null,
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      success: true,
      data: {
        ticketNumber,
        ...body,
      }
    });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
