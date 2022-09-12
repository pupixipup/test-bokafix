import React, { useEffect, useState } from 'react'
import './Map.css';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

type MapProp = google.maps.Map | null;
type CenterCoordinates = google.maps.LatLngLiteral | google.maps.LatLng | undefined;
interface ILocationResponse extends Response {
  plus_code: {
    compound_code: string,
    global_code: string
  }
  global_code: string
}

const initialLocation = { lat: 57.7412801, lng: 14.131976 };

function getRandomInRange(from: number, to: number) {
  return (Math.random() * (to - from) + from);
}

function Map() {
  const [zoom, setZoom] = useState(11);
  const [manualCenter, setManualCenter] = useState<CenterCoordinates>(initialLocation);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(initialLocation);
  const [mapRef, setMapRef] = useState<MapProp>(null);
  const [visitedPlaces, setVisitedPlaces] = useState<string[]>([]);
  const { isLoaded } = useLoadScript( {
    googleMapsApiKey: "AIzaSyANzx1HF-2J9wd5FBeNY4yv0PQfBhJraIQ"
    // Insert API key here (Or you can use mine, I don't mind)
  });

  function updatePlaces(newCenter: google.maps.LatLngLiteral) {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${newCenter.lat},${newCenter.lng}&key=AIzaSyANzx1HF-2J9wd5FBeNY4yv0PQfBhJraIQ`)
        .then((data) =>  data.json())
        .then((json: ILocationResponse) => {
          const newPlace = json.plus_code.compound_code || json.plus_code.global_code;
          if (!visitedPlaces.includes(newPlace)) {
            setVisitedPlaces([...visitedPlaces, newPlace]);
          }
        });
  }

  const handleCenterChanged = () => {
    if (mapRef) {       
      const newCenter = mapRef.getCenter()!.toJSON();
      setCenter(newCenter);
    }
  };

  const successCallback = (position: GeolocationPosition) => {
    setManualCenter(({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    } 
    ));
  };

  const errorCallback = (error: GeolocationPositionError) => {
    alert('Please, turn on your location');
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  useEffect(() => {
  updatePlaces(manualCenter as google.maps.LatLngLiteral);
  }, [manualCenter]);

  return isLoaded ? (
    <div className='map'>
      <div className="map__wrapper">
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
          setZoom(11);
          navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      }} className="map__btn btn-purple">Bring me back home</button>
      </div>
      <h4 className="map__position">
        Latitude: {center.lat.toFixed(2)}, Longtitude: {center.lng.toFixed(2)}
      </h4>
      </div>
      <div className="map__places">
      {visitedPlaces.map((place, index) => {
        return(
          <div className='map__places-item' key={`${place}-${index}`}>{place}</div>
          )
        })}
        </div>
    </div>
  ) : <div>Error occured. Please, try to reload the page</div>
}

export default Map