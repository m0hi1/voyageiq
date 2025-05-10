import React from 'react';
import PlaceCard from './PlaceCard';
import { MapPin } from 'lucide-react';

function Places({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-3xl sm:text-4xl text-center mb-8 mt-8 md:mb-12 text-blue-700 tracking-tight">
        <MapPin className="inline-block mr-2 sm:mr-3 mb-1 h-7 w-7 sm:h-8 sm:w-8" />
        Places to Visit
      </h2>
      {/* days wiz plan */}
      <div>
        {trip?.tripData?.days?.map((item, index) => (
          <div key={index} className="mt-5">
            <h2 className="font-medium text-lg">Day {item.day}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              {item.places.map((place, index) => (
                <div key={index}>
                  <h2 className="font-medium text-sm text-orange-600">
                    {place.bestTimeToVisit}
                  </h2>
                  <PlaceCard place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Places;
