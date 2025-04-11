package com.example.demo.dtos;

import java.util.List;

public class MultiCitySearch {
	
	private Integer adults;
	
	private Integer children;
	
	private Integer infants;
	
	private String cabinClass;
	
	private List<MultiCitySearchFlight> flights;
	
	public MultiCitySearch() {}

	public Integer getAdults() {
		return adults;
	}

	public void setAdults(Integer adults) {
		this.adults = adults;
	}

	public Integer getChildren() {
		return children;
	}

	public void setChildren(Integer children) {
		this.children = children;
	}

	public String getCabinClass() {
		return cabinClass;
	}

	public void setCabinClass(String cabinClass) {
		this.cabinClass = cabinClass;
	}

	public List<MultiCitySearchFlight> getFlights() {
		return flights;
	}

	public void setFlights(List<MultiCitySearchFlight> flights) {
		this.flights = flights;
	}

	public Integer getInfants() {
		return infants;
	}

	public void setInfants(Integer infants) {
		this.infants = infants;
	}
	
	
	
	
}
