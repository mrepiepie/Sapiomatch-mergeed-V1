/**
 * Mock Email Service (Resend/SendGrid/Postmark blueprint)
 * Simulates transaction mailings for bookings, registration, and matches.
 */
export async function sendEmail({ to, subject, html, text }) {
  console.log(`================ MOCK EMAIL SENT ================`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  if (text) console.log(`Text:    ${text}`);
  console.log(`HTML Preview: (Length ${html?.length || 0} characters)`);
  console.log(`=================================================`);
  
  // Real implementation blueprint:
  // const res = await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     from: 'Learnova AI <admissions@learnova.ai>',
  //     to: [to],
  //     subject,
  //     html
  //   })
  // });
  // return res.ok;
  
  return { success: true, messageId: `msg_${Math.random().toString(36).substr(2, 9)}` };
}
