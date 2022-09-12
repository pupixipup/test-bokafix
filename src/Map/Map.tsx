import React from 'react'
type MapProp = google.maps.Map | null;
type CenterCoordinates = google.maps.LatLngLiteral | google.maps.LatLng | undefined;

function Map() {
  return (
    <div>Map</div>
  )
  const [manualCenter, setManualCenter] = useState<CenterCoordinates>(initialLocation);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(initialLocation);
  const [mapRef, setMapRef] = useState<MapProp>(null);
  const { isLoaded } = useLoadScript( {
    googleMapsApiKey: "AIzaSyC9Uo2nW7gUCxz6bMQaCqS2Png6FQN2hlQ"
    // Insert API key here
  });

  const handleCenterChanged = () => {
    if (mapRef) {       
      const newCenter = mapRef.getCenter()!.toJSON();
      setCenter(newCenter);
    }
  };

  return isLoaded ? (
    <div className='map'>
      <h3 className='map__title'>Map project</h3>
      <GoogleMap
      zoom={zoom}
      center={manualCenter}
      onLoad={ (map) => { setMapRef(map)} }
      onCenterChanged={handleCenterChanged}
      mapContainerClassName='mapContainer'
      />
      <h4 className="map__position">
        Latitude: {center.lat.toFixed(2)}, Longtitude: {center.lng.toFixed(2)}
      </h4>
    </div>
  ) : <div>Error occured. Please, try to reload the page</div>
}

export default Map