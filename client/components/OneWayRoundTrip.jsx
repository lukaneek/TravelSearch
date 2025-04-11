import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';

function OneWayRoundTrip(props) {
    const { setSearchResults, setSearchResultToken, setIsLoading, token } = props;

    const [originResults, setOriginResults] = useState({});
    const [searchOrigin, setSearchOrigin] = useState("");
    const [destinationResults, setDestinationResults] = useState({});
    const [searchDestination, setSearchDestination] = useState("");
    const [flightSearch, setFlightSearch] = useState({
        inDate: "",
        outDate: "",
        origin: "",
        originId: "",
        originAirportCode: "",
        destination: "",
        destinationId: "",
        destinationAirportCode: "",
        cabinClass: "economy",
        numOfAdults: 1,
        numOfChildren: 0
    });

    function handleFlightSearchChange(e) {
        const { name, value } = e.target;

        setFlightSearch(prevFlightSearch => ({
            ...prevFlightSearch, [name]: value
        }));
        if (name == "destination") {
            if (!value) {
                setDestinationResults({});
            }
            setSearchDestination(value);
        }
        if (name == "origin") {
            if (!value) {
                setOriginResults({});
            }
            setSearchOrigin(value);
        }

    }

    useEffect(() => {
        if (searchOrigin) {
            const id = setTimeout(() => {
                axios.get(`${import.meta.env.VITE_BASE_SERVER_URL}/flightlocation?query=` + searchOrigin,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then((res) => {
                        setOriginResults(res.data);
                    })
                    .catch((e) => {
                        if (e.status == 401) {
                            navigate("/");
                        }
                    })
            }, 500);

            return () => {
                clearTimeout(id);
            }
        }
    }, [searchOrigin])

    useEffect(() => {
        if (searchDestination) {
            const id = setTimeout(() => {
                axios.get(`${import.meta.env.VITE_BASE_SERVER_URL}/flightlocation?query=` + searchDestination,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then((res) => {
                        setDestinationResults(res.data);
                    })
                    .catch((e) => {
                        if (e.status == 401) {
                            navigate("/");
                        }
                    })
            }, 500);

            return () => {
                clearTimeout(id);
            }
        }

    }, [searchDestination])

    function handleDestinationItemClick(e, entityId, title, airportCode) {
        e.preventDefault();
        setFlightSearch(prevFlightSearch => ({
            ...prevFlightSearch, destinationId: entityId, destination: title, destinationAirportCode: airportCode
        }));
        setDestinationResults({});
        setSearchDestination("");
    }

    function handleOriginItemClick(e, entityId, title, airportCode) {
        e.preventDefault();
        setFlightSearch(prevFlightSearch => ({
            ...prevFlightSearch, originId: entityId, origin: title, originAirportCode: airportCode
        }));
        setOriginResults({});
        setSearchOrigin("");
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const today = new Date();
        if (!flightSearch.inDate || !flightSearch.destinationId || !flightSearch.originId) {
            alert("Please make sure all fields are populated.")
            return;
        }
        if (flightSearch.inDate < today.toISOString().split('T')[0]) {
            alert("Please enter a valid departing date.");
            return;
        }
        if (flightSearch.outDate) {
            if ((flightSearch.inDate > flightSearch.outDate) || (flightSearch.outDate < today.toISOString().split('T')[0])) {
                alert("Please enter valid dates.");
                return;
            }
        }
        if (flightSearch.numOfAdults < 1 && flightSearch.numOfChildren < 1) {
            alert("Must have at least one traveler.");
            return;
        }
        if (flightSearch.originId == flightSearch.destinationId) {
            alert("The origin and destination cannot be the same.");
            return;
        }
        setIsLoading(true);
        axios.get(`${import.meta.env.VITE_BASE_SERVER_URL}/flightsearch`,
            {
                params: {
                    inDate: flightSearch.inDate,
                    outDate: flightSearch.outDate,
                    origin: flightSearch.originAirportCode,
                    originId: flightSearch.originId,
                    destination: flightSearch.destinationAirportCode,
                    destinationId: flightSearch.destinationId,
                    cabinClass: flightSearch.cabinClass,
                    adults: flightSearch.numOfAdults,
                    children: flightSearch.numOfChildren
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res.data.data);
                setSearchResults(res.data.data);
                setSearchResultToken(res.data.token);
            })
            .catch((e) => {
                if (e.status == 401) {
                    navigate("/");
                }
                alert("An error occured, please try again later.");
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    return (
        <>
            <div className="d-flex justify-content-center mx-auto">
                <Form style={{ width: 1000 }}>
                    <Row className="mb-3">
                        <Form.Group as={Col} >
                            <Form.Label>From</Form.Label>
                            <Form.Control autoComplete="off" name="origin" value={flightSearch.origin} onChange={(e) => { handleFlightSearchChange(e) }} type="text" placeholder="Enter Origin City" />
                            <ListGroup style={{ position: "fixed" }} >
                                {originResults?.inputSuggest && originResults.inputSuggest.map((item) => (
                                    item.navigation.entityType == "AIRPORT"
                                        ?
                                        <ListGroup.Item
                                            key={item.navigation.entityId}
                                            onClick={(e) => handleOriginItemClick(e, item.navigation.relevantFlightParams.entityId, item.presentation.suggestionTitle, item.navigation.relevantFlightParams.skyId)}
                                            action
                                        >
                                            {item.presentation.suggestionTitle}
                                        </ListGroup.Item>
                                        : ""
                                ))}
                            </ListGroup>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>To</Form.Label>
                            <Form.Control autoComplete="off" name="destination" value={flightSearch.destination} onChange={(e) => { handleFlightSearchChange(e) }} type="text" placeholder="Enter Destination City" />
                            <ListGroup style={{ position: "fixed" }} >
                                {destinationResults?.inputSuggest && destinationResults.inputSuggest.map((item) => (
                                    item.navigation.entityType == "AIRPORT"
                                        ?
                                        <ListGroup.Item
                                            key={item.navigation.entityId}
                                            onClick={(e) => handleDestinationItemClick(e, item.navigation.relevantFlightParams.entityId, item.presentation.suggestionTitle, item.navigation.relevantFlightParams.skyId)}
                                            action
                                        >
                                            {item.presentation.suggestionTitle}
                                        </ListGroup.Item>
                                        : ""
                                ))}
                            </ListGroup>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Depart</Form.Label>
                            <Form.Control name="inDate" value={flightSearch.inDate} onChange={(e) => { handleFlightSearchChange(e) }} type="date" />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Return (Add a return date for round trip)</Form.Label>
                            <Form.Control name="outDate" value={flightSearch.outDate} onChange={(e) => { handleFlightSearchChange(e) }} type="date" />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} >
                            <Form.Label>Cabin Class</Form.Label>
                            <Form.Select name="cabinClass" value={flightSearch.cabinClass} onChange={(e) => { handleFlightSearchChange(e) }}>
                                <option value="economy">Economy</option>
                                <option value="premium_economy">Premium Economy</option>
                                <option value="business">Business Class</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} >
                            <Form.Label>Adults</Form.Label>
                            <Form.Control name="numOfAdults" value={flightSearch.numOfAdults} onChange={(e) => { handleFlightSearchChange(e) }} type="number" min="0" />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Children</Form.Label>
                            <Form.Control name="numOfChildren" value={flightSearch.numOfChildren} onChange={(e) => { handleFlightSearchChange(e) }} type="number" min="0" />
                        </Form.Group>
                    </Row>

                    <Button variant="primary" onClick={(e) => onSubmit(e)} type="submit">
                        Search
                    </Button>
                </Form>
            </div >
        </>
    )
}

export default OneWayRoundTrip;