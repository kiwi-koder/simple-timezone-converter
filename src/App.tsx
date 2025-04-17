import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Mock data for cities and their timezones
const MOCK_CITIES = [
  { id: 1, name: 'New York', timezone: 'America/New_York' },
  { id: 2, name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { id: 3, name: 'Chicago', timezone: 'America/Chicago' },
  { id: 4, name: 'London', timezone: 'Europe/London' },
  { id: 5, name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { id: 6, name: 'Sydney', timezone: 'Australia/Sydney' },
  { id: 7, name: 'Dubai', timezone: 'Asia/Dubai' },
  { id: 8, name: 'Paris', timezone: 'Europe/Paris' },
];

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCity, setSelectedCity] = useState('');
  const [cityTimezone, setCityTimezone] = useState('');
  const [convertedTime, setConvertedTime] = useState<string>('');

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = MOCK_CITIES.find(city => city.name === event.target.value);
    if (city) {
      setSelectedCity(city.name);
      setCityTimezone(city.timezone);
    }
  };

  useEffect(() => {
    if (cityTimezone) {
      // Convert the time to the selected timezone
      const options: Intl.DateTimeFormatOptions = {
        timeZone: cityTimezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
      
      const converted = selectedDate.toLocaleString('en-US', options);
      setConvertedTime(converted);
    }
  }, [selectedDate, cityTimezone]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Time Zone Converter
          </h1>
          <p className="text-lg text-gray-600">
            Schedule meetings across different time zones
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Local Date and Time
                </label>
                <div className="relative">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date || new Date())}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    id="date-picker"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="city-selector" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Participant's City
                </label>
                <select
                  id="city-selector"
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">Select a city</option>
                  {MOCK_CITIES.map(city => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {cityTimezone && (
                  <p className="mt-2 text-sm text-gray-600">
                    Participant's Timezone: {cityTimezone}
                  </p>
                )}
              </div>

              {convertedTime && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Meeting Time in {selectedCity}</h3>
                  <p className="text-2xl font-semibold text-blue-600">
                    {convertedTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
