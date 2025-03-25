package com.example.demo.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.mail.Message;

@Component
public class SendEmail {
	
	@Value("${app.email.verification.link}")
	private String verificationLink;
	
	@Value("${app.email.user}")
	private String emailUser;
	
	@Value("${app.email.password}")
	private String emailPassword;
	
	private String emailText = "<div style='font-family: system-ui, sans-serif, Arial;"
			+ "font-size: 14px;" + "color: #333;" + "padding: 20px 14px;" + "background-color: #f5f5f5;"
			+ "'>" + "<div style='max-width: 600px; margin: auto; background-color: #fff'>"
			+ "<div style='text-align: center; background-color: #333; padding: 14px'>"
			+ "<a style='text-decoration: none; color: #fff; outline: none' href='https://lukavujasin.xyz/pizzas/' target='_blank'>"
			+ "Luka's Pizzeria" + "</a>" + "</div>" + "<div style='padding: 14px'>"
			+ "<h1 style='font-size: 22px; margin-bottom: 26px'>Registration Verification</h1>" + "<p>"
			+ "Please press the link to verify your account." + "</p>" + "<p>"
			+ "<a href='{{link}}'>{{link}}</a>" + "</p>" + "<p>This link will expire in one hour.</p>"
			+ "<p>" + "If you didn't request this registration, please ignore this email or let us know"
			+ "immediately." + "</p>" + "<p>Best regards,<br />Luka's Pizzeria Team</p>" + "</div>"
			+ "</div>" + "<div style='max-width: 600px; margin: auto'>" + "<p style='color: #999'>"
			+ "The email was sent to {{email}}<br />"
			+ "You received this email because you are registering with Luka's Pizzeria." + "</p>" + "</div>"
			+ "</div>";

	public void sendEmail(String toEmail, String verifiedId) throws MessagingException {

		Properties prop = new Properties();
		prop.put("mail.smtp.host", "smtp.gmail.com");
		prop.put("mail.smtp.port", "465");
		prop.put("mail.smtp.auth", "true");
		prop.put("mail.smtp.socketFactory.port", "465");
		prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		
		System.out.println("the username is " + emailUser);
		
		Session session = Session.getInstance(prop, new jakarta.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(emailUser, emailPassword);
			}
		});

		Message message = new MimeMessage(session);
		message.setFrom(new InternetAddress(emailUser));
		message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
		String temp = emailText.replaceAll("\\{\\{email\\}\\}", toEmail);
		emailText = temp.replaceAll("\\{\\{link\\}\\}", verificationLink + verifiedId);
		message.setSubject("Testing Gmail SSL");
		message.setContent(emailText, "text/html");

		Transport.send(message);
	}
}
