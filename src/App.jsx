import React, { useState } from 'react';
import './styles/globals.css';

import Sidebar from './components/Sidebar';
import Home from './pages/Home/Home';
import Plan from './pages/Plan/Plan';
import Itinerary from './pages/Itinerary/Itinerary';
import MapView from './pages/MapView/MapView';
import Budget from './pages/Budget/Budget';
import Checklists from './pages/Checklists/Checklists';
import Explore from './pages/Explore/Explore';
import Profile from './pages/Profile/Profile';

// Destination data with itineraries
const destinationData = {
  Manali: {
    name: 'Manali',
    location: 'Himachal Pradesh, India',
    emoji: '🏔️',
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    rating: '4.8',
    description: 'A picturesque hill station nestled in the Himalayas, known for adventure activities and stunning landscapes.',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Manali',
        activities: [
          { time: '8:00 AM', title: 'Arrival & Hotel Check-in', emoji: '🏨', desc: 'Arrive at Manali. Check-in to hotel and relax.' },
          { time: '2:00 PM', title: 'Explore Mall Road', emoji: '🛍️', desc: 'Visit the famous Mall Road for shopping and local eateries.' },
          { time: '6:00 PM', title: 'Sunset at Manu Temple', emoji: '🛕', desc: 'Visit Manu Temple for a peaceful evening with sunset views.' },
          { time: '8:00 PM', title: 'Dinner at Local Restaurant', emoji: '🍽️', desc: 'Enjoy Himachali cuisine at a local restaurant.' }
        ]
      },
      {
        day: 2,
        title: 'Adventure Day',
        activities: [
          { time: '7:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Early breakfast at hotel.' },
          { time: '9:00 AM', title: 'Paragliding at Solang Valley', emoji: '🪂', desc: 'Experience thrilling paragliding over meadows.' },
          { time: '2:00 PM', title: 'Lunch Break', emoji: '🥘', desc: 'Lunch at a riverside restaurant.' },
          { time: '4:00 PM', title: 'Ropeway Adventure', emoji: '🎢', desc: 'Enjoy the scenic ropeway at Solang Valley.' }
        ]
      },
      {
        day: 3,
        title: 'Trekking & Nature',
        activities: [
          { time: '6:00 AM', title: 'Early Start Trek', emoji: '🥾', desc: 'Begin trek to Beas Kund waterfall.' },
          { time: '11:00 AM', title: 'Waterfall Visit', emoji: '💧', desc: 'Reach beautiful Beas Kund waterfall.' },
          { time: '2:00 PM', title: 'Picnic Lunch', emoji: '🧺', desc: 'Enjoy packed lunch with nature views.' },
          { time: '5:00 PM', title: 'Return & Rest', emoji: '🛀', desc: 'Return to hotel and relax at spa.' }
        ]
      },
      {
        day: 4,
        title: 'Cultural Exploration',
        activities: [
          { time: '8:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Leisurely breakfast at hotel.' },
          { time: '10:00 AM', title: 'Hadimba Temple Tour', emoji: '⛩️', desc: 'Visit the ancient Hadimba Devi Temple.' },
          { time: '1:00 PM', title: 'Local Markets Tour', emoji: '🎁', desc: 'Explore local handicraft shops.' },
          { time: '6:00 PM', title: 'Evening Stroll', emoji: '🌅', desc: 'Walk around the town enjoying sunset.' }
        ]
      },
      {
        day: 5,
        title: 'Departure',
        activities: [
          { time: '8:00 AM', title: 'Breakfast & Packing', emoji: '☕', desc: 'Final breakfast and pack belongings.' },
          { time: '10:00 AM', title: 'Last Minute Shopping', emoji: '🎁', desc: 'Buy souvenirs and local specialties.' },
          { time: '12:00 PM', title: 'Check-out', emoji: '🚗', desc: 'Check-out from hotel.' },
          { time: '2:00 PM', title: 'Journey Back', emoji: '✈️', desc: 'Depart for return journey.' }
        ]
      }
    ]
  },
  Bali: {
    name: 'Bali',
    location: 'Bali, Indonesia',
    emoji: '🌴',
    gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    rating: '4.9',
    description: 'A tropical paradise with beautiful beaches, rice terraces, and vibrant culture.',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bali',
        activities: [
          { time: '10:00 AM', title: 'Airport Arrival', emoji: '✈️', desc: 'Arrive at Denpasar International Airport.' },
          { time: '12:00 PM', title: 'Hotel Check-in', emoji: '🏨', desc: 'Check-in to beachfront resort.' },
          { time: '3:00 PM', title: 'Beach Time', emoji: '🏖️', desc: 'Relax on the sandy beaches of Bali.' },
          { time: '7:00 PM', title: 'Dinner with Ocean View', emoji: '🍽️', desc: 'Enjoy dinner overlooking the ocean.' }
        ]
      },
      {
        day: 2,
        title: 'Water Sports & Beach',
        activities: [
          { time: '7:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Breakfast buffet at resort.' },
          { time: '9:00 AM', title: 'Surfing Lessons', emoji: '🏄', desc: 'Learn surfing from professional instructors.' },
          { time: '1:00 PM', title: 'Lunch at Beach Club', emoji: '🥗', desc: 'Fresh seafood lunch at beach club.' },
          { time: '4:00 PM', title: 'Snorkeling', emoji: '🤿', desc: 'Explore underwater coral reefs.' }
        ]
      },
      {
        day: 3,
        title: 'Cultural Day',
        activities: [
          { time: '8:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Early breakfast and preparation.' },
          { time: '10:00 AM', title: 'Ubud Rice Terraces', emoji: '🌾', desc: 'Visit stunning rice paddies of Ubud.' },
          { time: '2:00 PM', title: 'Traditional Massage', emoji: '💆', desc: 'Rejuvenate with Balinese massage.' },
          { time: '6:00 PM', title: 'Temple Visit & Ritual', emoji: '🛕', desc: 'Experience traditional Balinese temple ceremony.' }
        ]
      },
      {
        day: 4,
        title: 'Adventure & Nature',
        activities: [
          { time: '5:00 AM', title: 'Mount Batur Sunrise Trek', emoji: '⛰️', desc: 'Trek to mountain peak for sunrise.' },
          { time: '8:00 AM', title: 'Hot Springs Dip', emoji: '♨️', desc: 'Relax in natural hot springs.' },
          { time: '1:00 PM', title: 'Lunch & Rest', emoji: '🍜', desc: 'Local cuisine lunch and afternoon rest.' },
          { time: '5:00 PM', title: 'Waterfall Hike', emoji: '💧', desc: 'Visit Tegenungan waterfall.' }
        ]
      },
      {
        day: 5,
        title: 'Departure',
        activities: [
          { time: '8:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Final breakfast at resort.' },
          { time: '10:00 AM', title: 'Souvenir Shopping', emoji: '🎁', desc: 'Last minute shopping for souvenirs.' },
          { time: '12:00 PM', title: 'Check-out & Relax', emoji: '🛀', desc: 'Hotel check-out and lounge time.' },
          { time: '3:00 PM', title: 'Departure', emoji: '✈️', desc: 'Fly back home with memories.' }
        ]
      }
    ]
  },
  Goa: {
    name: 'Goa',
    location: 'Goa, India',
    emoji: '🏖️',
    gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    rating: '4.7',
    description: 'A coastal state famous for beaches, Portuguese architecture, and vibrant nightlife.',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Goa',
        activities: [
          { time: '9:00 AM', title: 'Arrive at Goa', emoji: '✈️', desc: 'Arrive at Dabolim Airport.' },
          { time: '11:00 AM', title: 'Hotel Check-in', emoji: '🏨', desc: 'Check-in to beachside hotel.' },
          { time: '2:00 PM', title: 'Beach Exploration', emoji: '🏖️', desc: 'Explore North Goa beaches.' },
          { time: '7:00 PM', title: 'Sunset Dinner', emoji: '🍽️', desc: 'Dinner with beach sunset views.' }
        ]
      },
      {
        day: 2,
        title: 'Beach & Water Sports',
        activities: [
          { time: '8:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Breakfast at beach shack.' },
          { time: '10:00 AM', title: 'Jet Skiing', emoji: '⛵', desc: 'Thrilling jet ski adventure.' },
          { time: '1:00 PM', title: 'Seafood Lunch', emoji: '🦐', desc: 'Fresh seafood at beachfront restaurant.' },
          { time: '4:00 PM', title: 'Parasailing', emoji: '🪂', desc: 'Enjoy parasailing over the sea.' }
        ]
      },
      {
        day: 3,
        title: 'Culture & Heritage',
        activities: [
          { time: '9:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Leisurely breakfast.' },
          { time: '10:00 AM', title: 'Old Goa Tour', emoji: '⛪', desc: 'Visit historic Portuguese churches.' },
          { time: '1:00 PM', title: 'Lunch at Local Restaurant', emoji: '🍜', desc: 'Try Goan cuisine specialties.' },
          { time: '4:00 PM', title: 'Market Tour', emoji: '🛍️', desc: 'Shop at local spice markets.' }
        ]
      },
      {
        day: 4,
        title: 'Nightlife & Adventure',
        activities: [
          { time: '10:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Late breakfast at hotel.' },
          { time: '2:00 PM', title: 'Dolphin Spotting Cruise', emoji: '🐬', desc: 'River cruise with dolphin spotting.' },
          { time: '5:00 PM', title: 'Temple Visit', emoji: '🛕', desc: 'Visit Mangeshi Temple.' },
          { time: '9:00 PM', title: 'Nightlife Experience', emoji: '🎉', desc: 'Enjoy Goa nightclubs and beach parties.' }
        ]
      },
      {
        day: 5,
        title: 'Departure',
        activities: [
          { time: '8:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Final breakfast.' },
          { time: '10:00 AM', title: 'Last Beach Visit', emoji: '🏖️', desc: 'Relax on beach one last time.' },
          { time: '12:00 PM', title: 'Check-out', emoji: '🏨', desc: 'Hotel check-out.' },
          { time: '2:00 PM', title: 'Return Home', emoji: '✈️', desc: 'Depart for home.' }
        ]
      }
    ]
  },
  Switzerland: {
    name: 'Switzerland',
    location: 'Switzerland, Europe',
    emoji: '🏔️',
    gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)',
    rating: '4.9',
    description: 'A stunning alpine country with breathtaking mountains, lakes, and charming villages.',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Switzerland',
        activities: [
          { time: '10:00 AM', title: 'Arrive at Zurich', emoji: '✈️', desc: 'Arrive at Zurich International Airport.' },
          { time: '12:00 PM', title: 'Hotel Check-in', emoji: '🏨', desc: 'Check-in to alpine resort.' },
          { time: '3:00 PM', title: 'City Tour', emoji: '🏙️', desc: 'Explore Zurich city center.' },
          { time: '7:00 PM', title: 'Swiss Fondue Dinner', emoji: '🍽️', desc: 'Enjoy traditional Swiss fondue.' }
        ]
      },
      {
        day: 2,
        title: 'Mountain Adventure',
        activities: [
          { time: '7:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Early breakfast preparation.' },
          { time: '9:00 AM', title: 'Jungfrau Railway', emoji: '🚂', desc: 'Scenic train ride to Jungfrau.' },
          { time: '1:00 PM', title: 'Lunch at Mountain Top', emoji: '🥘', desc: 'Dine at Europe\'s highest railway station.' },
          { time: '4:00 PM', title: 'Snow Activities', emoji: '⛷️', desc: 'Enjoy snow sports and ice walks.' }
        ]
      },
      {
        day: 3,
        title: 'Lakes & Nature',
        activities: [
          { time: '8:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Hotel breakfast.' },
          { time: '10:00 AM', title: 'Lake Cruise', emoji: '🛥️', desc: 'Scenic cruise on Lake Lucerne.' },
          { time: '1:00 PM', title: 'Lunch Cruise', emoji: '🍽️', desc: 'Lunch while enjoying views.' },
          { time: '4:00 PM', title: 'Chapel Bridge Walk', emoji: '🌉', desc: 'Visit historic Chapel Bridge in Lucerne.' }
        ]
      },
      {
        day: 4,
        title: 'Charming Villages',
        activities: [
          { time: '9:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Leisurely breakfast.' },
          { time: '10:00 AM', title: 'Visit Interlaken', emoji: '🏔️', desc: 'Explore picturesque Interlaken village.' },
          { time: '1:00 PM', title: 'Local Cuisine Lunch', emoji: '🥖', desc: 'Taste local specialties.' },
          { time: '4:00 PM', title: 'Paragliding', emoji: '🪂', desc: 'Paraglide over alpine valleys.' }
        ]
      },
      {
        day: 5,
        title: 'Departure',
        activities: [
          { time: '8:00 AM', title: 'Breakfast', emoji: '☕', desc: 'Final breakfast at hotel.' },
          { time: '10:00 AM', title: 'Souvenir Shopping', emoji: '🛍️', desc: 'Shop for Swiss watches and chocolate.' },
          { time: '12:00 PM', title: 'Check-out', emoji: '🏨', desc: 'Hotel check-out.' },
          { time: '3:00 PM', title: 'Depart', emoji: '✈️', desc: 'Departure flight.' }
        ]
      }
    ]
  }
};

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [tripData, setTripData] = useState({
    days: 5,
    selectedVibes: ['Adventure'],
    destType: 'Any',
  });
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const handleVibeClick = (vibeName) => {
    setSelectedVibe(vibeName);
    setActivePage('explore');
  };

  const handleDestinationSelect = (destName) => {
    setSelectedDestination(destinationData[destName]);
    setActivePage('itinerary');
  };

  const handleDestinationSearch = (searchName) => {
    if (!searchName.trim()) return;
    let dest = destinationData[searchName] || Object.values(destinationData).find(d => d.name.toLowerCase() === searchName.toLowerCase());
    if (!dest) {
      dest = {
        name: searchName,
        location: searchName,
        emoji: '🌍',
        gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
        rating: '4.5',
        description: `Explore the wonderful destination of ${searchName}. Discover its unique culture, scenic views, and local experiences.`,
        itinerary: []
      };
    }
    setSelectedDestination(dest);
    setActivePage('map');
  };

  const pages = {
    home: <Home onVibeSelect={handleVibeClick} onDestinationSelect={handleDestinationSelect} onNavigate={setActivePage} onSearch={handleDestinationSearch} />,
    plan: <Plan tripData={tripData} onTripDataChange={setTripData} />,
    itinerary: <Itinerary tripData={tripData} destination={selectedDestination} onNavigate={setActivePage} />,
    map: <MapView destination={selectedDestination} onNavigate={setActivePage} />,
    budget: <Budget tripData={tripData} destination={selectedDestination} />,
    checklists: <Checklists />,
    explore: <Explore selectedVibe={selectedVibe} />,
    profile: <Profile />,
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        {pages[activePage]}
      </main>
    </div>
  );
}
