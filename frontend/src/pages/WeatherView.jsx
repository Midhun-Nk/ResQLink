import { CloudRain, Droplets, Thermometer, Wind } from "lucide-react";

export const WeatherView = () => (
  <div className="animate-in fade-in duration-500">
    <h4 className="text-xl font-bold text-gray-900 mb-6">Live Weather Analysis</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Weather Card */}
      <div className="md:col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-bold mb-2">Heavy Rain</h2>
            <p className="text-blue-100">Riverside District • Monday, 12:00 PM</p>
          </div>
          <CloudRain size={64} className="text-blue-200" />
        </div>
        <div className="mt-12 flex items-end gap-4">
          <h1 className="text-6xl font-bold">24°</h1>
          <p className="mb-2 text-xl text-blue-100">Precipitation: 90%</p>
        </div>
      </div>

      {/* Weather Stats */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="bg-orange-100 p-3 rounded-full text-orange-600"><Thermometer size={24}/></div>
           <div><p className="text-gray-500 text-sm">Temperature</p><h4 className="font-bold text-lg">24°C</h4></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Wind size={24}/></div>
           <div><p className="text-gray-500 text-sm">Wind Speed</p><h4 className="font-bold text-lg">18 km/h</h4></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="bg-cyan-100 p-3 rounded-full text-cyan-600"><Droplets size={24}/></div>
           <div><p className="text-gray-500 text-sm">Humidity</p><h4 className="font-bold text-lg">82%</h4></div>
        </div>
      </div>
    </div>
  </div>
);
