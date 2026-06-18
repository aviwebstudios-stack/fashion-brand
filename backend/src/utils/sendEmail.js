import transporter from '../config/email.js';

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Avi Webstudios Fashion" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

// Booking confirmation email
export const sendBookingConfirmation = async ({ name, email, service, date, startTime, endTime, total, bookingId }) => {
  await sendEmail({
    to: email,
    subject: 'Booking Confirmation — Avi Webstudios',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Avi Webstudios</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Booking Confirmed! 🎉</h2>
          <p>Hi ${name},</p>
          <p>Your consultation has been booked successfully. Here are your details:</p>
          <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
            <p><strong>Amount:</strong> ₦${total.toLocaleString()}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
          </div>
          <p>Please arrive 5 minutes early. If you need to reschedule, contact us at least 24 hours before your appointment.</p>
          <p>We look forward to seeing you!</p>
        </div>
        <div style="background: #000; padding: 15px; text-align: center;">
          <p style="color: #fff; margin: 0; font-size: 12px;">© 2026 Avi Webstudios. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

// Order confirmation email
export const sendOrderConfirmation = async ({ name, email, orderId, items, total, deliveryAddress }) => {
  const itemsList = items.map((item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.size || 'N/A'}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">₦${item.price.toLocaleString()}</td>
    </tr>
  `).join('');

  await sendEmail({
    to: email,
    subject: 'Order Confirmation — Avi Webstudios',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Avi Webstudios</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Order Confirmed! 🛍️</h2>
          <p>Hi ${name},</p>
          <p>Thank you for your order. Here's a summary:</p>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <table style="width: 100%; border-collapse: collapse; background: #fff;">
            <thead>
              <tr style="background: #000; color: #fff;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: left;">Qty</th>
                <th style="padding: 10px; text-align: left;">Size</th>
                <th style="padding: 10px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          <div style="background: #fff; padding: 20px; margin-top: 20px; border-radius: 8px;">
            <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
            <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
          </div>
          <p>We will notify you when your order ships.</p>
        </div>
        <div style="background: #000; padding: 15px; text-align: center;">
          <p style="color: #fff; margin: 0; font-size: 12px;">© 2026 Avi Webstudios. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

// Payment confirmation email
export const sendPaymentConfirmation = async ({ name, email, amount, reference, type }) => {
  await sendEmail({
    to: email,
    subject: 'Payment Confirmed — Avi Webstudios',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Avi Webstudios</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Payment Received! ✅</h2>
          <p>Hi ${name},</p>
          <p>We have received your payment. Here are the details:</p>
          <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Amount:</strong> ₦${amount.toLocaleString()}</p>
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Status:</strong> <span style="color: green;">Successful</span></p>
          </div>
          <p>Thank you for your payment!</p>
        </div>
        <div style="background: #000; padding: 15px; text-align: center;">
          <p style="color: #fff; margin: 0; font-size: 12px;">© 2026 Avi Webstudios. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

// Booking reminder email
export const sendBookingReminder = async ({ name, email, service, date, startTime }) => {
  await sendEmail({
    to: email,
    subject: 'Reminder: Your Consultation Tomorrow — Avi Webstudios',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Avi Webstudios</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Reminder: Consultation Tomorrow ⏰</h2>
          <p>Hi ${name},</p>
          <p>This is a reminder that you have a consultation scheduled for tomorrow:</p>
          <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
            <p><strong>Time:</strong> ${startTime}</p>
          </div>
          <p>Please arrive 5 minutes early. See you tomorrow!</p>
        </div>
        <div style="background: #000; padding: 15px; text-align: center;">
          <p style="color: #fff; margin: 0; font-size: 12px;">© 2026 Avi Webstudios. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};