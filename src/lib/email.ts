import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Inkbloom" <noreply@inkbloom.art>',
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

// Email Templates
export function getPasswordResetTemplate(resetUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Nunito', sans-serif; background: #F0EBE3; color: #2D2D2D; margin: 0; padding: 20px; }
          .container { max-width: 480px; margin: 0 auto; background: white; padding: 40px; border: 1.5px solid #2D2D2D; }
          .logo { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 30px; }
          .logo span { color: #C17B5C; }
          h1 { font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 16px; }
          p { font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
          .btn { display: inline-block; background: #2D2D2D; color: #F0EBE3; padding: 12px 28px; text-decoration: none; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; border: 1.5px solid #2D2D2D; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #2D2D2D; font-size: 11px; color: #2D2D2D; opacity: 0.5; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Inkb<span>loom</span></div>
          <h1>Reset Your Password</h1>
          <p>We received a request to reset your password. Click the button below to set a new password. This link will expire in 1 hour.</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </p>
          <p>If you didn't request this, you can safely ignore this email. Your password won't change.</p>
          <div class="footer">
            <p>&copy; 2026 Inkbloom. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getOrderConfirmationTemplate(order: {
  id: string;
  items: { title: string; price: number; quantity: number }[];
  total: number;
  address: string;
}) {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${item.title}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
        </tr>`
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Nunito', sans-serif; background: #F0EBE3; color: #2D2D2D; margin: 0; padding: 20px; }
          .container { max-width: 480px; margin: 0 auto; background: white; padding: 40px; border: 1.5px solid #2D2D2D; }
          .logo { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 30px; }
          .logo span { color: #C17B5C; }
          h1 { font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 8px; }
          .order-id { font-size: 12px; color: #C17B5C; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { text-align: left; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 10px 0; border-bottom: 2px solid #2D2D2D; }
          .total { font-weight: 700; font-size: 16px; }
          .address { background: #F0EBE3; padding: 15px; margin-top: 20px; font-size: 13px; line-height: 1.6; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #2D2D2D; font-size: 11px; color: #2D2D2D; opacity: 0.5; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Inkb<span>loom</span></div>
          <h1>Order Confirmed ✓</h1>
          <p class="order-id">Order #${order.id}</p>
          <p>Thank you for your order! We're preparing your artwork with care.</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <table>
            <tr>
              <td class="total">Total</td>
              <td></td>
              <td class="total" style="text-align: right;">₹${order.total}</td>
            </tr>
          </table>
          <div class="address">
            <strong>Shipping to:</strong><br/>
            ${order.address}
          </div>
          <div class="footer">
            <p>&copy; 2026 Inkbloom. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getOrderStatusUpdateTemplate(order: {
  orderId: string;
  status: string;
  items: { title: string; price: number; quantity: number }[];
  total: number;
}) {
  const statusMessages: Record<string, string> = {
    IN_PROGRESS: "Your order is now being prepared with care. We'll notify you when it ships!",
    SHIPPED: "Great news! Your order has been shipped and is on its way to you.",
    DELIVERED: "Your order has been delivered. We hope you love your new artwork!",
    CANCELLED: "Your order has been cancelled. Please contact us if you have any questions.",
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Nunito', sans-serif; background: #F0EBE3; color: #2D2D2D; margin: 0; padding: 20px; }
          .container { max-width: 480px; margin: 0 auto; background: white; padding: 40px; border: 1.5px solid #2D2D2D; }
          .logo { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; text-align: center; margin-bottom: 30px; }
          .logo span { color: #C17B5C; }
          h1 { font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 8px; }
          .order-id { font-size: 12px; color: #C17B5C; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 20px; }
          p { font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #2D2D2D; font-size: 11px; color: #2D2D2D; opacity: 0.5; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Inkb<span>loom</span></div>
          <h1>Order Status Update</h1>
          <p class="order-id">Order #${order.orderId}</p>
          <p>${statusMessages[order.status] || "Your order status has been updated."}</p>
          <div class="footer">
            <p>&copy; 2026 Inkbloom. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const html = getPasswordResetTemplate(resetUrl);
  return sendEmail({
    to: email,
    subject: "Reset Your Inkbloom Password",
    html,
    text: `Reset your password: ${resetUrl}`,
  });
}

export async function sendOrderConfirmationEmail(
  email: string,
  order: Parameters<typeof getOrderConfirmationTemplate>[0]
) {
  const html = getOrderConfirmationTemplate(order);
  return sendEmail({
    to: email,
    subject: `Order Confirmed - #${order.id}`,
    html,
    text: `Your order #${order.id} has been confirmed. Total: ₹${order.total}`,
  });
}

export async function sendOrderStatusEmail(
  email: string,
  order: Parameters<typeof getOrderStatusUpdateTemplate>[0]
) {
  const html = getOrderStatusUpdateTemplate(order);
  return sendEmail({
    to: email,
    subject: `Order Update - #${order.orderId}`,
    html,
    text: `Your order #${order.orderId} status has been updated to ${order.status}`,
  });
}
