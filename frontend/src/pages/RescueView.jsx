import { Plus } from "lucide-react";
import { rescueTeamsData } from "../assets/data";
import { RescueTeamCard } from "../components/RescueTeamCard";

export const RescueView = () => (
  <div className="animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h4 className="text-xl font-bold text-gray-900">Rescue Teams & Channels</h4>
      <button className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors shadow-sm">
        <Plus size={18} /> Deploy New Unit
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {rescueTeamsData.map(team => <RescueTeamCard key={team.id} team={team} />)}
    </div>
  </div>
);
