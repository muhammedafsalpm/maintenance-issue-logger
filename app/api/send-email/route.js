import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, ticketNumber, propertyName, category, urgency, description } = await request.json();
    
    // For demo - log the email (replace with actual email service)
    console.log(`
    📧 EMAIL CONFIRMATION
    ─────────────────────────────────
    To: ${email}
    Subject: Maintenance Issue Confirmation - ${ticketNumber}
    
    Thank you for reporting a maintenance issue.
    
    Ticket Number: ${ticketNumber}
    Property: ${propertyName}
    Category: ${category}
    Urgency: ${urgency}
    Description: ${description}
    
    Status: Open
    We'll update you as the issue progresses.
    ─────────────────────────────────
    `);
    
    return NextResponse.json({ success: true, message: 'Email confirmation sent' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
