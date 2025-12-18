import { MoreHorizontal } from "lucide-react";

export const StatCard = ({ title, children, actions }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full">
    <div className="p-6 h-full">
      <div className="flex justify-between items-start mb-6">
        <h5 className="text-lg font-bold text-gray-900">{title}</h5>
        {actions && <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>}
      </div>
      {children}
    </div>
  </div>
);
