import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Heart, ShieldCheck, Activity, Users, CreditCard, ArrowRight, TrendingUp 
} from 'lucide-react';

// --- Mock Data for the Chart ---
const donationData = [
  { name: 'Day 1', amount: 4000 },
  { name: 'Day 2', amount: 12000 },
  { name: 'Day 3', amount: 8000 },
  { name: 'Day 4', amount: 25000 },
  { name: 'Day 5', amount: 18000 },
  { name: 'Day 6', amount: 45000 },
  { name: 'Today', amount: 52000 },
];

const DonatePage = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- Configuration ---
  // In a real app, fetch these from your backend
  const stats = {
    totalRaised: 164500,
    goal: 500000,
    donors: 1240,
    daysLeft: 14
  };

  const progressPercentage = (stats.totalRaised / stats.goal) * 100;

  // --- Razorpay Handler ---
  const handleDonation = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    // 1. Create Order: In production, fetch this from YOUR backend
    // const data = await fetch('/api/payment/order', { method: 'POST' ... })
    // const order = await data.json();
    
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Replace with Test Key ID
      amount: amount * 100, // Amount is in paise
      currency: "INR",
      name: "Disaster Relief Fund",
      description: "Contribution for Flood Relief",
      image: "https://yourdomain.com/logo.png",
      // order_id: order.id, // Generate this from backend
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        // Call backend to verify signature here
        setIsLoading(false);
        setAmount('');
      },
      prefill: {
        name: "Midhun NK", // Pre-fill user details if logged in
        email: "midhun@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#059669" // Emerald-600 to match UI
      }
    };

    const rzp1 = new window.Razorpay(options);
    
    rzp1.on('payment.failed', function (response){
        alert(response.error.description);
        setIsLoading(false);
    });

    rzp1.open();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      
      {/* --- Header Section --- */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <ShieldCheck size={20} />
              <span className="font-semibold text-sm uppercase tracking-wider">Official Relief Fund</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Disaster Recovery Initiative</h1>
            <p className="text-slate-500 mt-2 max-w-xl">
              Urgent funds required for medical supplies, food packets, and temporary shelter. 
              Every rupee is tracked transparently.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                    <Activity size={20} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 font-medium">Status</p>
                    <p className="text-sm font-bold text-emerald-600">Active / High Priority</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Left Column: Stats & Chart (2/3 width) --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm font-medium mb-1">Total Raised</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{stats.totalRaised.toLocaleString()}</h3>
              <div className="flex items-center gap-1 text-emerald-500 text-xs mt-2 font-medium">
                <TrendingUp size={14} />
                <span>+12% from yesterday</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm font-medium mb-1">Donors Count</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.donors}</h3>
               <div className="flex items-center gap-1 text-blue-500 text-xs mt-2 font-medium">
                <Users size={14} />
                <span>Active Community</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm font-medium mb-1">Funding Goal</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{stats.goal.toLocaleString()}</h3>
              <p className="text-slate-400 text-xs mt-2">{stats.daysLeft} days remaining</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">Fund Flow Analytics</h3>
              <select className="bg-slate-50 border-none text-sm text-slate-600 rounded-lg p-2 cursor-pointer focus:ring-2 focus:ring-emerald-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationData}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#059669', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- Right Column: Donation Action (1/3 width) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100 sticky top-10">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart fill="currentColor" size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Make an Impact</h2>
              <p className="text-sm text-slate-500 mt-1">Your contribution directly supports relief operations.</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-emerald-700">{progressPercentage.toFixed(1)}% Funded</span>
                <span className="text-slate-400">Target: ₹{(stats.goal/1000)}k</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Enter Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2000"
                  className="w-full pl-8 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 5000].map((val) => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className="py-2 text-sm font-medium rounded-lg border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleDonation}
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? 'Processing...' : (
                  <>
                    <CreditCard size={20} />
                    Donate Now
                  </>
                )}
              </button>
            </div>

            {/* Security Note */}
            <div className="mt-6 flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
               <ShieldCheck size={16} className="text-slate-400 shrink-0 mt-1" />
               <p className="text-xs text-slate-500">
                 Payments are secured by Razorpay. All donations are eligible for tax exemption receipts.
               </p>
            </div>
          </div>
        </div>

      </div>

      {/* --- Footer / Recent Activity --- */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <h4 className="font-semibold text-slate-700">Recent Contributions</h4>
           <button className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
             View all transactions <ArrowRight size={16}/>
           </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
           {/* Mock Recent Donors */}
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs">
                  {['JD', 'AS', 'MK', 'RL'][i-1]}
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-800">Anonymous</p>
                   <p className="text-xs text-slate-500">Donated ₹{500 * i}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

    </div>
  );
};

export default DonatePage;