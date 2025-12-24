import React from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import { icon } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './LeafltetOverrides.scss';

const markerIcon = icon({
  iconUrl: '/marker.png',
});

export const MapWrapper = ({ position }) => {
  if (position) {
    return (
      <MapContainer center={position} zoom={17} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker icon={markerIcon} position={position} />
      </MapContainer>
    );
  }

  return (
    <MapContainer center={[0, 0]} zoom={0}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};
