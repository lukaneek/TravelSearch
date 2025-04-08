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
import Table from 'react-bootstrap/Table';

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
        if (!flightSearch.inDate || !flightSearch.outDate || !flightSearch.destination || !flightSearch.origin) {
            alert("Please make sure all fields are populated.")
            return;
        }
        else if ((flightSearch.inDate > flightSearch.outDate) || (flightSearch.inDate < today.toISOString().split('T')[0]) || (flightSearch.outDate < today.toISOString().split('T')[0])) {
            alert("Please enter valid dates.");
            return;
        }
        else if (flightSearch.numOfAdults < 1 && flightSearch.numOfChildren < 1) {
            alert("Must have at least one traveler.");
            return;
        }
        else if (flightSearch.origin == flightSearch.destination) {
            alert("The origin and destination cannot be the same.");
            return;
        }
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
            })
            .catch((e) => {
                if (e.status == 401) {
                    navigate("/");
                }
                alert("An error occured, please try again later.");
            })
    }

    function formatMinutesToHoursMinutesCustom(minutes) {
        const hours = Math.trunc(minutes / 60);
        const min = minutes % 60;

        return min == 0 ? hours + "h" : hours + "h " + min;
    }

    return (
        <>
            <h1>Flight Search Page</h1>
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
            <div className="d-flex justify-content-center mx-auto">
                <Table style={{ width: 1100 }}>
                    <tbody>
                        {
                            searchResults?.itineraries?.buckets && searchResults.itineraries.buckets.map((bucket, bucketIndex) => (
                                <>
                                    <tr>
                                        <td>{bucket.name}</td>
                                    </tr>
                                    <tr>
                                        <Accordion>
                                            {
                                                bucket.items.map((item, itemIndex) => (
                                                    <Table>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <Accordion.Item eventKey={itemIndex}>
                                                                        <Accordion.Header>
                                                                            <tr>
                                                                                <td style={{ paddingRight: 25 }} >{item.legs[0].origin.city}</td> <td style={{ paddingLeft: 25 }} >{format(item.legs[0].departure, "MMMM d hh:mm aa")}</td>
                                                                                <td style={{ paddingLeft: 50, paddingRight: 25 }} >{formatMinutesToHoursMinutesCustom(item.legs[0].durationInMinutes)}</td>
                                                                                <td style={{ paddingLeft: 25, paddingRight: 50 }} >{item.legs[0].stopCount == 0 ? "Direct" : item.legs[0].stopCount + " Stop(s)"}</td>
                                                                                <td style={{ paddingRight: 25 }} >{item.legs[0].destination.city}</td> <td style={{ paddingLeft: 25 }} >{format(item.legs[0].arrival, "MMMM d hh:mm aa")}</td>
                                                                                <td style={{ paddingLeft: 25 }} >{item.legs[0].carriers.marketing[0].name} <img style={{ width: 20 }} src={item.legs[0].carriers.marketing[0].logoUrl}></img></td>
                                                                            </tr>
                                                                        </Accordion.Header>
                                                                        <Accordion.Body>
                                                                            {
                                                                                item.legs[0].stopCount > 0
                                                                                    ? item.legs[0].segments.map((segment, segmentIndex) => (
                                                                                        <tr>
                                                                                            <td style={{ paddingRight: 25 }} >{segment.origin.displayCode}</td> <td style={{ paddingLeft: 25 }} >{format(segment.departure, "MMMM d hh:mm aa")}</td>
                                                                                            <td style={{ paddingLeft: 50, paddingRight: 25 }} >{formatMinutesToHoursMinutesCustom(segment.durationInMinutes)}</td>
                                                                                            <td style={{ paddingLeft: 50, paddingRight: 50 }} >
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-plane">
                                                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
                                                                                                </svg>
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                                                                                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                                                                                </svg>
                                                                                            </td>
                                                                                            <td style={{ paddingLeft: 25, paddingRight: 50 }} >{segment.destination.displayCode}</td> <td style={{ paddingRight: 25 }} > {format(segment.arrival, "MMMM d hh:mm aa")}</td>
                                                                                            <td style={{ paddingLeft: 25 }} >{segment.operatingCarrier.name}</td>
                                                                                            <td style={{ paddingLeft: 50 }} >#{segment.flightNumber}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                    : ""
                                                                            }
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>

                                                                    <Accordion.Item eventKey={itemIndex}>
                                                                        <Accordion.Header className="">
                                                                            <tr>

                                                                                <td style={{ paddingRight: 25 }}>{item.legs[1].origin.city}</td> <td style={{ paddingLeft: 25 }} >{format(item.legs[1].departure, "MMMM d hh:mm aa")}</td>
                                                                                <td style={{ paddingLeft: 50, paddingRight: 25 }} >{formatMinutesToHoursMinutesCustom(item.legs[1].durationInMinutes)}</td>
                                                                                <td style={{ paddingLeft: 25, paddingRight: 50 }} >{item.legs[1].stopCount == 0 ? "Direct" : item.legs[1].stopCount + " Stop(s)"}</td>
                                                                                <td style={{ paddingRight: 25 }}>{item.legs[1].destination.city}</td> <td style={{ paddingLeft: 25 }} >{format(item.legs[1].arrival, "MMMM d hh:mm aa")}</td>
                                                                                <td style={{ paddingLeft: 25 }} >{item.legs[1].carriers.marketing[0].name} <img style={{ width: 20 }} src={item.legs[1].carriers.marketing[0].logoUrl}></img></td>
                                                                            </tr>
                                                                        </Accordion.Header>
                                                                        <Accordion.Body>
                                                                            {
                                                                                item.legs[1].stopCount > 0
                                                                                    ? item.legs[1].segments.map((segment, segmentIndex) => (
                                                                                        <tr>
                                                                                            <td style={{ paddingRight: 25 }} >{segment.origin.displayCode}</td> <td style={{ paddingLeft: 25 }} >{format(segment.departure, "MMMM d hh:mm aa")}</td>
                                                                                            <td style={{ paddingLeft: 50, paddingRight: 25 }} >{formatMinutesToHoursMinutesCustom(segment.durationInMinutes)}</td>
                                                                                            <td style={{ paddingLeft: 50, paddingRight: 50 }} >
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-plane">
                                                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
                                                                                                </svg>
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                                                                                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                                                                                </svg>
                                                                                            </td>
                                                                                            <td style={{ paddingLeft: 25, paddingRight: 50 }} >{segment.destination.displayCode}</td> <td style={{ paddingRight: 25 }} > {format(segment.arrival, "MMMM d hh:mm aa")}</td>

                                                                                            <td style={{ paddingLeft: 25 }} >{segment.operatingCarrier.name}</td>
                                                                                            <td style={{ paddingLeft: 50 }} >#{segment.flightNumber}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                    : ""
                                                                            }
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                </td>
                                                                <td>{item.price.formatted}</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                ))
                                            }
                                        </Accordion>
                                    </tr>
                                </>
                            ))

                        }
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default Home;