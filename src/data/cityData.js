const coreCities = [
  {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    coords: [23.2599, 77.4126],
    avgTemp: 25.1,
    greenCover: 35,
    floodRisk: 'Moderate',
    aqi: 85,
    riskLevel: 'Medium',
    zones: [
      { id: 'z1', name: 'Arera Colony', coords: [23.2100, 77.4300], temp: 24.5, greenCover: 45, area: 500, popDensity: 120 },
      { id: 'z2', name: 'Bairagarh', coords: [23.2700, 77.3500], temp: 26.2, greenCover: 20, area: 400, popDensity: 250 },
      { id: 'z3', name: 'Govindpura', coords: [23.2500, 77.4500], temp: 27.5, greenCover: 15, area: 600, popDensity: 300 },
      { id: 'z4', name: 'Kolar Road', coords: [23.1800, 77.4100], temp: 24.8, greenCover: 40, area: 800, popDensity: 150 },
    ],
    history: [
      { year: 2010, greenCover: 42, event: 'Rapid Urbanization begins' },
      { year: 2015, greenCover: 38, event: 'Industrial expansion' },
      { year: 2020, greenCover: 36, event: 'New ring road construction' },
      { year: 2024, greenCover: 35, event: 'Current baseline' },
    ]
  },
  {
    id: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    coords: [22.7196, 75.8577],
    avgTemp: 24.8,
    greenCover: 12,
    floodRisk: 'Low',
    aqi: 110,
    riskLevel: 'High',
    zones: [
      { id: 'z1', name: 'Vijay Nagar', coords: [22.7500, 75.8900], temp: 26.5, greenCover: 8, area: 450, popDensity: 400 },
      { id: 'z2', name: 'Rajwada', coords: [22.7100, 75.8500], temp: 27.8, greenCover: 5, area: 300, popDensity: 600 },
      { id: 'z3', name: 'Bicholi Mardana', coords: [22.7000, 75.9200], temp: 24.2, greenCover: 25, area: 700, popDensity: 100 },
      { id: 'z4', name: 'Rau', coords: [22.6400, 75.8100], temp: 24.5, greenCover: 20, area: 900, popDensity: 120 },
    ],
    history: [
      { year: 2010, greenCover: 20, event: 'Cleanest city initiative start' },
      { year: 2015, greenCover: 15, event: 'Commercial boom' },
      { year: 2020, greenCover: 13, event: 'Metrorail project start' },
      { year: 2024, greenCover: 12, event: 'Current baseline' },
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'NCR',
    coords: [28.6139, 77.2090],
    avgTemp: 27.5,
    greenCover: 21,
    floodRisk: 'High',
    aqi: 240,
    riskLevel: 'Extreme',
    zones: [
      { id: 'z1', name: 'Connaught Place', coords: [28.6300, 77.2200], temp: 29.5, greenCover: 10, area: 500, popDensity: 500 },
      { id: 'z2', name: 'Chanakyapuri', coords: [28.5900, 77.1800], temp: 25.8, greenCover: 45, area: 600, popDensity: 100 },
      { id: 'z3', name: 'Okhla', coords: [28.5500, 77.2700], temp: 30.2, greenCover: 8, area: 700, popDensity: 450 },
      { id: 'z4', name: 'Rohini', coords: [28.7100, 77.1200], temp: 28.5, greenCover: 15, area: 1200, popDensity: 350 },
    ],
    history: [
      { year: 2010, greenCover: 18, event: 'Commonwealth Games' },
      { year: 2015, greenCover: 19, event: 'Massive plantation drives' },
      { year: 2020, greenCover: 20, event: 'Central Vista redevelopment' },
      { year: 2024, greenCover: 21, event: 'Current baseline' },
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    coords: [12.9716, 77.5946],
    avgTemp: 23.5,
    greenCover: 18,
    floodRisk: 'High',
    aqi: 75,
    riskLevel: 'High',
    zones: [
      { id: 'z1', name: 'Indiranagar', coords: [12.9700, 77.6400], temp: 24.2, greenCover: 15, area: 400, popDensity: 350 },
      { id: 'z2', name: 'Cubbon Park Area', coords: [12.9700, 77.5900], temp: 22.1, greenCover: 60, area: 300, popDensity: 80 },
      { id: 'z3', name: 'Whitefield', coords: [12.9600, 77.7500], temp: 25.5, greenCover: 10, area: 1500, popDensity: 280 },
      { id: 'z4', name: 'Electronic City', coords: [12.8500, 77.6600], temp: 25.0, greenCover: 12, area: 1200, popDensity: 200 },
    ],
    history: [
      { year: 2010, greenCover: 32, event: 'Silicon Valley Peak' },
      { year: 2015, greenCover: 25, event: 'Lakes encroachment issues' },
      { year: 2020, greenCover: 20, event: 'Infrastructure boom' },
      { year: 2024, greenCover: 18, event: 'Current baseline' },
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    coords: [19.0760, 72.8777],
    avgTemp: 27.2,
    greenCover: 13,
    floodRisk: 'Extreme',
    aqi: 120,
    riskLevel: 'Extreme',
    zones: [
      { id: 'z1', name: 'Colaba', coords: [18.9100, 72.8200], temp: 26.5, greenCover: 8, area: 300, popDensity: 550 },
      { id: 'z2', name: 'Sanjay Gandhi NP', coords: [19.2200, 72.9100], temp: 23.5, greenCover: 85, area: 10000, popDensity: 10 },
      { id: 'z3', name: 'Bandra', coords: [19.0500, 72.8300], temp: 27.8, greenCover: 12, area: 500, popDensity: 500 },
      { id: 'z4', name: 'Kurla', coords: [19.0700, 72.8800], temp: 29.5, greenCover: 5, area: 400, popDensity: 700 },
    ],
    history: [
      { year: 2010, greenCover: 16, event: 'Metro line 1 construction' },
      { year: 2015, greenCover: 15, event: 'Coastal road project start' },
      { year: 2020, greenCover: 14, event: 'Aarey Forest controversies' },
      { year: 2024, greenCover: 13, event: 'Current baseline' },
    ]
  }
];

const regionalCitySeeds = [
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', coords: [23.0225, 72.5714] },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', coords: [26.9124, 75.7873] },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', coords: [26.8467, 80.9462] },
  { id: 'patna', name: 'Patna', state: 'Bihar', coords: [25.5941, 85.1376] },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', coords: [22.5726, 88.3639] },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', coords: [13.0827, 80.2707] },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', coords: [17.385, 78.4867] },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', coords: [9.9312, 76.2673] },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', coords: [20.2961, 85.8245] },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', coords: [26.1445, 91.7362] },
  { id: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', coords: [31.1048, 77.1734] },
  { id: 'srinagar', name: 'Srinagar', state: 'Jammu and Kashmir', coords: [34.0837, 74.7973] },
  { id: 'ranchi', name: 'Ranchi', state: 'Jharkhand', coords: [23.3441, 85.3096] },
  { id: 'raipur', name: 'Raipur', state: 'Chhattisgarh', coords: [21.2514, 81.6296] },
  { id: 'amritsar', name: 'Amritsar', state: 'Punjab', coords: [31.634, 74.8723] },
  { id: 'dehradun', name: 'Dehradun', state: 'Uttarakhand', coords: [30.3165, 78.0322] },
  { id: 'panaji', name: 'Panaji', state: 'Goa', coords: [15.4909, 73.8278] },
  { id: 'agartala', name: 'Agartala', state: 'Tripura', coords: [23.8315, 91.2868] },
  { id: 'imphal', name: 'Imphal', state: 'Manipur', coords: [24.817, 93.9368] },
  { id: 'aizawl', name: 'Aizawl', state: 'Mizoram', coords: [23.7271, 92.7176] },
  { id: 'kohima', name: 'Kohima', state: 'Nagaland', coords: [25.6751, 94.1086] },
  { id: 'itanagar', name: 'Itanagar', state: 'Arunachal Pradesh', coords: [27.0844, 93.6053] },
  { id: 'shillong', name: 'Shillong', state: 'Meghalaya', coords: [25.5788, 91.8933] },
  { id: 'gangtok', name: 'Gangtok', state: 'Sikkim', coords: [27.3389, 88.6065] },
  { id: 'port-blair', name: 'Port Blair', state: 'Andaman and Nicobar', coords: [11.6234, 92.7265] },
  { id: 'leh', name: 'Leh', state: 'Ladakh', coords: [34.1526, 77.5771] },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Chandigarh', coords: [30.7333, 76.7794] },
  { id: 'puducherry', name: 'Puducherry', state: 'Puducherry', coords: [11.9416, 79.8083] },
  { id: 'daman', name: 'Daman', state: 'Daman and Diu', coords: [20.3974, 72.8328] },
  { id: 'kavaratti', name: 'Kavaratti', state: 'Lakshadweep', coords: [10.5667, 72.6417] }
];

