package com.example.demo.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Session;

@Repository
public interface SessionRepository extends CrudRepository<Session, Long>{
	Optional<Session> findByToken(String token); 
}
