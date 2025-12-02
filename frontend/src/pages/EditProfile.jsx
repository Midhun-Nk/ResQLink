import React, { useState, useRef, useEffect } from "react";
import { DropdownField, InputField } from "../components/common/InputField";
import { User, Mail, Phone, Droplet, ArrowRight, Camera, MapPin } from "lucide-react";
import { Country, State, City } from "country-state-city";
import axios from "axios";

const EditProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || "");
  const [profileImage, setProfileImage] = useState(user?.profile || "");

  // LOCATION FIELDS (Now fetched correctly from user.location)
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
          location: {
            country,
            state,
            city,
            street,
            pincode
          }
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
    <div className="flex items-center justify-center p-6 bg-slate-50">
      <div className="glass-panel w-full p-10 rounded-3xl shadow-xl border border-white/40">

        {/* Profile Upload */}
        <div className="flex justify-center mb-8">
          <div
            onClick={() => fileRef.current.click()}
            className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 shadow cursor-pointer group"
          >
            <img
              src={profileImage || "https://i.ibb.co/4pDNDk1/avatar.png"}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Camera size={28} className="text-white" />
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <h1 className="text-4xl font-bold mb-1 text-slate-900">Edit Profile</h1>
        <p className="text-slate-600 mb-10">Update your personal details.</p>

        <div className="space-y-5">

          <InputField icon={User} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" />
          <InputField icon={Mail} value={email} disabled placeholder="Email (Cannot change)" />

          {/* ROW 1 → Phone + Blood Group */}
          <div className="grid grid-cols-2 gap-5">
            <InputField icon={Phone} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone Number" />

            <DropdownField
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

          {/* ⭐ LOCATION (2-row layout) */}

          {/* ROW 1 → Country + State */}
          <div className="grid grid-cols-2 gap-5">
            <DropdownField
              icon={MapPin}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              options={Country.getAllCountries().map(c => ({ label: c.name, value: c.isoCode }))}
            />

            <DropdownField
              icon={MapPin}
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              options={states.map(s => ({ label: s.name, value: s.isoCode }))}
            />
          </div>

          {/* ROW 2 → City + Street */}
          <div className="grid grid-cols-2 gap-5">
            <DropdownField
              icon={MapPin}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              options={cities.map(ct => ({ label: ct.name, value: ct.name }))}
            />

            <InputField
              icon={MapPin}
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street"
            />
          </div>

          {/* ROW 3 → Pincode */}
          <InputField
            icon={MapPin}
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Pincode"
          />

          <button
            onClick={handleUpdate}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition flex items-center justify-center"
          >
            Save Changes <ArrowRight size={20} className="ml-2" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default EditProfile;
