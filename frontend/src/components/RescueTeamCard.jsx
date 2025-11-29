import { MapPin, Navigation, Radio } from "lucide-react";

export const RescueTeamCard = ({ team }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Deployed': return 'bg-red-100 text-red-700';
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Standby': return 'bg-yellow-100 text-yellow-700';
      case 'Maintenance': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full hover:shadow-md transition-shadow">
      <div className="relative h-48">
         <img src={team.image} alt={team.name} className="w-full h-full object-cover" />
         <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(team.status)}`}>
           {team.status}
         </span>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h5 className="font-bold text-gray-900 text-lg">{team.name}</h5>
            <p className="text-gray-500 text-sm">{team.type}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6 text-gray-600 text-sm">
           <MapPin size={16} />
           <span>{team.location}</span>
           <span className="mx-2">•</span>
           <span>{team.capacity}</span>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-full text-sm font-medium hover:bg-red-50 transition-colors">
             <Radio size={16} /> Contact
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors">
             <Navigation size={16} /> Track
          </button>
        </div>
      </div>
    </div>
  );
};
