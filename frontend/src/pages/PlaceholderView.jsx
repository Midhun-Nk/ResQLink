
export const PlaceholderView = ({ title, icon: Icon, color = "text-gray-300" }) => (
  <div className="animate-in fade-in duration-500">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center flex flex-col items-center">
       {Icon && <Icon size={64} className={`${color} mb-6`} />}
       <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
       <p className="text-gray-500 max-w-md mx-auto">This module is connected to the central grid and will display real-time data when online.</p>
       <button className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800">Refresh Connection</button>
    </div>
  </div>
);