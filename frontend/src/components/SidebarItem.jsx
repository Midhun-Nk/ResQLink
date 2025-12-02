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

  const handleMainClick = () => {
    if (hasSub && !isSidebarCollapsed) {
      onToggle && onToggle();
    } else {
      onSelect && onSelect(label);
    }
  };

  return (
    <div 
      className="mb-1 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* MAIN ITEM */}
      <div 
        className={`flex items-center p-3 cursor-pointer select-none rounded-xl transition-all duration-200 h-[50px]
          ${isParentActive ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}
          ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between'}
        `}
        onClick={handleMainClick}
      >
        <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
          {Icon && <Icon size={20} />}
          {!isSidebarCollapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
        </div>

        {!isSidebarCollapsed && hasSub && (
          <ChevronRight 
            size={16} 
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
          />
        )}
      </div>


      {/* =================== SUBMENU (FULL SIDEBAR) =================== */}
      {!isSidebarCollapsed && hasSub && isExpanded && (
        <div className="mt-1 mb-2 animate-in slide-in-from-top-2 duration-300">
          {safeSubItems.map((sub) => (
            <div 
              key={sub.id}
              onClick={(e) => { 
                e.stopPropagation(); 
                onSelect && onSelect(sub.id);
              }}
              className={`flex items-center gap-2 py-2 px-3 ml-4 cursor-pointer rounded-lg text-sm transition-all 
                ${activeId === sub.id ? 'text-red-600 font-bold' : 'text-gray-500 hover:text-red-600'}
              `}
            >
              {sub.icon && <sub.icon size={16} />}   {/* <-- SUB ICON HERE */}
              {sub.label}
            </div>
          ))}
        </div>
      )}


      {/* =================== HOVER MENU (COLLAPSED SIDEBAR) =================== */}
      {isSidebarCollapsed && isHovered && (
        <div 
          className="absolute bg-white shadow-xl rounded-xl border border-gray-100 z-50"
          style={{ left: "100%", top: 0, width: "220px", marginLeft: 8 }}
        >
          <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
            <span className="font-bold text-red-600">{label}</span>
          </div>

          <div className="py-1">
            {hasSub ? safeSubItems.map(sub => (
              <div
                key={sub.id}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onSelect && onSelect(sub.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-sm rounded-lg transition-all
                  ${activeId === sub.id ? 'text-red-600 font-bold bg-red-50' : 'hover:bg-gray-50'}
                `}
              >
                {sub.icon && <sub.icon size={16} />}  {/* <-- ICON ALSO HERE */}
                {sub.label}
              </div>
            )) : (
              <div 
                onClick={() => onSelect && onSelect(label)}
                className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-50 rounded-lg`}
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
