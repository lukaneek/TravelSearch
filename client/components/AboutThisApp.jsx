

function AboutThisApp() {
    return (
        <div style={{width: 1300}}>
            <h3>About this page</h3>
            <p style={{fontSize: 15}}>This hotel and flight search app integrates the Skyscanner and Google Maps APIs to help you find the best deals on flights and accommodations worldwide.
                It uses a CI/CD pipeline via GitHub and is deployed on two separate EC2 instances—one hosting the React-based frontend, and the other running the Java-based backend for handling API requests.
                Any changes pushed to the repository are automatically deployed, keeping the app up to date in real time.
            </p>

                <a target="_blank" href="https://github.com/lukaneek/TravelSearch">Link To This Applications Repository</a>
        </div>
    )
}

export default AboutThisApp;