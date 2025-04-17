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
  const [localDate, setLocalDate] = useState(new Date());
  const [participantDate, setParticipantDate] = useState<Date | null>(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [cityTimezone, setCityTimezone] = useState('');
  const [isLocalChange, setIsLocalChange] = useState(false);

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = MOCK_CITIES.find(city => city.name === event.target.value);
    if (city) {
      setSelectedCity(city.name);
      setCityTimezone(city.timezone);
      // When city changes, update participant's time based on local time
      setIsLocalChange(true);
    }
  };

  const handleLocalDateChange = (date: Date) => {
    setLocalDate(date);
    setIsLocalChange(true);
  };

  const handleParticipantDateChange = (date: Date | null) => {
    if (date) {
      setParticipantDate(date);
      setIsLocalChange(false);
    }
  };

  useEffect(() => {
    if (cityTimezone) {
      if (isLocalChange) {
        // Convert local time to participant's timezone
        const options: Intl.DateTimeFormatOptions = {
          timeZone: cityTimezone,
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        };
        
        const converted = new Date(localDate.toLocaleString('en-US', { timeZone: cityTimezone }));
        setParticipantDate(converted);
      } else if (participantDate) {
        // Convert participant's time to local time
        const options: Intl.DateTimeFormatOptions = {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        };
        
        const converted = new Date(participantDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
        setLocalDate(converted);
      }
    }
  }, [localDate, participantDate, cityTimezone, isLocalChange]);

  const formatTime = (date: Date, timezone: string) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Time Zone Converter
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Schedule meetings across different time zones
          </p>
          
          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">The Vibe Coding Story</h2>
            <p className="text-gray-700 mb-3">
              Born from a 3 AM coding session fueled by coffee and existential dread, this app was created when its developer missed yet another international meeting due to timezone confusion. "I'm not a timezone expert," they said, "I'm just a developer who's tired of explaining why I'm 3 hours late to every call."
            </p>
            <p className="text-gray-700">
              Built with pure vibes and a sprinkle of sleep-deprived genius, this tool aims to save you from the eternal embarrassment of scheduling meetings at 3 AM for your Australian colleagues. Because nothing says "I value your time" like getting the timezone right on the first try.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="space-y-8">
              <div className="text-center">
                <label htmlFor="local-date-picker" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Local Date and Time
                </label>
                <div className="relative max-w-md mx-auto">
                  <DatePicker
                    selected={localDate}
                    onChange={(date: Date | null) => handleLocalDateChange(date || new Date())}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-center"
                    id="local-date-picker"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Your Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </p>
              </div>

              <div className="text-center">
                <label htmlFor="city-selector" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Participant's City
                </label>
                <div className="max-w-md mx-auto">
                  <select
                    id="city-selector"
                    value={selectedCity}
                    onChange={handleCityChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-center"
                  >
                    <option value="">Select a city</option>
                    {MOCK_CITIES.map(city => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                {cityTimezone && (
                  <p className="mt-2 text-sm text-gray-600">
                    Participant's Timezone: {cityTimezone}
                  </p>
                )}
              </div>

              {cityTimezone && participantDate && (
                <div className="text-center">
                  <label htmlFor="participant-date-picker" className="block text-sm font-medium text-gray-700 mb-2">
                    Participant's Date and Time in {selectedCity}
                  </label>
                  <div className="relative max-w-md mx-auto">
                    <DatePicker
                      selected={participantDate}
                      onChange={handleParticipantDateChange}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-center"
                      id="participant-date-picker"
                    />
                  </div>
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
