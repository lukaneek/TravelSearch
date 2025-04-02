import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format, formatDuration, intervalToDuration } from 'date-fns';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';

function Home(props) {
    const { token } = props;
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState({});
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
        console.log(name + " " + value);
        setFlightSearch(prevFlightSearch => ({
            ...prevFlightSearch, [name]: value
        }));
        if (name == "destination") {
            setSearchDestination(value);
        }
        if (name == "origin") {
            setSearchOrigin(value);
        }

    }

    useEffect(() => {
        if (searchOrigin) {
            const id = setTimeout(() => {
                axios.get("http://localhost:8080/flightlocation?query=" + searchOrigin,
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
                axios.get("http://localhost:8080/flightlocation?query=" + searchDestination,
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
        console.log(title);
        console.log(entityId);
        setFlightSearch(prevFlightSearch => ({
            ...prevFlightSearch, destinationId: entityId, destination: title, destinationAirportCode: airportCode
        }));
        setDestinationResults({});
        setSearchDestination("");
    }

    function handleOriginItemClick(e, entityId, title, airportCode) {
        e.preventDefault();
        console.log(title);
        console.log(entityId);
        setFlightSearch(prevFlightSearch => ({
            ...prevFlightSearch, originId: entityId, origin: title, originAirportCode: airportCode
        }));
        setOriginResults({});
        setSearchOrigin("");
    }

    const onSubmit = (e) => {
        e.preventDefault();
        axios.get("http://localhost:8080/flightsearch",
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
            })
            .catch((e) => {
                if (e.status == 401) {
                    navigate("/");
                }
            })
    }

    function formatMinutesToHoursMinutes(minutes) {
        const duration = intervalToDuration({ start: 0, end: minutes * 60 * 1000 });
        return formatDuration(duration, {
            format: ['hours', 'minutes'],
            delimiter: ' ',
        });
    }

    return (
        <>
            <h1>Flight search page</h1>
            <div className="d-flex justify-content-center mx-auto">
                <Form style={{ width: 1000 }}>
                    <Row className="mb-3">
                        <Form.Group as={Col} >
                            <Form.Label>From</Form.Label>
                            <Form.Control autocomplete="off" name="origin" value={flightSearch.origin} onChange={(e) => { handleFlightSearchChange(e) }} type="text" placeholder="Enter Origin City" />
                            <ListGroup>
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
                            <Form.Control autocomplete="off" name="destination" value={flightSearch.destination} onChange={(e) => { handleFlightSearchChange(e) }} type="text" placeholder="Enter Destination City" />
                            <ListGroup>
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
                            <Form.Label>Return</Form.Label>
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
                            <Form.Control name="numOfAdults" value={flightSearch.numOfAdults} onChange={(e) => { handleFlightSearchChange(e) }} type="number" placeholder="1" />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Children</Form.Label>
                            <Form.Control name="numOfChildren" value={flightSearch.numOfChildren} onChange={(e) => { handleFlightSearchChange(e) }} type="number" placeholder="0" />
                        </Form.Group>
                    </Row>

                    <Button variant="primary" onClick={(e) => onSubmit(e)} type="submit">
                        Search
                    </Button>
                </Form>
            </div>
            <table class="table">
                <tbody>
                    {
                        searchResults?.itineraries?.buckets && searchResults.itineraries.buckets.map((bucket) => (
                            <div key={bucket.name}>
                                <tr>
                                    <td>{bucket.name}</td>
                                </tr>
                                <Accordion>
                                    {
                                        bucket.items.map((item, index) => (
                                            <>
                                                <div>
                                                <Accordion.Item eventKey={index}>
                                                    <Accordion.Header>
                                                        <tr>
                                                            <td>{item.price.formatted}</td>
                                                            <td>Leaving: {item.legs[0].origin.city}</td> <td>{format(item.legs[0].departure, "MMMM d, yyyy hh:mm aa")}</td>
                                                            <td>Arriving: {item.legs[0].destination.city}</td> <td>{format(item.legs[0].arrival, "MMMM d, yyyy hh:mm aa")}</td>
                                                            <td>Total Travel Time: {formatMinutesToHoursMinutes(item.legs[0].durationInMinutes)}</td>
                                                            <td>Carrier: {item.legs[0].carriers.marketing[0].name} <img style={{ width: 20 }} src={item.legs[0].carriers.marketing[0].logoUrl}></img></td>
                                                        </tr>
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                        {
                                                            item.legs[0].stopCount > 0
                                                                ? item.legs[0].segments.map((segment) => (
                                                                    <tr>
                                                                        <td>Leaving: {segment.origin.displayCode}</td> <td>{format(segment.departure, "MMMM d, yyyy hh:mm aa")}</td>
                                                                        <td>Arriving: {segment.destination.displayCode}</td> <td> {format(segment.arrival, "MMMM d, yyyy hh:mm aa")}</td>
                                                                        <td>{formatMinutesToHoursMinutes(segment.durationInMinutes)}</td>
                                                                        <td>Carrier: {segment.operatingCarrier.name}</td>
                                                                        <td>Flight: {segment.flightNumber}</td>
                                                                    </tr>
                                                                ))
                                                                : ""
                                                        }
                                                    </Accordion.Body>
                                                </Accordion.Item>

                                                <Accordion.Item eventKey={index}>
                                                    <Accordion.Header>
                                                        <tr>
                                                            <td />
                                                            <td>Leaving: {item.legs[1].origin.city}</td> <td>{format(item.legs[1].departure, "MMMM d, yyyy hh:mm aa")}</td>
                                                            <td>Arriving: {item.legs[1].destination.city}</td> <td>{format(item.legs[1].arrival, "MMMM d, yyyy hh:mm aa")}</td>
                                                            <td>Total Travel Time: {formatMinutesToHoursMinutes(item.legs[1].durationInMinutes)}</td>
                                                            <td>Carrier: {item.legs[1].carriers.marketing[0].name} <img style={{ width: 20 }} src={item.legs[1].carriers.marketing[0].logoUrl}></img></td>
                                                        </tr>
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                        {
                                                            item.legs[1].stopCount > 0
                                                                ? item.legs[1].segments.map((segment) => (
                                                                    <tr>
                                                                        <td>Leaving: {segment.origin.displayCode}</td> <td>{format(segment.departure, "MMMM d, yyyy hh:mm aa")}</td>
                                                                        <td>Arriving: {segment.destination.displayCode}</td> <td> {format(segment.arrival, "MMMM d, yyyy hh:mm aa")}</td>
                                                                        <td>{formatMinutesToHoursMinutes(segment.durationInMinutes)}</td>
                                                                        <td>Carrier: {segment.operatingCarrier.name}</td>
                                                                        <td>Flight: {segment.flightNumber}</td>
                                                                    </tr>
                                                                ))
                                                                : ""
                                                        }
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                                </div>
                                                <p />
                                            </>
                                        ))
                                    }

                                </Accordion>
                            </div>
                        ))

                    }
                </tbody>
            </table>
        </>
    )
}

export default Home;