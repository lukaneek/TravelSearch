package com.example.demo.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.User;
import com.example.demo.services.UserService;
import com.example.demo.utils.ErrorResponse;

import jakarta.validation.Valid;

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
		}
		catch(Exception e) {
			System.out.println(e);
			List<String> errors = new ArrayList<String>();
			errors.add(e.getMessage());
			ErrorResponse error = new ErrorResponse("Processing Failure", errors);
			return new ResponseEntity(error, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (registeredUser == null) {
			return new ResponseEntity<>(HttpStatus.CONFLICT);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
}
