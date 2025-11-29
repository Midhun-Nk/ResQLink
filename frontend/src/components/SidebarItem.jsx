import { ChevronRight } from "lucide-react";
import { useState } from "react";



export const SidebarItem = ({ 
  icon: Icon, 
  label, 
  activeId, 
  isExpanded, 
  onToggle, 
  onSelect, 
  subItems = [], 
  isSidebarCollapsed 
}) => {
  const safeSubItems = subItems || [];
  const hasSub = safeSubItems.length > 0;
  
  const isParentActive = hasSub 
    ? (isExpanded || safeSubItems.some(sub => sub.id === activeId) || activeId === label)
    : activeId === label;

  const [isHovered, setIsHovered] = useState(false);

  const handleMainClick = (e) => {
    if (hasSub && !isSidebarCollapsed) {
      if (onToggle) onToggle();
    } else {
      if (onSelect) onSelect(label);
    }
  };

  return (
    <div 
      className="mb-1 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Item Click Area */}
      <div 
        className={`flex items-center p-3 cursor-pointer select-none rounded-xl transition-all duration-200 h-[50px]
          ${isParentActive ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}
          ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between'}
        `}
        onClick={handleMainClick}
      >
        <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
          {Icon && <Icon size={20} className={isSidebarCollapsed && isParentActive ? 'text-white' : ''} />}
          {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
        </div>
        {!isSidebarCollapsed && hasSub && (
          <ChevronRight size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'rotate-0'}`} />
        )}
      </div>
      
      {/* 1. Standard Dropdown */}
      {!isSidebarCollapsed && hasSub && isExpanded && (
        <div className="mt-1 mb-2 animate-in slide-in-from-top-2 duration-300">
          {safeSubItems.map((sub) => (
             <div 
               key={sub.id}
               onClick={(e) => { 
                 e.stopPropagation(); 
                 if(onSelect) onSelect(sub.id); 
               }}
               className={`py-2 px-3 ml-4 cursor-pointer block rounded-lg text-sm transition-colors duration-200
                 ${activeId === sub.id ? 'text-red-600 font-bold' : 'text-gray-500 hover:text-red-600'}`}
             >
               {sub.label}
             </div>
          ))}
        </div>
      )}

      {/* 2. Floating Hover Menu */}
      {isSidebarCollapsed && isHovered && (
        <div 
          className="absolute bg-white shadow-xl rounded-xl border border-gray-100 z-50"
          style={{ 
            left: '100%', 
            top: 0, 
            width: '220px', 
            marginLeft: '8px' 
          }}
        >
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
            <span className="font-bold text-red-600">{label}</span>
          </div>
          <div className="py-1">
            {hasSub ? (
              safeSubItems.map((sub) => (
                <div 
                  key={sub.id}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if(onSelect) onSelect(sub.id); 
                  }}
                  className={`px-4 py-2 cursor-pointer block text-sm transition-colors
                    ${activeId === sub.id ? 'text-red-600 bg-red-50 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {sub.label}
                </div>
              ))
            ) : (
              <div 
                  onClick={() => { if(onSelect) onSelect(label); }}
                  className={`px-4 py-2 cursor-pointer block text-sm transition-colors
                    ${activeId === label ? 'text-red-600 bg-red-50 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {label}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
