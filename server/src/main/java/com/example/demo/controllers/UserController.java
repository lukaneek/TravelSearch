package com.example.demo.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dtos.LoggedInUser;
import com.example.demo.dtos.Verification;
import com.example.demo.exceptions.NotVerifiedException;
import com.example.demo.models.User;
import com.example.demo.services.UserService;
import com.example.demo.utils.ErrorResponse;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@CrossOrigin(origins = {"http://localhost:5173", "https://lukavujasin.xyz"})
@RestController
public class UserController {

	@Autowired
	UserService userServ;

	@PostMapping("/register")
	public ResponseEntity<Long> register(@Valid @RequestBody User user) {
		// Checking to see if password and confirm password match
		if (!user.getPassword().equals(user.getConfirm())) {
			List<String> errors = new ArrayList<String>();
			errors.add("Passwords don't match.");
			ErrorResponse error = new ErrorResponse("Validation Failed", errors);
			return new ResponseEntity(error, HttpStatus.UNPROCESSABLE_ENTITY);
		}
		User registeredUser = null;
		try {
			registeredUser = userServ.register(user);
		} catch (MessagingException e) {
			List<String> errors = new ArrayList<String>();
			errors.add("An error occured sending an email.  Please try registering again.");
			ErrorResponse error = new ErrorResponse("Processing Failure", errors);
			return new ResponseEntity(error, HttpStatus.BAD_GATEWAY);
		} 
		if (registeredUser == null) {
			return new ResponseEntity<>(HttpStatus.CONFLICT);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@PostMapping("/verify")
	public ResponseEntity<String> verify(@RequestBody Verification verify) {
		User verifyUser = userServ.verify(verify.getVerifyId());
		if (verifyUser == null) {
			return new ResponseEntity("Couldn't verify this user.  Please register again.",
					HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity("Successfully Verified!", HttpStatus.OK);

	}

	@PostMapping("/login")
	public ResponseEntity<String> login(@Valid @RequestBody LoggedInUser loggedInUser) {
		String token = null;
		try {
			token = userServ.login(loggedInUser);
			if (token == null) {
				return new ResponseEntity(HttpStatus.NOT_FOUND);
			}
		} catch (NotVerifiedException e) {
			return new ResponseEntity(HttpStatus.UNAUTHORIZED);
		}

		return new ResponseEntity(token, HttpStatus.OK);
	}
	
}
