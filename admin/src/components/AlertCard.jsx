import { 
   AlertTriangle,  
   Map as MapIcon, Clock,
  MapPin, Users,

} from 'lucide-react';
export const AlertCard = ({ alert }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow">
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-2/3">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center
                ${alert.severity === 'Critical' ? 'bg-red-100 text-red-600' : 
                  alert.severity === 'Moderate' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                <AlertTriangle size={32} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-bold text-lg text-gray-900">{alert.title}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold
                  ${alert.severity === 'Critical' ? 'bg-red-100 text-red-700' : 
                    alert.severity === 'Moderate' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                   {alert.severity}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-1 flex items-center gap-2"><MapPin size={14}/> {alert.area}</p>
              <div className="text-gray-400 text-xs flex items-center gap-4">
                 <span className="flex items-center gap-1"><Clock size={12} /> {alert.time}</span>
                 <span className="font-bold text-gray-700 flex items-center gap-1"><Users size={12} /> {alert.affected}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 flex justify-end">
           <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-2 border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50">Details</button>
              <button className="flex-1 md:flex-none px-6 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700">Deploy Unit</button>
           </div>
        </div>
      </div>
    </div>
  </div>
);
