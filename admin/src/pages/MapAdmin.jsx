import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Save, Trash2, MapPin, AlertTriangle, ShieldCheck, Loader } from 'lucide-react';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const VITE_API_URL_PYTHON = import.meta.env.VITE_API_URL_PYTHON;

const API_URL = `${VITE_API_URL_PYTHON}/map-locations/`;

// Helper component to handle map clicks
function LocationMarker({ onLocationSelected }) {
  useMapEvents({
    click(e) {
      onLocationSelected(e.latlng);
    },
  });
  return null;
}

export default function MapAdmin() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPos, setSelectedPos] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_type: 'danger',
    radius: 1000
  });

  // --- FETCH DATA ---
  const fetchLocations = async () => {
    try {
      const res = await axios.get(API_URL);
      setLocations(res.data);
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchLocations(); }, []);

  // --- HANDLERS ---
  const handleMapClick = (latlng) => {
    setSelectedPos(latlng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPos) return alert("Please click on the map to set a location");

    try {
      await axios.post(API_URL, {
        ...formData,
        latitude: selectedPos.lat,
        longitude: selectedPos.lng
      });
      fetchLocations();
      setSelectedPos(null);
      setFormData({ title: '', description: '', location_type: 'danger', radius: 1000 });
    } catch (err) { alert("Failed to save location"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this zone?")) return;
    await axios.delete(`${API_URL}${id}/`);
    fetchLocations();
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-[#050505]">
      
      {/* Sidebar Form */}
      <div className="w-full md:w-[400px] p-6 bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-zinc-800 overflow-y-auto z-10 shadow-xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
          <MapPin className="text-blue-500"/> Zone Manager
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800">
          <h3 className="text-xs font-bold uppercase text-gray-500">Add New Zone</h3>
          
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-600 dark:text-gray-400">Title</label>
            <input required className="w-full p-2 rounded-lg border bg-white dark:bg-zinc-800 dark:border-zinc-700" 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Sector 7 Flood"/>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600 dark:text-gray-400">Type</label>
              <select className="w-full p-2 rounded-lg border bg-white dark:bg-zinc-800 dark:border-zinc-700"
                value={formData.location_type} onChange={e => setFormData({...formData, location_type: e.target.value})}>
                <option value="danger">Danger Zone</option>
                <option value="safe">Safe Haven</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600 dark:text-gray-400">Radius (m)</label>
              <input type="number" className="w-full p-2 rounded-lg border bg-white dark:bg-zinc-800 dark:border-zinc-700"
                value={formData.radius} onChange={e => setFormData({...formData, radius: e.target.value})} disabled={formData.location_type === 'safe'}/>
            </div>
          </div>

          {!selectedPos ? (
            <div className="text-xs text-amber-500 font-bold bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
              ⚠ Click map to set coordinates
            </div>
          ) : (
            <div className="text-xs text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded">
              ✓ Location Selected: {selectedPos.lat.toFixed(4)}, {selectedPos.lng.toFixed(4)}
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">
            <Save size={16} /> Save Zone
          </button>
        </form>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-gray-500">Existing Zones</h3>
          {locations.map(loc => (
            <div key={loc.id} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                {loc.location_type === 'danger' 
                  ? <AlertTriangle size={16} className="text-red-500"/> 
                  : <ShieldCheck size={16} className="text-emerald-500"/>}
                <div>
                  <div className="font-bold text-sm dark:text-gray-200">{loc.title}</div>
                  <div className="text-xs text-gray-400">{loc.location_type === 'danger' ? `Radius: ${loc.radius}m` : 'Safe Point'}</div>
                </div>
              </div>
              <button onClick={() => handleDelete(loc.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <MapContainer center={[10.8505, 76.2711]} zoom={10} style={{ height: "100%", width: "100%" }}>
          <TileLayer 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelected={handleMapClick} />
          
          {/* Temporary Marker for selection */}
          {selectedPos && <Marker position={selectedPos}></Marker>}

          {/* Existing Locations */}
          {locations.map(loc => (
            <React.Fragment key={loc.id}>
              <Marker position={[loc.latitude, loc.longitude]}>
                <Popup>
                  <strong>{loc.title}</strong><br/>{loc.description}
                </Popup>
              </Marker>
              {/* Draw Danger Radius */}
              {loc.location_type === 'danger' && (
                <Circle 
                  center={[loc.latitude, loc.longitude]} 
                  radius={loc.radius} 
                  pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }} 
                />
              )}
              {/* Draw Safe Zone (Small Green Circle) */}
              {loc.location_type === 'safe' && (
                <Circle 
                  center={[loc.latitude, loc.longitude]} 
                  radius={100} 
                  pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.4 }} 
                />
              )}
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}