import React, { useState } from 'react';

function MapHover(props) {
    const { searchResults } = props;
    const { hotelIndex } = props;

    return (
        <div style={{position: "fixed"}}>
           
            {searchResults.results.hotelCards[hotelIndex].name}
                
        </div>
    )
}

export default MapHover;