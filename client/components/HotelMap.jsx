import { APIProvider, Map, Marker, InfoWindow, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import MapHover from './MapHover';

function HotelMap(props) {
    const { searchResults } = props;

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        console.log("toggle open called")
        setIsOpen(!isOpen);
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
                                    <AdvancedMarker onMouseLeave={() => toggleOpen()} onMouseEnter={() => toggleOpen()} onClick={() => window.location.hash = hotel.id} position={{ lat: hotel.latitude, lng: hotel.longitude }}>
                                        <div style={{
                                            height: 25,
                                            width: 50,
                                            backgroundColor: "#000000",
                                            borderRadius: 50,
                                            display: 'flex',
                                            color: "white",
                                            justifyContent: 'center',
                                            alignItems: 'center'}}>
                                        <span style={{ fontSize: 10 }}>{hotel.price}</span>
                                    </div>
                                        
                                    </AdvancedMarker>

                        ))


                            }
                        {isOpen && (
                            <InfoWindow

                            >
                                <div style={{ position: "fixed" }}>
                                    hello
                                </div>
                            </InfoWindow>
                        )}


                    </Map>
                    </APIProvider >
                    :
    ""
}
        </>
    )
}

export default HotelMap;