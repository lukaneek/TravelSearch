import { APIProvider, Map, Marker, InfoWindow, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import MapHover from './MapHover';

function HotelMap(props) {
    const { searchResults } = props;
    const { hotelHover } = props;

    const [openInfoWindowId, setOpenInfoWindowId] = useState(null);

    const toggleOpen = (markerId) => {
        console.log("in " + markerId)
        setOpenInfoWindowId(markerId)
    };
    const toggleClose = (markerId) => {
        console.log("out " + markerId)
        setOpenInfoWindowId(null)
    };

    return (
        <>
            {
                searchResults?.results?.hotelsRegion ?

                    <APIProvider apiKey="AIzaSyB5A7Hdx5kv0ShvpTWDfLXpjiG6vpnAwH4">
                        <Map
                            mapId='hotelMap'
                            style={{ width: 550, height: 600 }}
                            defaultCenter={{ lat: searchResults.results.hotelsRegion.latitude, lng: searchResults.results.hotelsRegion.longitude }}
                            defaultZoom={12}
                            gestureHandling={'greedy'}
                            disableDefaultUI={true}
                        >
                            {
                                searchResults.results.hotelsCoordinates.map((hotel, hotelIndex) => (
                                    <>
                                        <AdvancedMarker onClick={() => window.location.hash = hotel.id} position={{ lat: hotel.latitude, lng: hotel.longitude }}>
                                            <div onMouseLeave={() => toggleClose(hotel.id)} onMouseEnter={() => toggleOpen(hotel.id)} style={{
                                                height: hotelHover != hotel.id ? 25 : 30,
                                                width: hotelHover != hotel.id ? 50 : 60,
                                                backgroundColor: hotelHover != hotel.id ?  "#000000" : "#0047AB",
                                                borderRadius: 50,
                                                display: 'flex',
                                                color: "white",
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <b style={{ fontSize: 15 }}>{hotel.price}</b>
                                            </div>

                                        </AdvancedMarker>
                                        {openInfoWindowId == hotel.id ?
                                            <InfoWindow headerDisabled={true} position={{ lat: hotel.latitude + 0.0015, lng: hotel.longitude }}>
                                                <div>
                                                    {searchResults.results.hotelCards[hotelIndex].name}
                                                </div>
                                            </InfoWindow>


                                            :
                                            ""
                                        }
                                    </>
                                ))


                            }



                        </Map>
                    </APIProvider >
                    :
                    ""
            }
        </>
    )
}

export default HotelMap;