import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Loading from "./Loading";
import Modal from 'react-bootstrap/Modal';
import ChildAges from "./ChildAges";
import HotelMap from "./HotelMap";

function HotelHome(props) {
    const { token } = props;

    const [show, setShow] = useState(false);
    const [ hotelHover, setHotelHover] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState({});
    const [searchResultToken, setSearchResultToken] = useState("");
    const [locationResults, setLocationResults] = useState({});
    const [searchLocation, setSearchLocation] = useState("");
    const [hotelSearch, setHotelSearch] = useState({
        location: "",
        entityId: "",
        checkIn: "",
        checkOut: "",
        rooms: 1,
        adults: 1,
        childrenAge: []
    });

    function handleHotelSearchChange(e) {
        const { name, value } = e.target;

        setHotelSearch(prevHotelSearch => ({
            ...prevHotelSearch, [name]: value
        }));
        if (name == "location") {
            if (!value) {
                setLocationResults({});
            }
            setSearchLocation(value);
        }
    }

    useEffect(() => {
        if (searchLocation) {
            const id = setTimeout(() => {
                axios.get(`${import.meta.env.VITE_BASE_SERVER_URL}/hotellocation?query=` + searchLocation,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then((res) => {
                        setLocationResults(res.data);
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
    }, [searchLocation])

    function handleLocationItemClick(e, entityId, entityName) {
        e.preventDefault();
        setHotelSearch(prevHotelSearch => ({
            ...prevHotelSearch, location: entityName, entityId: entityId
        }));
        setLocationResults({});
        setSearchLocation("");
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const today = new Date();
        if (!hotelSearch.checkIn || !hotelSearch.checkOut || hotelSearch.rooms < 1 || hotelSearch.adults < 1 || !hotelSearch.entityId) {
            alert("Please make sure all fields are populated.");
            return;
        }
        if (hotelSearch.adults < hotelSearch.rooms && hotelSearch.childrenAge.length > hotelSearch.adults) {
            alert("There must be atleast one adult per room.")
        }
        if (hotelSearch.checkIn > hotelSearch.checkOut || hotelSearch.checkIn < today.toISOString().split('T')[0]) {
            alert("Please enter valid dates.");
            return;
        }
        setIsLoading(true);
        axios.get(`${import.meta.env.VITE_BASE_SERVER_URL}/hotelsearch`,
            {
                params: {
                    entityId: hotelSearch.entityId,
                    checkIn: hotelSearch.checkIn,
                    checkOut: hotelSearch.checkOut,
                    rooms: hotelSearch.rooms,
                    adults: hotelSearch.adults,
                    children: hotelSearch.childrenAge.join()

                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res.data);
                setSearchResults(res.data);
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

    function bookHotel(e, hotelIndex) {
        e.preventDefault();
        window.open(
            `${searchResults.results.hotelCards[hotelIndex].lowestPrice.url}`, "_blank"
        );

    }

    function setChildAge(e, childIndex) {
        e.preventDefault();
        setHotelSearch(prevHotelSearch => ({ ...prevHotelSearch, childrenAge: [...prevHotelSearch.childrenAge.slice(0, childIndex), e.target.value, ...prevHotelSearch.childrenAge.slice(childIndex + 1)] }));
    }

    return (
        <>
            <div className="d-flex justify-content-center mx-auto">
                <Form style={{ width: 1100, paddingTop: 30 }}>

                    <Row className="mb-3 d-flex align-items-center">
                        <Form.Group as={Col} >
                            <Form.Label>Location</Form.Label>
                            <Form.Control autoComplete="off" name="location" value={hotelSearch.location} onChange={(e) => { handleHotelSearchChange(e) }} type="text" placeholder="Example: Chicago" />
                            <ListGroup style={{ position: "fixed" }} >
                                {locationResults[0] && locationResults.map((location) => (
                                    <ListGroup.Item
                                        key={location.entityId}
                                        onClick={(e) => handleLocationItemClick(e, location.entityId, location.entityName)}
                                        action
                                    >
                                        {location.entityName}
                                    </ListGroup.Item>

                                ))}
                            </ListGroup>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Check-in</Form.Label>
                            <Form.Control name="checkIn" value={hotelSearch.checkIn} onChange={(e) => { handleHotelSearchChange(e) }} type="date" />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Check-out</Form.Label>
                            <Form.Control name="checkOut" value={hotelSearch.checkOut} onChange={(e) => { handleHotelSearchChange(e) }} type="date" />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Button style={{ marginTop: 30 }} variant="outline-secondary" onClick={() => setShow(true)}>Adults: {hotelSearch.adults}, Children: {hotelSearch.childrenAge.length},  Rooms: {hotelSearch.rooms}</Button>
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
                                            <h4>{hotelSearch.adults}</h4>
                                            <div>
                                                <button onClick={() => hotelSearch.adults > 1 ? setHotelSearch(prevHotelSearch => ({ ...prevHotelSearch, adults: prevHotelSearch.adults - 1 })) : ""}
                                                    style={{ marginRight: 5 }} class="btn btn-primary">-</button>
                                                <button onClick={() => setHotelSearch(prevHotelSearch => ({ ...prevHotelSearch, adults: prevHotelSearch.adults + 1 }))}
                                                    style={{ marginLeft: 5 }} class="btn btn-primary">+</button>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label>Children</Form.Label>
                                        <div class="d-flex justify-content-between">
                                            <h4>{hotelSearch.childrenAge.length}</h4>
                                            <div>
                                                <button onClick={() => setHotelSearch(prevHotelSearch => ({ ...prevHotelSearch, childrenAge: prevHotelSearch.childrenAge.slice(0, -1) }))}
                                                    style={{ marginRight: 5 }} class="btn btn-primary">-</button>
                                                <button onClick={() => setHotelSearch(prevHotelSearch => ({ ...prevHotelSearch, childrenAge: [...prevHotelSearch.childrenAge, 0] }))}
                                                    style={{ marginLeft: 5 }} class="btn btn-primary">+</button>
                                            </div>
                                        </div>
                                        <div class="d-flex flex-wrap ">
                                            {
                                                hotelSearch.childrenAge.map((child, childIndex) => (
                                                    <div style={{ width: 130, padding: 5 }}>
                                                        <ChildAges childIndex={childIndex} setChildAge={setChildAge} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </Form.Group>
                                    <Form.Group >
                                        <Form.Label>Rooms</Form.Label>
                                        <div class="d-flex justify-content-between">
                                            <h4>{hotelSearch.rooms}</h4>
                                            <div>
                                                <button onClick={() => hotelSearch.rooms > 1 ? setHotelSearch(prevHotelSearch => ({ ...prevHotelSearch, rooms: prevHotelSearch.rooms - 1 })) : ""}
                                                    style={{ marginRight: 5 }} class="btn btn-primary">-</button>
                                                <button onClick={() => setHotelSearch(prevHotelSearch => ({ ...prevHotelSearch, rooms: prevHotelSearch.rooms + 1 }))}
                                                    style={{ marginLeft: 5 }} class="btn btn-primary">+</button>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Button onClick={() => setShow(false)}>Submit</Button>
                                </Modal.Body>
                            </Modal>
                        </Form.Group>
                    </Row>
                    <Button variant="primary" onClick={(e) => onSubmit(e)} type="submit">
                        Search
                    </Button>
                </Form>
            </div>
            <div style={{position: "static"}} className="d-flex justify-content-center mx-auto">
                {
                    isLoading ? <Loading /> :
                        <Table>
                            <tbody>
                                <tr>
                                    <td>
                                        <Table >
                                            <tbody className="w-60" style={{ height: 600, display: "inline-block", overflow: "auto" }}>

                                                {
                                                    searchResults?.results?.hotelCards.map((hotel, hotelIndex) => (

                                                        <tr onMouseEnter={() => setHotelHover(hotel.id)} onMouseLeave={() => setHotelHover("")} id={hotel.id}>
                                                            <td><img src={hotel.images[0]} style={{ width: 250, height: 250 }} /></td>
                                                            <td>
                                                                {hotel.name}
                                                                <p />
                                                                {hotel.distance}
                                                                <p />
                                                                <img src={hotel.reviewsSummary.imageUrl} />

                                                                {hotel.reviewsSummary.score}
                                                                <p />
                                                                {
                                                                    hotel.otherPrices.map((price, priceIndex) => (
                                                                        <td style={{ padding: 10 }}>
                                                                            <a href={price.url} target="_blank">
                                                                                {price.name}
                                                                                <p />
                                                                                {price.price}
                                                                            </a>
                                                                        </td>
                                                                    ))
                                                                }

                                                            </td>
                                                            <td>
                                                                <button onClick={(e) => bookHotel(e, hotelIndex)} class="btn btn-primary">{hotel.cheapestPrice}/night</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </td>
                                    <td>
                                        <HotelMap searchResults={searchResults} hotelHover = { hotelHover }/>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                }
            </div>
        </>
    )
}

export default HotelHome;