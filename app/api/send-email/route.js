import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email, ticketNumber, propertyName, category, urgency, description } = await req.json();

    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Deluxe Stays Maintenance" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Maintenance Issue Confirmation - ${ticketNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">Maintenance Request Received</h2>
          <p>Thank you for reporting a maintenance issue for <strong>${propertyName}</strong>.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">Ticket Reference</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #2563eb;">${ticketNumber}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Category</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">Urgency</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${urgency}</td>
            </tr>
          </table>

          <div style="margin-top: 20px;">
            <p style="color: #64748b; margin-bottom: 5px;">Description:</p>
            <p style="font-style: italic; color: #1e293b; background: #fffbe6; padding: 10px; border-radius: 4px;">${description}</p>
          </div>

          <p style="margin-top: 30px; font-size: 14px; color: #94a3b8;">
            Our maintenance team will review your request and get back to you shortly.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Real email sent to ${email} for ticket ${ticketNumber}`);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Email failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
