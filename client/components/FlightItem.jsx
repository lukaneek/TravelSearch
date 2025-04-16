import React, { useState } from "react";
import axios from "axios";
import { format, differenceInMinutes, parseISO } from 'date-fns';
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
                <tbody >
                    <tr>
                        <td>
                            {
                                item.legs.map((leg, legIndex) => (



                                    <Accordion.Item eventKey={itemIndex}>
                                        <Accordion.Header>
                                            <tr className="d-flex justify-content-between">
                                                <td style={{ width: 125 }} className="d-flex" >{leg.origin.city}</td>
                                                <td style={{ width: 175 }} className="d-flex" >{format(leg.departure, "MMMM d hh:mm aa")}</td>
                                                <td style={{ width: 100 }} className="d-flex" >{formatMinutesToHoursMinutesCustom(leg.durationInMinutes)}</td>
                                                <td style={{ width: 100 }} className="d-flex" >{leg.stopCount == 0 ? "Direct" : leg.stopCount + " Stop(s)"}</td>
                                                <td style={{ width: 125 }} className="d-flex" >{leg.destination.city}</td>
                                                <td style={{ width: 175 }} className="d-flex" >{format(leg.arrival, "MMMM d hh:mm aa")}</td>
                                                <td style={{ width: 250 }} className="d-flex" >{leg.carriers.marketing[0].name}
                                                    <img style={{ width: 30, paddingLeft: 10 }} src={leg.carriers.marketing[0].logoUrl}></img>
                                                </td>
                                            </tr>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {
                                                leg.stopCount > 0
                                                    ? leg.segments.map((segment, segmentIndex) => (
                                                        <>

                                                            <tr className="d-flex justify-content-between">
                                                                <td style={{ width: 25 }} className="d-flex" >{segment.origin.displayCode}</td>
                                                                <td style={{ width: 150 }} className="d-flex" >{format(segment.departure, "MMMM d hh:mm aa")}</td>
                                                                <td style={{ width: 50 }} className="d-flex" >{formatMinutesToHoursMinutesCustom(segment.durationInMinutes)}</td>
                                                                <td style={{ width: 50 }} className="d-flex" >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-plane">
                                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3z" />
                                                                    </svg>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                                                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                                                    </svg>
                                                                </td>
                                                                <td style={{ width: 50 }} className="d-flex" >{segment.destination.displayCode}</td>
                                                                <td style={{ width: 150 }} className="d-flex" > {format(segment.arrival, "MMMM d hh:mm aa")}</td>
                                                                <td style={{ width: 200 }} className="d-flex" >{segment.operatingCarrier.name}</td>
                                                                <td style={{ width: 50 }} className="d-flex" >#{segment.flightNumber}</td>
                                                            </tr>
                                                            {

                                                                leg.segments[segmentIndex + 1] ?
                                                                    <tr className="d-flex justify-content-between">
                                                                        <td className="d-flex" ></td>
                                                                        <td className="d-flex" ></td>
                                                                        <td className="d-flex" ></td>
                                                                        <td style={{ color: "red" }} className="d-flex" > {formatMinutesToHoursMinutesCustom(differenceInMinutes(parseISO(leg.segments[segmentIndex + 1].departure), parseISO(segment.arrival)))}</td>
                                                                        <td className="d-flex" ></td>
                                                                        <td className="d-flex" ></td>
                                                                        <td className="d-flex" ></td>
                                                                        <td className="d-flex" ></td>



                                                                    </tr>
                                                                    :
                                                                    ""
                                                            }
                                                        </>
                                                    ))
                                                    : ""
                                            }
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))
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