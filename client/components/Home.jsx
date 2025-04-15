import FlightHome from "./FlightHome";
import HotelHome from "./HotelHome";

function Home(props) {
    const { token } = props;

    return (
        <>
            <h1>Luka's Travel Search</h1>
            <div className="d-flex justify-content-center mx-auto">

                <div style={{ width: 1100 }}>
                    <ul class="nav nav-tabs nav-fill" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="flight-tab" data-bs-toggle="tab" data-bs-target="#flight" type="button" role="tab" aria-controls="flight" aria-selected="true">Flight Search</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="hotel-tab" data-bs-toggle="tab" data-bs-target="#hotel" type="button" role="tab" aria-controls="hotel" aria-selected="false">Hotel Search</button>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="flight" role="tabpanel" aria-labelledby="flight-tab"><FlightHome token={token} /></div>
                        <div class="tab-pane fade" id="hotel" role="tabpanel" aria-labelledby="hotel-tab"><HotelHome token={token} /></div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Home;