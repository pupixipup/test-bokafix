import React, { useState } from 'react'
import './Map.css';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

type MapProp = google.maps.Map | null;
type CenterCoordinates = google.maps.LatLngLiteral | google.maps.LatLng | undefined;

const initialLocation = { lat: 57.7412801, lng: 14.131976 };

function getRandomInRange(from: number, to: number) {
  return (Math.random() * (to - from) + from);
}

function Map() {
  const [zoom, setZoom] = useState(11);
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
      <div className="map__btns">
      <button onClick={() => {
        setManualCenter(({
          lat: getRandomInRange(-90, 90),
          lng: getRandomInRange(-180, 180),
        }))
        setZoom(6);
      }} className="map__btn btn-blue">Teleport me to somewhere random</button>
      <button onClick={() => {
          const successCallback = (position: GeolocationPosition) => {
            setManualCenter(({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            } 
            ));
          };
          setZoom(11);
          const errorCallback = (error: GeolocationPositionError) => {
            console.log(error);
          };
          navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      }} className="map__btn btn-purple">Bring me back home</button>
      </div>
      <h4 className="map__position">
        Latitude: {center.lat.toFixed(2)}, Longtitude: {center.lng.toFixed(2)}
      </h4>
    </div>
  ) : <div>Error occured. Please, try to reload the page</div>
}

export default Map