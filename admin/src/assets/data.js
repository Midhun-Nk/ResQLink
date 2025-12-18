// --- Mock Data: Disaster Management ---

export const dashboardData = {
  incidents: [
    { name: 'Mon', reported: 12, resolved: 8 },
    { name: 'Tue', reported: 19, resolved: 15 },
    { name: 'Wed', reported: 8, resolved: 12 },
    { name: 'Thu', reported: 24, resolved: 20 },
    { name: 'Fri', reported: 15, resolved: 18 },
    { name: 'Sat', reported: 10, resolved: 9 },
    { name: 'Sun', reported: 30, resolved: 25 },
  ],
  evacuation: [
    { time: '06:00', safe: 1200, pending: 3800 },
    { time: '09:00', safe: 2500, pending: 2500 },
    { time: '12:00', safe: 3800, pending: 1200 },
    { time: '15:00', safe: 4500, pending: 500 },
    { time: '18:00', safe: 4800, pending: 200 },
  ],
  severityDistribution: [
    { name: 'Critical', value: 30, color: '#ef4444' },
    { name: 'Moderate', value: 45, color: '#f97316' },
    { name: 'Low', value: 25, color: '#3b82f6' },
  ]
};




export const rescueTeamsData = [
  { id: 101, name: "Alpha Squad", type: "Flood Rescue", status: "Deployed", capacity: "20 Boats", image: "https://images.unsplash.com/photo-1599468962656-b09772b2d28f?auto=format&fit=crop&q=80&w=300&h=200", location: "Sector 4" },
  { id: 102, name: "Bravo Medics", type: "Medical Unit", status: "Standby", capacity: "5 Ambulances", image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=300&h=200", location: "Base Camp" },
  { id: 103, name: "Charlie Fire", type: "Firefighters", status: "Active", capacity: "3 Trucks", image: "https://images.unsplash.com/photo-1563821262-e64fc5a95f53?auto=format&fit=crop&q=80&w=300&h=200", location: "Sector 2" },
  { id: 104, name: "Delta Air", type: "Airlift Support", status: "Maintenance", capacity: "2 Choppers", image: "https://images.unsplash.com/photo-1452509133926-2b180c6d6245?auto=format&fit=crop&q=80&w=300&h=200", location: "Heliport" },
];

export const alertsData = [
  { id: "A-2901", title: "Flash Flood Warning", area: "Riverside District", severity: "Critical", time: "10 mins ago", type: "Flood", affected: "2.5k People" },
  { id: "A-2902", title: "Heavy Rainfall", area: "Northern Hills", severity: "Moderate", time: "1 hour ago", type: "Weather", affected: "500 People" },
  { id: "A-2903", title: "Landslide Risk", area: "Highway 9", severity: "Low", time: "3 hours ago", type: "Geological", affected: "Road Closed" },
];


// --- Configuration & Assets ---

export const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1454789476662-53eb23ba5907?q=80&w=2552&auto=format&fit=crop",
    title: "RAPID RESPONSE",
    subtitle: "Real-time deployment tracking.",
    coords: "34.0522° N, 118.2437° W",
    status: "ACTIVE"
  },
  {
    url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2670&auto=format&fit=crop",
    title: "GLOBAL MONITOR",
    subtitle: "Satellite-based prediction.",
    coords: "51.5074° N, 0.1278° W",
    status: "SCANNING"
  },
  {
    url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2670&auto=format&fit=crop",
    title: "RESILIENCE NET",
    subtitle: "Local network authorization.",
    coords: "35.6762° N, 139.6503° E",
    status: "SECURE"
  }
];
