package com.example.demo.models;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "user")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotEmpty(message = "Must Enter Your Email.")
	@Email(message = "Please enter a valid email!")
	private String email;
	
	@NotEmpty(message = "Must Enter Your Password.")
	@Size(min = 5, max = 128, message = "Password must be between 5 and 128 characters")
	private String password;
	
	@Transient
	@NotEmpty(message = "Confirm Password is required!")
	@Size(min = 5, max = 128, message = "Confirm Password must be between 5 and 128 characters")
	private String confirm;
	
	private Boolean isVerified;
	
	private String verificationId;
	
	@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
	private List<Session> sessions;
	
	public User() {
	}
	
	@PrePersist
    protected void onCreate() {
        UUID uuid = UUID.randomUUID();
        this.verificationId = uuid.toString();
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getConfirm() {
		return confirm;
	}

	public void setConfirm(String confirm) {
		this.confirm = confirm;
	}

	public Boolean getIsVerified() {
		return isVerified;
	}

	public void setIsVerified(Boolean isVerified) {
		this.isVerified = isVerified;
	}

	public List<Session> getSessions() {
		return sessions;
	}

	public void setSessions(List<Session> sessions) {
		this.sessions = sessions;
	}

	public String getVerificationId() {
		return verificationId;
	}

	public void setVerificationId(String verificationId) {
		this.verificationId = verificationId;
	}
	
	
	
	
}
