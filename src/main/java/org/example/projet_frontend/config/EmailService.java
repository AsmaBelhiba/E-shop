package org.example.projet_frontend.config;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.projet_frontend.entities.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.mail.password}")
    private String mailPassword;

    public void sendPasswordSetupEmail(String toEmail, String token) {
        // Security Check: Detect placeholder password
        if (mailPassword == null || mailPassword.contains("abcd efgh") || mailPassword.length() < 10) {
            System.err.println("----------------------------------------------------------------");
            System.err.println("⚠️  SMTP CONFIGURATION WARNING:");
            System.err.println("You are still using the placeholder Gmail App Password in your .env file.");
            System.err.println("Registration will succeed, but NO EMAIL will be sent.");
            System.err.println("Please replace 'abcd efgh ijkl mnop' with your real 16-character App Password.");
            System.err.println("----------------------------------------------------------------");
            return; // Skip email sending but don't fail registration
        }

        String link = "http://localhost:5173/set-password?token=" + token;

        String htmlContent = "<div style=\"font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #f8fafc; border-radius: 24px;\">" +
            "  <div style=\"background: white; border-radius: 24px; padding: 48px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);\">" +
            "    <div style=\"text-align: center; margin-bottom: 32px;\">" +
            "      <div style=\"width: 64px; height: 64px; background: #2563eb; border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; transform: rotate(6deg);\">" +
            "        <span style=\"font-size: 28px;\">🛒</span>" +
            "      </div>" +
            "      <h1 style=\"font-size: 28px; font-weight: 900; color: #111827; margin: 0; letter-spacing: -0.5px;\">Welcome to E-Shop</h1>" +
            "      <p style=\"color: #9ca3af; font-size: 14px; margin-top: 8px; font-weight: 600;\">Your account has been created</p>" +
            "    </div>" +
            "    <p style=\"color: #374151; font-size: 15px; line-height: 1.7;\">Hello,</p>" +
            "    <p style=\"color: #374151; font-size: 15px; line-height: 1.7;\">" +
            "      Your account has been successfully registered. To complete your setup, click the button below to create your password." +
            "      This link is valid for <strong>24 hours</strong>." +
            "    </p>" +
            "    <div style=\"text-align: center; margin: 40px 0;\">" +
            "      <a href=\"" + link + "\" style=\"display: inline-block; background: #111827; color: white; padding: 18px 48px; border-radius: 50px; font-weight: 900; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none;\">" +
            "        Set My Password →" +
            "      </a>" +
            "    </div>" +
            "    <p style=\"color: #9ca3af; font-size: 12px; text-align: center; margin-top: 32px; line-height: 1.6;\">" +
            "      If you didn't request this, please ignore this email.<br/>" +
            "      This link will expire in 24 hours for security reasons." +
            "    </p>" +
            "  </div>" +
            "</div>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("E-Shop — Set Up Your Password");
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("----------------------------------------------------------------");
            System.err.println("❌ CRITICAL EMAIL FAILURE:");
            System.err.println("Message: " + e.getMessage());
            System.err.println("The user was created in the database, but the email could not be delivered.");
            System.err.println("Check your .env credentials and Gmail security settings.");
            System.err.println("----------------------------------------------------------------");
        }
    }

    public void sendOrderConfirmationEmail(Order order) {
        if (mailPassword == null || mailPassword.contains("abcd efgh") || mailPassword.length() < 10) {
            System.err.println("----------------------------------------------------------------");
            System.err.println("⚠️  SMTP CONFIGURATION WARNING: Order email skipped due to placeholder credentials.");
            System.err.println("----------------------------------------------------------------");
            return;
        }

        String itemsHtml = order.getItems().stream()
                .map(item -> String.format(
                        "<tr>" +
                        "  <td style=\"padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #374151; font-size: 14px;\">%s x %d</td>" +
                        "  <td style=\"padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #111827; font-size: 14px; font-weight: 600; text-align: right;\">$%.2f</td>" +
                        "</tr>",
                        item.getProduct().getName(), item.getQuantity(), item.getPrice() * item.getQuantity()
                ))
                .reduce("", (a, b) -> a + b);

        String htmlContent = "<div style=\"font-family: 'Outfit', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #f8fafc; border-radius: 24px;\">" +
                "  <div style=\"background: white; border-radius: 24px; padding: 48px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);\">" +
                "    <div style=\"text-align: center; margin-bottom: 32px;\">" +
                "      <div style=\"width: 64px; height: 64px; background: #2563eb; border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; transform: rotate(6deg);\">" +
                "        <span style=\"font-size: 28px;\">🛒</span>" +
                "      </div>" +
                "      <h1 style=\"font-size: 28px; font-weight: 900; color: #111827; margin: 0; letter-spacing: -0.5px;\">Order Confirmed!</h1>" +
                "      <p style=\"color: #9ca3af; font-size: 14px; margin-top: 8px; font-weight: 600;\">Order ID: #" + order.getId() + "</p>" +
                "    </div>" +
                "    <p style=\"color: #374151; font-size: 15px; line-height: 1.7;\">Hello <strong>" + order.getUser().getFullName() + "</strong>,</p>" +
                "    <p style=\"color: #374151; font-size: 15px; line-height: 1.7;\">Your order has been successfully placed and is being prepared for delivery.</p>" +
                "    <div style=\"margin: 32px 0; border-top: 2px solid #f1f5f9; padding-top: 24px;\">" +
                "      <table style=\"width: 100%; border-collapse: collapse;\">" +
                "        " + itemsHtml +
                "        <tr>" +
                "          <td style=\"padding: 24px 0 8px; color: #64748b; font-size: 14px;\">Subtotal</td>" +
                "          <td style=\"padding: 24px 0 8px; color: #111827; font-size: 14px; font-weight: 600; text-align: right;\">$ " + String.format("%.2f", order.getTotalAmount()) + "</td>" +
                "        </tr>" +
                "        <tr>" +
                "          <td style=\"padding: 8px 0; color: #64748b; font-size: 14px;\">Delivery Fees</td>" +
                "          <td style=\"padding: 8px 0; color: #2563eb; font-size: 14px; font-weight: 600; text-align: right;\">" + (order.getDeliveryFees() == 0 ? "FREE" : "$ " + String.format("%.2f", order.getDeliveryFees())) + "</td>" +
                "        </tr>" +
                "        <tr>" +
                "          <td style=\"padding: 16px 0; color: #111827; font-size: 18px; font-weight: 900;\">Total Amount</td>" +
                "          <td style=\"padding: 16px 0; color: #2563eb; font-size: 18px; font-weight: 900; text-align: right;\">$ " + String.format("%.2f", (order.getTotalAmount() + order.getDeliveryFees())) + "</td>" +
                "        </tr>" +
                "      </table>" +
                "    </div>" +
                "    <div style=\"background: #f8fafc; border-radius: 16px; padding: 20px; margin-top: 32px;\">" +
                "      <p style=\"margin: 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;\">Payment Method</p>" +
                "      <p style=\"margin: 4px 0 0; color: #111827; font-size: 15px; font-weight: 700;\">" + order.getPaymentType() + "</p>" +
                "    </div>" +
                "    <p style=\"color: #9ca3af; font-size: 12px; text-align: center; margin-top: 40px; line-height: 1.6;\">" +
                "      Thank you for shopping with us!<br/>" +
                "      If you have any questions, please contact our support team." +
                "    </p>" +
                "  </div>" +
                "</div>";

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(order.getUser().getEmail());
            helper.setSubject("Order Confirmed — #" + order.getId());
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("❌ ERROR SENDING ORDER EMAIL: " + e.getMessage());
        }
    }
}
