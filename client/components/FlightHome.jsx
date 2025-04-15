import React, { useState } from "react";
import Loading from "./Loading";
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import FlightItem from "./FlightItem";
import MultiCity from "./MultiCity";
import OneWayRoundTrip from "./OneWayRoundTrip";

function FlightHome(props) {
    const { token } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState({});
    const [searchResultToken, setSearchResultToken] = useState("");
    const [isMultyCity, setIsMultiCity] = useState(false);



    return (
        <>
            <div style={{ width: 1000, paddingTop: 30}} className="d-flex justify-content-start mx-auto">
                <a class="link-offset-2 link-underline link-underline-opacity-0" href="#" onClick={() => setIsMultiCity(!isMultyCity)}>
                    {
                        isMultyCity == false ? "Create a multi city route" : "Switch to one-way or roundtrip"
                    }
                </a>
            </div>
            {
                isMultyCity == false ?
                    <OneWayRoundTrip setSearchResults={setSearchResults} setSearchResultToken={setSearchResultToken} setIsLoading={setIsLoading} token={token} />
                    :
                    <MultiCity setSearchResults={setSearchResults} setSearchResultToken={setSearchResultToken} setIsLoading={setIsLoading} token={token} />
            }
            <div style={{ paddingTop: 50 }} className="d-flex justify-content-center mx-auto">
                {
                    isLoading ? <Loading /> :

                        <div style={{ width: 1100 }}>

                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                {
                                    searchResults?.itineraries?.buckets && searchResults.itineraries.buckets.map((bucket, bucketIndex) => (
                                        <li class="nav-item" role="presentation">
                                            <button class={bucketIndex == 0 ? "nav-link active" : "nav-link"} id={`${bucket.name}-tab`} data-bs-toggle="tab" data-bs-target={`#${bucket.name}`} type="button" role="tab" aria-controls={bucket.name} aria-selected="true">{bucket.name}</button>
                                        </li>
                                    ))
                                }
                            </ul>
                            <div class="tab-content" id="myTabContent">
                                {
                                    searchResults?.itineraries?.buckets && searchResults.itineraries.buckets.map((bucket, bucketIndex) => (
                                        <div class={bucketIndex == 0 ? "tab-pane fade show active" : "tab-pane fade"} id={bucket.name} role="tabpanel" aria-labelledby={`${bucket.name}-tab`}>
                                            <Table>
                                                <tbody>
                                                    <tr>
                                                        <Accordion>
                                                            {
                                                                bucket.items.map((item, itemIndex) => (
                                                                    <FlightItem item={item} itemIndex={itemIndex} token={searchResultToken} />
                                                                ))
                                                            }
                                                        </Accordion>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>

                                    ))
                                }
                            </div>
                        </div>
                }
            </div >
        </>
    )
}

export default FlightHome;