const buildRegionalCity = (seed, idx) => {
  const [lat, lng] = seed.coords;
  const baseGreen = 12 + (idx % 25);
  return {
    ...seed,
    avgTemp: Number((22 + (idx % 9) * 0.9).toFixed(1)),
    greenCover: baseGreen,
    floodRisk: idx % 3 === 0 ? 'High' : idx % 3 === 1 ? 'Moderate' : 'Low',
    aqi: 70 + (idx % 9) * 12,
    riskLevel: idx % 4 === 0 ? 'Extreme' : idx % 2 === 0 ? 'High' : 'Medium',
    zones: [
      { id: `${seed.id}-z1`, name: `${seed.name} Core`, coords: [lat + 0.02, lng + 0.02], temp: 26.2, greenCover: Math.max(8, baseGreen - 6), area: 500, popDensity: 420 },
      { id: `${seed.id}-z2`, name: `${seed.name} Green Belt`, coords: [lat - 0.03, lng + 0.01], temp: 24.1, greenCover: Math.min(80, baseGreen + 14), area: 850, popDensity: 180 },
      { id: `${seed.id}-z3`, name: `${seed.name} Industrial`, coords: [lat + 0.01, lng - 0.03], temp: 28.4, greenCover: Math.max(6, baseGreen - 8), area: 700, popDensity: 380 },
      { id: `${seed.id}-z4`, name: `${seed.name} Periphery`, coords: [lat - 0.02, lng - 0.02], temp: 25.3, greenCover: Math.min(75, baseGreen + 8), area: 1100, popDensity: 160 },
    ],
    history: [
      { year: 2010, greenCover: Math.min(85, baseGreen + 10), event: 'Urban baseline observed' },
      { year: 2014, greenCover: Math.min(85, baseGreen + 6), event: 'Transport expansion' },
      { year: 2018, greenCover: Math.max(5, baseGreen + 2), event: 'Development pressure increases' },
      { year: 2021, greenCover: Math.max(5, baseGreen), event: 'Mitigation efforts initiated' },
      { year: 2024, greenCover: Math.max(5, baseGreen - 1), event: 'Current baseline' },
    ],
  };
};

export const cities = [...coreCities, ...regionalCitySeeds.map(buildRegionalCity)];
