import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSubmissionEmail(candidateName: string, interviewTitle: string, applicationId: string, recipients: string[]) {
  // Only send if we have recipients
  if (!recipients || recipients.length === 0) {
    console.warn("No recipients for email notification.");
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'FV HireHub <onboarding@resend.dev>',
      to: recipients,
      subject: `New Interview: ${candidateName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #2563eb;">New Interview Submission 🚀</h1>
          <p><strong>${candidateName}</strong> has just completed the <strong>${interviewTitle}</strong> interview.</p>
          <div style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000'}/admin/applications/${applicationId}" 
               style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
               View Application
            </a>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Sent from FV HireHub via Resend.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Email sending failed:', error);
    } else {
      console.log('Email sent successfully:', data);
    }
  } catch (err) {
    console.error('Error sending email:', err);
  }
}
