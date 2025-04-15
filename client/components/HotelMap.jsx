import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

function HotelMap(props) {
    const { searchResults } = props;

    /*const customIcon = {
        url: '../markerIcon/54272.png',
        scaledSize: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(15, 15),
        
      };*/


    return (
        <>
            {
                searchResults?.results?.hotelsRegion ?

                    <APIProvider apiKey="AIzaSyB5A7Hdx5kv0ShvpTWDfLXpjiG6vpnAwH4">
                        <Map
                            style={{ width: 500, height: 500}}
                            defaultCenter={{ lat: searchResults.results.hotelsRegion.latitude, lng: searchResults.results.hotelsRegion.longitude }}
                            defaultZoom={12}
                            gestureHandling={'greedy'}
                            disableDefaultUI={true}
                        >
                            {
                                searchResults.results.hotelsCoordinates.map((hotel, hotelIndex) => (
                                    <Marker position={{ lat: hotel.latitude, lng: hotel.longitude }} label={hotel.price}></Marker>
                                ))
                            }
                            
                        </Map>
                    </APIProvider>
                    :
                    ""
            }
        </>
    )
}

export default HotelMap;