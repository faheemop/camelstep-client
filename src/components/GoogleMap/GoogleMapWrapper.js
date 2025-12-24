import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_MAP_API_KEY } from '../../config';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const riyadhCenter = { lat: 24.7136, lng: 46.6753 };

export const GoogleMapWrapper = ({ position, onLocationSelect }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAP_API_KEY,
    });

    const [markerPosition, setMarkerPosition] = useState(position || null);

    const defaultCenter = position || riyadhCenter;
    const zoomLevel = position ? 17 : 10;

    const handleMapClick = useCallback(
        (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            const clickedPosition = { lat, lng };
            setMarkerPosition(clickedPosition);

            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: clickedPosition }, (results, status) => {
                if (status === "OK" && results[0]) {
                    const fullAddress = results[0].formatted_address;

                    onLocationSelect({
                        fullAddress,
                        lat,
                        lng,
                    });
                }
            });
        },
        [onLocationSelect]
    );

    if (!isLoaded) {
        return <LoadingSpinner />
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={zoomLevel}
            onClick={handleMapClick}
            options={{ scrollwheel: true }}
        >
            {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
    );
};
