import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icon for marker
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationPicker = ({ onSave }) => {
  const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 }); // Default position
  const [radius, setRadius] = useState(500); // Default radius in meters

  // Handle map click to update marker position
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return position === null ? null : <Marker position={position} icon={customIcon} />;
  };

  return (
    <div>
      <h2>Set Location Boundary</h2>
      <div style={{ height: "400px" }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
          <Circle center={position} radius={radius} />
        </MapContainer>
      </div>
      <div>
        <label>
          Radius (meters):
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </label>
        <button
          onClick={() =>
            onSave({
              latitude: position.lat,
              longitude: position.lng,
              radius_meters: radius,
            })
          }
        >
          Save Boundary
        </button>
      </div>
    </div>
  );
};

export default LocationPicker;
