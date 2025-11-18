// pages/api/sponsor-facility.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Configure nodemailer transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, facilityName, location, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !facilityName || !location) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // 1. Send email to carnav@gmail.com
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #C71F37, #a51a2f); color: white; padding: 20px; border-radius: 10px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #C71F37; }
            .footer { text-align: center; margin-top: 20px; color: #666; }
            .sponsored-badge { background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Facility Sponsorship Request</h1>
              <p>You have received a new sponsorship submission</p>
            </div>
            
            <div class="content">
              <div class="field">
                <span class="label">Facility Name:</span>
                <span>${facilityName}</span>
              </div>
              
              <div class="field">
                <span class="label">Location:</span>
                <span>${location}</span>
              </div>
              
              <div class="field">
                <span class="label">Contact Person:</span>
                <span>${name}</span>
              </div>
              
              <div class="field">
                <span class="label">Email:</span>
                <span>${email}</span>
              </div>
              
              <div class="field">
                <span class="label">Phone:</span>
                <span>${phone}</span>
              </div>
              
              <div class="field">
                <span class="label">Additional Message:</span>
                <p>${message || 'No additional message provided.'}</p>
              </div>
              
              <div class="field">
                <span class="label">Submission Time:</span>
                <span>${new Date().toLocaleString()}</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Please review this sponsorship request in the admin panel.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'carnav@gmail.com',
      subject: `New Sponsorship Request: ${facilityName}`,
      html: emailHtml,
    });

    // Send confirmation email to the submitter
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 10px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Sponsorship Request Received</h1>
              <p>Thank you for your interest in sponsoring your facility!</p>
            </div>
            
            <div class="content">
              <p>Dear ${name},</p>
              <p>We have received your sponsorship request for <strong>${facilityName}</strong> located in <strong>${location}</strong>.</p>
              
              <h3>What happens next?</h3>
              <ul>
                <li>Our team will review your request within 24 hours</li>
                <li>We will contact you at ${phone} or ${email} to discuss details</li>
                <li>Once approved, your facility will be featured prominently in search results</li>
              </ul>
              
              <p><strong>Request Summary:</strong></p>
              <ul>
                <li>Facility: ${facilityName}</li>
                <li>Location: ${location}</li>
                <li>Contact: ${name}</li>
                <li>Submitted: ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Sponsorship Request Received: ${facilityName}`,
      html: userEmailHtml,
    });

    res.status(200).json({
      success: true,
      message: 'Sponsorship request submitted successfully. We will contact you within 24 hours.',
    });

  } catch (error) {
    console.error('Sponsorship submission error:', error);
    res.status(500).json({
      error: 'Failed to submit sponsorship request. Please try again.'
    });
  }
}