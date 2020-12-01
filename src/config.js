function airData() {
  return [
    {
      date: 'Mon, Nov 23',
      averagePM: Math.random() * 24,
    },
    {
      date: 'Tue, Nov 24',
      averagePM: Math.random() * 24,
    },
    {
      date: 'Wed, Nov 25',
      averagePM: Math.random() * 24,
    },
    {
      date: 'Thu, Nov 26',
      averagePM: Math.random() * 24,
    },
    {
      date: 'Fri, Nov 27',
      averagePM: Math.random() * 24,
    },
    {
      date: 'Sat, Nov 28',
      averagePM: Math.random() * 24,
    },
    {
      date: 'Sun, Nov 29',
      averagePM: Math.random() * 24,
    },
    {
      date: 'Mon, Nov 30',
      averagePM: Math.random() * 24,
    },
  ];
}

const config = {
  airData: { name: 'Kenya', data: airData() },
  multiAirData: [
    { name: 'Kenya', data: airData() },
    { name: 'Accra', data: airData() },
    { name: 'Lagos', data: airData() },
  ],
};

export default config;
