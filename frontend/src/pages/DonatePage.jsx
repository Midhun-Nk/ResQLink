import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Heart, ShieldCheck, Activity, Users, CreditCard, ArrowRight, TrendingUp, Loader 
} from 'lucide-react';

// Configure your API Base URL
const API_BASE = `${import.meta.env.VITE_API_URL}/donations`; 

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID; // Replace with your actual Test Key ID

const DonatePage = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Dynamic State for Dashboard
  const [stats, setStats] = useState({
    totalRaised: 0,
    donors: 0,
    chartData: [],
    recentDonations: []
  });

  const GOAL = 500000; // Static Campaign Goal

  // --- 1. Fetch Data on Component Mount ---
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/stats`);
      
      // Transform chart data if necessary or use defaults if empty
      const chartData = res.data.chartData.length > 0 
        ? res.data.chartData 
        : [{ name: 'Start', amount: 0 }];

      setStats({
        totalRaised: Number(res.data.totalRaised),
        donors: Number(res.data.totalDonors),
        chartData: chartData,
        recentDonations: res.data.recentDonations
      });
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setIsPageLoading(false);
    }
  };

  // --- 2. Handle Donation Payment Flow ---
  const handleDonation = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    setIsLoading(true);

    try {
      // Step A: Create Order on Backend
      const orderUrl = `${API_BASE}/create-order`;
      const { data } = await axios.post(orderUrl, { 
        amount: amount,
        donorName: "Supporter" // You could add a name input field later
      });

      // Step B: Configure Razorpay Options
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: data.amount, // Amount is in paise
        currency: "INR",
        name: "Disaster Recovery Fund",
        description: "Donation for Relief Operations",
        image: "https://cdn-icons-png.flaticon.com/512/4577/4577278.png", // Optional Logo
        order_id: data.id, // Order ID from backend
        
        // Step C: Handle Success
        handler: async function (response) {
          try {
            // Verify Payment on Backend
            await axios.post(`${API_BASE}/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            alert("Payment Successful! Thank you for your support.");
            setAmount('');
            fetchStats(); // Refresh dashboard to show new total
          } catch (err) {
            console.error(err);
            alert("Payment Verification Failed. Please contact support.");
          }
        },
        prefill: {
          name: "Anonymous Donor",
          email: "donor@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#10b981", // Emerald Green
        },
      };

      // Step D: Open Razorpay
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp1.open();
      
    } catch (err) {
      console.error("Payment initiation failed", err);
      alert("Could not initiate payment. Check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = Math.min((stats.totalRaised / GOAL) * 100, 100);

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#050505] text-slate-500">
        <Loader className="animate-spin mr-2" /> Loading Campaign Data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-gray-200 font-sans p-6 md:p-12 transition-colors duration-300">
      
      {/* --- Header Section --- */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
              <ShieldCheck size={20} />
              <span className="font-bold text-sm uppercase tracking-wider">Official Relief Fund</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Disaster Recovery Initiative</h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-2 max-w-xl text-lg">
              Urgent funds required for medical supplies, food packets, and temporary shelter. 
              Every rupee is tracked transparently.
            </p>
          </div>
          <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 flex items-center gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2.5 rounded-full text-emerald-600 dark:text-emerald-400">
                    <Activity size={24} />
                </div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider">Status</p>
                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">Active / High Priority</p>
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
            <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
              <p className="text-slate-500 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Total Raised</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">₹{stats.totalRaised.toLocaleString()}</h3>
              <div className="flex items-center gap-1 text-emerald-500 text-xs mt-2 font-bold">
                <TrendingUp size={14} />
                <span>Live Data</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
              <p className="text-slate-500 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Donors Count</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats.donors}</h3>
               <div className="flex items-center gap-1 text-blue-500 text-xs mt-2 font-bold">
                <Users size={14} />
                <span>Active Community</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10">
              <p className="text-slate-500 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Funding Goal</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">₹{(GOAL/1000).toFixed(0)}k</h3>
              <p className="text-slate-400 dark:text-zinc-600 text-xs mt-2 font-medium">14 days remaining</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Fund Flow Analytics</h3>
              <div className="text-xs text-slate-500 font-bold bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
                Last 7 Days
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a', color: '#fff' }}
                    itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                    formatter={(value) => [`₹${value}`, 'Amount']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- Right Column: Donation Action (1/3 width) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl shadow-xl border border-emerald-100 dark:border-emerald-500/20 sticky top-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50/50 dark:ring-emerald-500/5">
                <Heart fill="currentColor" size={36} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Make an Impact</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 font-medium">Your contribution directly supports relief operations.</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-emerald-700 dark:text-emerald-400">{progressPercentage.toFixed(1)}% Funded</span>
                <span className="text-slate-400 dark:text-zinc-600">Goal: ₹{(GOAL/1000).toFixed(0)}k</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Donation Amount</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 font-bold text-lg">₹</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2000"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-300 dark:placeholder:text-zinc-700"
                />
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 5000].map((val) => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className="py-2.5 text-sm font-bold rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 transition-all"
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleDonation}
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} /> Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    DONATE NOW
                  </>
                )}
              </button>
            </div>

            {/* Security Note */}
            <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
               <ShieldCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
               <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
                 Payments secured by <strong>Razorpay</strong>. 100% Secure & Encrypted. Tax exemption available.
               </p>
            </div>
          </div>
        </div>

      </div>

      {/* --- Footer / Recent Activity --- */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
           <h4 className="font-bold text-slate-700 dark:text-zinc-300">Recent Contributions</h4>
           <button className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
             View all transactions <ArrowRight size={16}/>
           </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
           {stats.recentDonations && stats.recentDonations.length > 0 ? (
             stats.recentDonations.map((donor, i) => (
               <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    {donor.donorName ? donor.donorName.substring(0, 2).toUpperCase() : 'AN'}
                  </div>
                  <div>
                     <p className="text-sm font-bold text-slate-800 dark:text-white">{donor.donorName || 'Anonymous'}</p>
                     <p className="text-xs text-slate-500 dark:text-zinc-500 font-mono">Donated ₹{Number(donor.amount).toLocaleString()}</p>
                  </div>
               </div>
             ))
           ) : (
             <div className="col-span-full text-center text-slate-400 py-4">No recent donations. Be the first!</div>
           )}
        </div>
      </div>

    </div>
  );
};

export default DonatePage;