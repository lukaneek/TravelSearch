import React, { useEffect, useState } from "react";
import axios from "axios";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

function MultiCity(props) {
    const { setSearchResults, setSearchResultToken, setIsLoading, token } = props;

    const [legs, setLegs] = useState(
        [{
            "origin": "",
            "originId": "",
            "destination": "",
            "destinationId": "",
            "departDate": "",
            originResults: {},
            destinationResults: {},
            originAirportCode: "",
            destinationAirportCode: "",
            searchOrigin: "",
            searchDestination: ""

        },
        {
            "origin": "",
            "originId": "",
            "destination": "",
            "destinationId": "",
            "departDate": "",
            originResults: {},
            destinationResults: {},
            originAirportCode: "",
            destinationAirportCode: "",
            searchOrigin: "",
            searchDestination: ""
        }]
    )
    const [originIndex, setOriginIndex] = useState(-1);
    const [destinationIndex, setDestinationIndex] = useState(-1);

    const [multiFlightSearch, setMultiFlightSearch] = useState({
        adults: 1,
        children: 0,
        infants: 0,
        cabinClass: "economy"
    });


    function handleFlightSearchChange(e) {
        const { name, value } = e.target;

        setMultiFlightSearch(prevFlightSearch => ({
            ...prevFlightSearch, [name]: value
        }));

    }

    function handleFlightLegSearchChange(e, legIndex) {
        const { name, value } = e.target;

        const leg = legs[legIndex];
        leg[name] = value;

        if (name == "destination") {
            if (!value) {
                leg.destinationResults = {};
            }
            setDestinationIndex(legIndex);
            leg.searchDestination = value;
        }
        if (name == "origin") {
            if (!value) {
                leg.originResults = {};
            }
            setOriginIndex(legIndex);
            leg.searchOrigin = value;
        }
        setLegs(prevLegs => [...prevLegs.slice(0, legIndex), leg, ...prevLegs.slice(legIndex + 1)]); 
    }

    useEffect(() => {
        if (originIndex > -1) {
            const id = setTimeout(() => {
                axios.get(`${import.meta.env.VITE_BASE_SERVER_URL}/flightlocation?query=` + legs[originIndex].searchOrigin,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then((res) => {
                        setLegs(prevLegs => [...prevLegs.slice(0, originIndex), {...legs[originIndex], originResults: res.data}, ...prevLegs.slice(originIndex + 1)]);
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
    }, [originIndex])

    useEffect(() => {
        if (destinationIndex > -1) {
            const id = setTimeout(() => {
                axios.get(`${import.meta.env.VITE_BASE_SERVER_URL}/flightlocation?query=` + legs[destinationIndex].searchDestination,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then((res) => {
                        setLegs(prevLegs => [...prevLegs.slice(0, destinationIndex), {...legs[destinationIndex], destinationResults: res.data}, ...prevLegs.slice(destinationIndex + 1)]);
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

    }, [destinationIndex])

    function handleDestinationItemClick(e, entityId, title, airportCode, legIndex) {
        e.preventDefault();
        setLegs(prevLegs => [...prevLegs.slice(0, legIndex), {...legs[legIndex], destinationResults: {}, searchDestination: "", destinationId: entityId, destination: title, destinationAirportCode: airportCode}, ...prevLegs.slice(legIndex + 1)]);
    }

    function handleOriginItemClick(e, entityId, title, airportCode, legIndex) {
        e.preventDefault();
        setLegs(prevLegs => [...prevLegs.slice(0, legIndex), {...legs[legIndex], originResults: {}, searchOrigin: "", originId: entityId, origin: title, originAirportCode: airportCode}, ...prevLegs.slice(legIndex + 1)]);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const today = new Date();
        /*if (!flightSearch.inDate || !flightSearch.destinationId || !flightSearch.originId) {
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
        }*/
        setIsLoading(true);
        axios.post(`${import.meta.env.VITE_BASE_SERVER_URL}/multisearch`,
            {...multiFlightSearch,
            flights: legs}
            , {
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

    function addLeg(e) {
        e.preventDefault();
        setLegs([...legs, {
            "origin": "",
            "originId": "",
            "destination": "",
            "destinationId": "",
            "departDate": ""
        }])
    }

    function deleteLeg(e, legIndex) {
        e.preventDefault();
        const temp = [...legs];
        temp.splice(legIndex, 1);
        setLegs([...temp]);
    }

    return (
        <>
            <div className="d-flex justify-content-center mx-auto">
                <Form style={{ width: 1000 }}>
                    {
                        legs.map((leg, legIndex) => (
                            <Row className="mb-3">
                                <Form.Group as={Col} >
                                    <Form.Label>From</Form.Label>
                                    <Form.Control autoComplete="off" name="origin" value={legs[legIndex].origin} onChange={(e) => { handleFlightLegSearchChange(e, legIndex) }} type="text" placeholder="Enter Origin City" />
                                    <ListGroup style={{ position: "fixed" }} >
                                        {legs[legIndex].originResults?.inputSuggest && legs[legIndex].originResults.inputSuggest.map((item) => (
                                            item.navigation.entityType == "AIRPORT"
                                                ?
                                                <ListGroup.Item
                                                    key={item.navigation.entityId}
                                                    onClick={(e) => handleOriginItemClick(e, item.navigation.relevantFlightParams.entityId, item.presentation.suggestionTitle, item.navigation.relevantFlightParams.skyId, legIndex)}
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
                                    <Form.Control autoComplete="off" name="destination" value={legs[legIndex].destination} onChange={(e) => { handleFlightLegSearchChange(e, legIndex) }} type="text" placeholder="Enter Destination City" />
                                    <ListGroup style={{ position: "fixed" }} >
                                        {legs[legIndex].destinationResults?.inputSuggest && legs[legIndex].destinationResults.inputSuggest.map((item) => (
                                            item.navigation.entityType == "AIRPORT"
                                                ?
                                                <ListGroup.Item
                                                    key={item.navigation.entityId}
                                                    onClick={(e) => handleDestinationItemClick(e, item.navigation.relevantFlightParams.entityId, item.presentation.suggestionTitle, item.navigation.relevantFlightParams.skyId, legIndex)}
                                                    action
                                                >
                                                    {item.presentation.suggestionTitle}
                                                </ListGroup.Item>
                                                : ""
                                        ))}
                                    </ListGroup>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Depart</Form.Label>
                                    <Form.Control name="departDate" value={legs[legIndex].departDate} onChange={(e) => { handleFlightLegSearchChange(e, legIndex) }} type="date" />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label></Form.Label>
                                    <Button type="button" class="btn btn-secondary" onClick={(e) => deleteLeg(e, legIndex)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                        </svg></Button>
                                </Form.Group>
                            </Row>
                        ))
                    }
                    <Row>
                        <Button style={{ width: 100 }} onClick={(e) => addLeg(e)}>Add Leg</Button>
                    </Row>
                    <Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} >
                            <Form.Label>Cabin Class</Form.Label>
                            <Form.Select name="cabinClass" value={multiFlightSearch.cabinClass} onChange={(e) => { handleFlightSearchChange(e) }}>
                                <option value="economy">Economy</option>
                                <option value="premium_economy">Premium Economy</option>
                                <option value="business">Business Class</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} >
                            <Form.Label>Adults</Form.Label>
                            <Form.Control name="adults" value={multiFlightSearch.adults} onChange={(e) => { handleFlightSearchChange(e) }} type="number" min="0" />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Children</Form.Label>
                            <Form.Control name="children" value={multiFlightSearch.children} onChange={(e) => { handleFlightSearchChange(e) }} type="number" min="0" />
                        </Form.Group>
                    </Row>
                    </Row>
                    <Button variant="primary" onClick={(e) => onSubmit(e)} type="submit">
                        Search
                    </Button>
                </Form>
            </div>
        </>
    )
}

export default MultiCity;