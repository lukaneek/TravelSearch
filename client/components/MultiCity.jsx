import React, { useEffect, useState } from "react";
import axios from "axios";
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function MultiCity(props) {
    const { setSearchResults, setSearchResultToken, setIsLoading, token } = props;

    const [show, setShow] = useState(false);

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
    const [originIndex, setOriginIndex] = useState(0);
    const [destinationIndex, setDestinationIndex] = useState(0);

    const [multiFlightSearch, setMultiFlightSearch] = useState({
        adults: 1,
        children: 0,
        infants: 0,
        cabinClass: "economy"
    });

    useEffect(() => {
        setSearchResults({});
    }, [])

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
        const id = setTimeout(() => {
            axios.get(`${import.meta.env.VITE_BASE_SERVER_URL}/flightlocation?query=` + legs[originIndex].searchOrigin,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then((res) => {
                    setLegs(prevLegs => [...prevLegs.slice(0, originIndex), { ...legs[originIndex], originResults: res.data }, ...prevLegs.slice(originIndex + 1)]);
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
    }, [legs[originIndex].searchOrigin])

    useEffect(() => {
        const id = setTimeout(() => {
            axios.get(`${import.meta.env.VITE_BASE_SERVER_URL}/flightlocation?query=` + legs[destinationIndex].searchDestination,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then((res) => {
                    setLegs(prevLegs => [...prevLegs.slice(0, destinationIndex), { ...legs[destinationIndex], destinationResults: res.data }, ...prevLegs.slice(destinationIndex + 1)]);
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
    }, [legs[destinationIndex].searchDestination])

    function handleDestinationItemClick(e, entityId, title, airportCode, legIndex) {
        e.preventDefault();
        setLegs(prevLegs => [...prevLegs.slice(0, legIndex), { ...legs[legIndex], destinationResults: {}, searchDestination: "", destinationId: entityId, destination: title, destinationAirportCode: airportCode }, ...prevLegs.slice(legIndex + 1)]);
    }

    function handleOriginItemClick(e, entityId, title, airportCode, legIndex) {
        e.preventDefault();
        setLegs(prevLegs => [...prevLegs.slice(0, legIndex), { ...legs[legIndex], originResults: {}, searchOrigin: "", originId: entityId, origin: title, originAirportCode: airportCode }, ...prevLegs.slice(legIndex + 1)]);
    }

    const onSubmit = (e, count = 1) => {
        e.preventDefault();
        const today = new Date();

        if (multiFlightSearch.adults == 0 && multiFlightSearch.children == 0) {
            alert("Must have atleast one traveler.");
            return;
        }

        for (let i = 0; i < legs.length; i++) {
            if (!legs[i].originId || !legs[i].destinationId || !legs[i].departDate) {
                alert("Please make sure all fields are populated.");
                return;
            }
            if (legs[i].originId == legs[i].destinationId) {
                alert("You cannot fly to the same airport.");
                return;
            }
            if (legs[i].departDate < today.toISOString().split('T')[0]) {
                alert("Please enter departing dates in the future.");
                return;
            }
            if (legs[i + 1] && legs[i].departDate > legs[i + 1].departDate) {
                alert("Please enter valid departing dates.");
                return;
            }
        }

        setIsLoading(true);
        axios.post(`${import.meta.env.VITE_BASE_SERVER_URL}/multisearch`,
            {
                ...multiFlightSearch,
                flights: legs
            }
            , {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res.data.data);
                if (res.data.data.itineraries.buckets.length == 0 && count < 5) {
                    console.log("Restarting search.")
                    onSubmit(e, count + 1);
                }
                else if (res.data.data.itineraries.buckets.length == 0 && count == 5) {
                    alert("Something went wrong, please try again later.");
                    return;
                }
                console.log(res.data);
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
                            <Row className="mb-3 d-flex flex-nowrap">
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
                                <Button style={{ marginTop: 30, width: 50 }} type="button" class="btn btn-secondary" onClick={(e) => deleteLeg(e, legIndex)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                    </svg></Button>

                            </Row>
                        ))
                    }
                    <Row style={{ marginTop: 30 }}>
                        <Form.Group>
                            <div class="d-flex flex-nowrap justify-content-center align-items-center">
                                <Button onClick={(e) => addLeg(e)}>
                                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
                                    </svg>
                                    Add another flight
                                </Button>
                            </div>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Button variant="outline-secondary" onClick={() => setShow(true)}>Adults: {multiFlightSearch.adults}, Children: {multiFlightSearch.children},  Cabin Class: {multiFlightSearch.cabinClass}</Button>
                            <Modal
                                size="sm"
                                show={show}
                                onHide={() => setShow(false)}
                                aria-labelledby="example-modal-sizes-title-sm"
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title id="example-modal-sizes-title-sm">
                                        Guests and rooms
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group >
                                        <Form.Label>Adults</Form.Label>
                                        <div class="d-flex justify-content-between">
                                            <h4>{multiFlightSearch.adults}</h4>
                                            <div>
                                                <button onClick={() => multiFlightSearch.adults > 1 ? setMultiFlightSearch(prevMultiFlightSearch => ({ ...prevMultiFlightSearch, adults: prevMultiFlightSearch.adults - 1 })) : ""}
                                                    style={{ marginRight: 5 }} class="btn btn-primary">-</button>
                                                <button onClick={() => setMultiFlightSearch(prevMultiFlightSearch => ({ ...prevMultiFlightSearch, adults: prevMultiFlightSearch.adults + 1 }))}
                                                    style={{ marginLeft: 5 }} class="btn btn-primary">+</button>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label>Children</Form.Label>
                                        <div class="d-flex justify-content-between">
                                            <h4>{multiFlightSearch.children}</h4>
                                            <div>
                                                <button onClick={() => multiFlightSearch.children > 0 ? setMultiFlightSearch(prevMultiFlightSearch => ({ ...prevMultiFlightSearch, children: prevMultiFlightSearch.children - 1 })) : ""}
                                                    style={{ marginRight: 5 }} class="btn btn-primary">-</button>
                                                <button onClick={() => setMultiFlightSearch(prevMultiFlightSearch => ({ ...prevMultiFlightSearch, children: prevMultiFlightSearch.children + 1 }))}
                                                    style={{ marginLeft: 5 }} class="btn btn-primary">+</button>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label>Cabin Class</Form.Label>
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <Form.Select name="cabinClass" value={multiFlightSearch.cabinClass} onChange={(e) => { handleFlightSearchChange(e) }}>
                                                    <option value="economy">Economy</option>
                                                    <option value="premium_economy">Premium Economy</option>
                                                    <option value="business">Business Class</option>
                                                </Form.Select>
                                            </div>
                                        </div>
                                    </Form.Group >
                                    <div style={{ marginTop: 30 }}>
                                        <Button onClick={() => setShow(false)}>Submit</Button>
                                    </div>

                                </Modal.Body>
                            </Modal>
                        </Form.Group>
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