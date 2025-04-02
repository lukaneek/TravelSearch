package com.example.demo.services;

import java.util.Date;
import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import com.example.demo.dtos.LoggedInUser;
import com.example.demo.exceptions.NotVerifiedException;
import com.example.demo.models.Session;
import com.example.demo.models.User;
import com.example.demo.repositories.SessionRepository;
import com.example.demo.repositories.UserRepository;

import com.example.demo.utils.SendEmail;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private SessionRepository sessionRepo;

	@Autowired
	private SendEmail sendEmail;

	@Transactional(rollbackOn = Exception.class)
	public User register(User newUser) throws MessagingException {
		// Checks to see if an account exists with that email.
		Optional<User> potentialUser = userRepo.findByEmail(newUser.getEmail());
		if (potentialUser.isPresent()) {
			return null;
		}
		// If we got this far, password must be hashed, salted and saved in DB
		String hashedPassword = BCrypt.hashpw(newUser.getPassword(), BCrypt.gensalt());
		newUser.setPassword(hashedPassword);
		User savedUser = userRepo.save(newUser);
		// If anything happens with the sending of the email, the @Transactional
		// annotation will rollback the saving of the new user in the DB
		sendEmail.sendEmail(savedUser.getEmail(), savedUser.getVerifyId());
		return savedUser;
	}

	public User verify(String verifyId) {
		Optional<User> potentialUser = userRepo.findByVerifyId(verifyId);
		if (!potentialUser.isPresent()) {
			return null;
		}
		User user = potentialUser.get();
		user.setIsVerified(true);
		return userRepo.save(user);
	}

	public String login(LoggedInUser newLoginObject) throws NotVerifiedException{
		// Checks if the email exists in the database
		Optional<User> potentialUser = userRepo.findByEmail(newLoginObject.getEmail());
		// If User doesn't exist
		if (!potentialUser.isPresent()) {
			return null;
		}
		// Get and Store the email from database to verify password
		User user = potentialUser.get();
		if (!user.getIsVerified()) {
			throw new NotVerifiedException("User isn't verified.");
		}
		// Checks the hashed password to match what's in the database
		if (!BCrypt.checkpw(newLoginObject.getPassword(), user.getPassword())) {
			return null;
		}
		Session session = new Session();
		session.setUser(user);
		session = sessionRepo.save(session);
		return session.getToken();
	}

	public Boolean validateSession(String token) {
		Optional<Session> potentialSession = sessionRepo.findByToken(token);
		if (potentialSession.isPresent()) {
			Session session = potentialSession.get();
			if (session.getExpireAt().after(new Date())) {
				return true;
			}
		}
		return false;
	}
}
