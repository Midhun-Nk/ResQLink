export const InputField = ({ icon: Icon, type, placeholder, value, onChange, disabled }) => (
  <div className={`relative mb-5 group ${disabled && "opacity-60"}`}>
    
    {/* Icon */}
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
      <Icon size={18} className="text-slate-400 transition-colors duration-300" />
    </div>

    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-xl text-slate-800 placeholder-slate-400 
        transition-all shadow-sm
        ${disabled 
          ? "border-slate-200 bg-slate-100 cursor-not-allowed"
          : "border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        }
      `}
    />

    {/* Glow only when not disabled */}
    {!disabled && (
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0
                      group-focus-within:from-orange-500/5 group-focus-within:via-orange-500/10 group-focus-within:to-orange-500/5 
                      pointer-events-none transition-all duration-500" />
    )}
  </div>
);



export const DropdownField = ({ icon: Icon, placeholder, value, onChange, options = [], disabled }) => (
  <div className={`relative mb-5 group ${disabled && "opacity-60"}`}>
    
    {/* Icon */}
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
      <Icon size={18} className="text-slate-400 transition-colors duration-300" />
    </div>

    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full pl-11 pr-10 py-3.5 bg-white border rounded-xl text-slate-800 appearance-none
        transition-all shadow-sm cursor-pointer
        ${disabled 
          ? "border-slate-200 bg-slate-100 cursor-not-allowed"
          : "border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        }
      `}
    >
      <option value="" disabled hidden>{placeholder}</option>
      {options.map((item, i) => (
        <option key={i} value={item.value}>{item.label}</option>
      ))}
    </select>

    {/* Glow visible only if NOT disabled */}
    {!disabled && (
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0
                      group-focus-within:from-orange-500/5 group-focus-within:via-orange-500/10 group-focus-within:to-orange-500/5
                      pointer-events-none transition-all duration-500" />
    )}

    {/* Dropdown arrow */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
      ▼
    </div>
  </div>
);
