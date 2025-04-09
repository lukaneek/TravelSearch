import React, { useState } from "react";
import axios from "axios";
import { format } from 'date-fns';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

function FlightItem(props) {
    const { item, itemIndex, token } = props;

    const [isLoadingBooking, setIsLoadingBooking] = useState(false);
    const [bookingItemId, setBookingItemId] = useState("");

    function bookFlight(e, itineraryId) {
        e.preventDefault();
        setIsLoadingBooking(true);
        setBookingItemId(itineraryId);
        axios.get(`${import.meta.env.VITE_BASE_SERVER_URL}/flightdetails`, {
            params: {
                itineraryId: encodeURIComponent(itineraryId),
                token: token
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res.data);
                window.open(
                    `${res.data.itinerary.pricingOptions[0].agents[0].url}`, "_blank"
                );
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setIsLoadingBooking(false);
                setBookingItemId("");
            })
    }

    function formatMinutesToHoursMinutesCustom(minutes) {
        const hours = Math.trunc(minutes / 60);
        const min = minutes % 60;

        return min == 0 ? hours + "h" : hours + "h " + min;
    }

    return (
        <>
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
                            {
                                item.legs.length == 1 ? "" :

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
                            }
                        </td>
                        <td>
                            {item.price.formatted}
                            <p />
                            {
                                isLoadingBooking && bookingItemId == item.id ? <p>🌀 Loading...</p> : <button class="btn btn-primary" onClick={(e) => bookFlight(e, item.id)}>Book</button>
                            }
                        </td>
                    </tr>
                </tbody>
            </Table>
        </>
    )
}

export default FlightItem;