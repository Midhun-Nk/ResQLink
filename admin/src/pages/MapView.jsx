import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

// This sub-component handles the live logic
function DynamicRouting({ destination }) {
  const map = useMap();
  const [routingControl, setRoutingControl] = useState(null);

  useEffect(() => {
    if (!map) return;

    // 1. Initialize the Routing Control
    const control = L.Routing.control({
      waypoints: [
        null, // Start will be set by Geolocation
        destination
      ],
      lineOptions: {
        styles: [{ color: "#4285F4", weight: 5 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: true
    }).addTo(map);

    setRoutingControl(control);

    // 2. Start watching user position
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const userLocation = L.latLng(latitude, longitude);

        // Update the FIRST waypoint (Start) to your current location
        control.setWaypoints([
          userLocation,
          destination
        ]);

        // Smoothly pan to keep user in view
        map.panTo(userLocation);
      },
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      map.removeControl(control);
    };
  }, [map, destination]);

  return null;
}

export default function MapView() {
  const destination = L.latLng(11.4401756, 75.7661471); // Pune/Destination

  return (
    <MapContainer center={[11.42, 75.70]} zoom={13} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <DynamicRouting destination={destination} />
    </MapContainer>
  );
}

