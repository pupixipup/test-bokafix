import React from 'react'
type MapProp = google.maps.Map | null;
type CenterCoordinates = google.maps.LatLngLiteral | google.maps.LatLng | undefined;

function Map() {
  return (
    <div>Map</div>
  )
}

export default Map