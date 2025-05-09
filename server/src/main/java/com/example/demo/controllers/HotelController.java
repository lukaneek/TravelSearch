package com.example.demo.controllers;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = { "http://localhost:5173", "https://lukavujasin.xyz" })
@RestController
public class HotelController {

	@GetMapping("/hotelsearch")
	public ResponseEntity<?> flightSearch(@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam String checkIn, @RequestParam String checkOut, @RequestParam Integer adults,
			@RequestParam Integer rooms, @RequestParam String entityId, @RequestParam String children) {
		// String bearerToken = authorizationHeader.replace("Bearer ", "");
		// if (!userServ.validateSession(bearerToken)) {
		// return new ResponseEntity(HttpStatus.UNAUTHORIZED);
		// }

		String uriString = "https://skyscanner89.p.rapidapi.com/hotels/list" + "?entity_id=" + entityId + "&checkin="
				+ checkIn + "&checkout=" + checkOut + "&adults=" + adults + "&children_ages=" + children + "&rooms=" + rooms;

		HttpClient client = HttpClient.newHttpClient();
		HttpRequest request = HttpRequest.newBuilder().uri(URI.create(uriString))
				.header("x-rapidapi-host", "skyscanner89.p.rapidapi.com")
				.header("x-rapidapi-key", "a4af3e5d36msh0fa2fcbddc846d0p17c2d5jsne755f5ff81bf").build();

		HttpResponse<String> response = null;
		try {
			response = client.send(request, BodyHandlers.ofString());
		} catch (Exception e) {
			return new ResponseEntity<>("An unexpected error occured", HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<>(response.body(), HttpStatus.resolve(response.statusCode()));
	}

	@GetMapping("/hotellocation")
	public ResponseEntity<?> hotelLocation(@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam String query) {
		// String bearerToken = authorizationHeader.replace("Bearer ", "");
		// if (!userServ.validateSession(bearerToken)) {
		// return new ResponseEntity(HttpStatus.UNAUTHORIZED);
		// }

		String uriString = "https://skyscanner89.p.rapidapi.com/hotels/auto-complete?query=" + query;

		HttpClient client = HttpClient.newHttpClient();
		HttpRequest request = HttpRequest.newBuilder().uri(URI.create(uriString))
				.header("x-rapidapi-host", "skyscanner89.p.rapidapi.com")
				.header("x-rapidapi-key", "a4af3e5d36msh0fa2fcbddc846d0p17c2d5jsne755f5ff81bf").build();

		HttpResponse<String> response = null;
		try {
			response = client.send(request, BodyHandlers.ofString());
		} catch (Exception e) {
			return new ResponseEntity<>("An unexpected error occured", HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<>(response.body(), HttpStatus.resolve(response.statusCode()));

	}
}
