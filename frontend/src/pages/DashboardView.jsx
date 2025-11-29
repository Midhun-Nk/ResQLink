import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { LiveDisasterMap } from '../components/LiveDisasterMap';
import { dashboardData } from '../assets/data';
import { StatCard } from '../components/StatCard';


export const DashboardView = () => (
  <div className="animate-in fade-in duration-500">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">Disaster Command Center</h3>
        <p className="text-gray-500">Live Situation Monitoring System</p>
      </div>
      <div className="flex gap-6 items-center">
         <div className="text-right">
           <h4 className="text-xl font-bold text-red-600">3</h4>
           <span className="text-gray-400 text-xs uppercase tracking-wider">Critical Alerts</span>
         </div>
         <div className="w-px h-10 bg-gray-200"></div>
         <div className="text-right">
           <h4 className="text-xl font-bold text-green-600">12</h4>
           <span className="text-gray-400 text-xs uppercase tracking-wider">Teams Deployed</span>
         </div>
      </div>
    </div>

    {/* Live Map Section */}
    <div className="mb-6">
       <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold text-gray-900">Live Crisis Map</h4>
          <button className="text-sm text-blue-600 font-medium hover:underline">View Fullscreen</button>
       </div>
       <LiveDisasterMap />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Evacuation Progress Chart */}
      <StatCard title="Evacuation Progress" actions>
        <div className="flex gap-6 mb-6">
           <div>
             <p className="text-gray-400 text-xs mb-1">Evacuated</p>
             <h4 className="text-xl font-bold text-green-600">4,800</h4>
           </div>
           <div>
             <p className="text-gray-400 text-xs mb-1">Pending</p>
             <h4 className="text-xl font-bold text-orange-500">200</h4>
           </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dashboardData.evacuation}>
              <defs>
                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis hide />
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Area type="monotone" dataKey="safe" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorSafe)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </StatCard>

      {/* Incident Distribution Pie Chart */}
      <StatCard title="Incident Severity">
         <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie
                     data={dashboardData.severityDistribution}
                     innerRadius={60}
                     outerRadius={100}
                     paddingAngle={5}
                     dataKey="value"
                  >
                     {dashboardData.severityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                  </Pie>
                  <RechartsTooltip />
               </PieChart>
            </ResponsiveContainer>
            {/* Legend Overlay */}
            <div className="absolute">
               <div className="text-center">
                  <span className="text-3xl font-bold text-gray-900">100%</span>
                  <p className="text-xs text-gray-500 uppercase">Total</p>
               </div>
            </div>
         </div>
         <div className="flex justify-center gap-4 mt-[-20px]">
            {dashboardData.severityDistribution.map((item) => (
               <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></span>
                  <span className="text-xs text-gray-600">{item.name}</span>
               </div>
            ))}
         </div>
      </StatCard>
    </div>
  </div>
);
