import React, { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, Droplet, ArrowRight, Camera, MapPin, ChevronDown } from "lucide-react";
import { Country, State, City } from "country-state-city";
import axios from "axios";

// --- CUSTOM STYLED COMPONENTS FOR ONYX THEME ---

const CustomInputField = ({ icon: Icon, value, onChange, placeholder, disabled, type = "text" }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors">
      <Icon size={20} />
    </div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`
        w-full pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all font-medium
        bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400
        dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-zinc-600
        focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
        disabled:opacity-60 disabled:cursor-not-allowed
      `}
    />
  </div>
);

const CustomDropdownField = ({ icon: Icon, value, onChange, options, placeholder }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors">
      <Icon size={20} />
    </div>
    <select
      value={value}
      onChange={onChange}
      className={`
        w-full pl-12 pr-10 py-3.5 rounded-xl outline-none transition-all font-medium appearance-none cursor-pointer
        bg-slate-50 border border-slate-200 text-slate-900
        dark:bg-[#111] dark:border-white/10 dark:text-white
        focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
      `}
    >
      <option value="" disabled className="text-slate-400">{placeholder}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
      <ChevronDown size={16} />
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const EditProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || "");
  const [profileImage, setProfileImage] = useState(user?.profile || "");

  // LOCATION FIELDS
  const [country, setCountry] = useState(user?.location?.country || "");
  const [state, setState] = useState(user?.location?.state || "");
  const [city, setCity] = useState(user?.location?.city || "");
  const [street, setStreet] = useState(user?.location?.street || "");
  const [pincode, setPincode] = useState(user?.location?.pincode || "");

  // Dynamic dropdown data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (country) setStates(State.getStatesOfCountry(country));
    if (country && state) setCities(City.getCitiesOfState(country, state));
  }, [country, state]);

  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/v1/auth/update-profile",
        {
          fullName,
          phoneNumber,
          bloodGroup,
          profile: profileImage,
          location: { country, state, city, street, pincode }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert("Profile Updated Successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Update Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-slate-50 dark:bg-[#050505] transition-colors duration-500">
      
      {/* Abstract Background Glow for Dark Mode */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className={`
        relative w-full max-w-3xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl backdrop-blur-xl transition-all
        bg-white border border-slate-200
        dark:bg-[#0a0a0a]/90 dark:border-white/10 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]
      `}>

        {/* Profile Upload */}
        <div className="flex flex-col items-center mb-10">
          <div
            onClick={() => fileRef.current.click()}
            className="relative w-36 h-36 rounded-full p-1 border-2 border-dashed border-slate-300 dark:border-white/20 cursor-pointer group hover:border-blue-500 transition-colors"
          >
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <img
                src={profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                alt="Profile"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <Camera size={32} className="text-white drop-shadow-md" />
              </div>
            </div>
            {/* Online Indicator */}
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-[#0a0a0a] rounded-full"></div>
          </div>
          
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleImageChange}
            className="hidden"
          />
          
          <div className="text-center mt-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Profile</h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-1">Keep your personal details up to date.</p>
          </div>
        </div>

        <div className="space-y-6">

          {/* Personal Info */}
          <div className="space-y-6">
            <CustomInputField icon={User} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" />
            <CustomInputField icon={Mail} value={email} disabled placeholder="Email Address" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInputField icon={Phone} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
              
              <CustomDropdownField
                icon={Droplet}
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
                placeholder="Blood Group"
                options={[
                  { label: "A+", value: "A+" }, { label: "A-", value: "A-" },
                  { label: "B+", value: "B+" }, { label: "B-", value: "B-" },
                  { label: "O+", value: "O+" }, { label: "O-", value: "O-" },
                  { label: "AB+", value: "AB+" }, { label: "AB-", value: "AB-" }
                ]}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-white/5 my-2"></div>

          {/* Location Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest pl-1">Location Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomDropdownField
                icon={MapPin}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                options={Country.getAllCountries().map(c => ({ label: c.name, value: c.isoCode }))}
              />

              <CustomDropdownField
                icon={MapPin}
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                options={states.map(s => ({ label: s.name, value: s.isoCode }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomDropdownField
                icon={MapPin}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                options={cities.map(ct => ({ label: ct.name, value: ct.name }))}
              />

              <CustomInputField
                icon={MapPin}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode / Zip"
              />
            </div>

            <CustomInputField
              icon={MapPin}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street Address / Landmark"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleUpdate}
            className={`
              w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] mt-4
              bg-slate-900 text-white hover:bg-slate-800
              dark:bg-white dark:text-black dark:hover:bg-zinc-200
            `}
          >
            Save Changes <ArrowRight size={20} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default EditProfile;