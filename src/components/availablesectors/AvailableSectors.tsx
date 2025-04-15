import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Sector } from '../../types/Sector';
import { GoogleMap, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';

const libraries: ('places')[] = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const AvailableSectors: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userAddress, setUserAddress] = useState<string>('Cargando...');
  const [availableSectors, setAvailableSectors] = useState<Sector[]>([]);

  const sectors = useSelector((state: RootState) => state.sector.sectors);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const getDistanceFromLatLonInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const isWithinSchedule = (from: number, to: number): boolean => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return currentMinutes >= from && currentMinutes <= to;
  };

  useEffect(() => {
    if (!isLoaded) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);

        // Esperar a que el objeto google.maps esté completamente disponible
        const interval = setInterval(() => {
          if (window.google && window.google.maps && typeof window.google.maps.Geocoder === 'function') {
            clearInterval(interval);
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location }, (results, status) => {
              if (status === 'OK' && results && results.length > 0) {
                setUserAddress(results[0].formatted_address);
              } else {
                setUserAddress('Dirección no disponible');
                console.error('Error al obtener dirección:', status);
              }
            });
          }
        }, 100);
      },
      (error) => {
        console.error('Error obteniendo la ubicación:', error);
        setUserAddress('No se pudo obtener ubicación');
      }
    );
  }, [isLoaded]);

  useEffect(() => {
    if (!userLocation) return;

    const filtered = sectors.filter((sector) => {
      const distance = getDistanceFromLatLonInKm(
        userLocation.lat,
        userLocation.lng,
        sector.coordinates.lat,
        sector.coordinates.lng
      );
      return distance <= 5 && isWithinSchedule(sector.scheduleFromMinutes, sector.scheduleToMinutes);
    });

    setAvailableSectors(filtered);
  }, [userLocation, sectors]);

  if (loadError) {
    return <div>Error cargando Google Maps: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Sectores disponibles cerca de ti</h3>

      {userLocation && (
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="user-address" style={{ display: 'block', fontWeight: 'bold' }}>Tu ubicación actual:</label>
          <input
            type="text"
            id="user-address"
            value={userAddress}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontFamily: 'monospace',
            }}
          />
        </div>
      )}

      {userLocation && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={userLocation}
        >
          <Marker position={userLocation} label="Tú" />
          {availableSectors.map((sector) => (
            <Marker
              key={sector.id}
              position={{
                lat: sector.coordinates.lat,
                lng: sector.coordinates.lng,
              }}
              label={sector.name}
            />
          ))}
          <Circle
            center={userLocation}
            radius={5000}
            options={{
              fillColor: 'rgba(0, 0, 255, 0.3)',
              strokeColor: '#0000FF',
              strokeOpacity: 0.5,
              strokeWeight: 2,
            }}
          />
        </GoogleMap>
      )}

      {availableSectors.length > 0 ? (
        <ul style={{ marginTop: '1rem', paddingLeft: '1rem' }}>
          {availableSectors.map((sector) => (
            <li key={sector.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{sector.name}</strong> – {sector.address}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ marginTop: '1rem' }}>No hay servicios disponibles en tu zona actualmente.</p>
      )}
    </div>
  );
};

export default AvailableSectors;

// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';
// import { Sector } from '../../types/Sector';
// import { GoogleMap, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';

// const libraries: ('places')[] = ['places'];

// const mapContainerStyle = {
//   width: '100%',
//   height: '600px',
// };

// const AvailableSectors: React.FC = () => {
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [userAddress, setUserAddress] = useState<string>('Cargando...');
//   const [availableSectors, setAvailableSectors] = useState<Sector[]>([]);

//   const sectors = useSelector((state: RootState) => state.sector.sectors);

//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
//     libraries,
//   });

//   const getDistanceFromLatLonInKm = (
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
//   ): number => {
//     const R = 6371;
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   const isWithinSchedule = (from: number, to: number): boolean => {
//     const now = new Date();
//     const currentMinutes = now.getHours() * 60 + now.getMinutes();
//     return currentMinutes >= from && currentMinutes <= to;
//   };

//   useEffect(() => {
//     if (!isLoaded) return;

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const location = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setUserLocation(location);

//         if (window.google && window.google.maps && typeof window.google.maps.Geocoder === 'function') {
//           const geocoder = new window.google.maps.Geocoder();
//           geocoder.geocode({ location }, (results, status) => {
//             if (status === 'OK' && results && results.length > 0) {
//               setUserAddress(results[0].formatted_address);
//             } else {
//               setUserAddress('Dirección no disponible');
//               console.error('Error al obtener dirección:', status);
//             }
//           });
//         } else {
//           setUserAddress('Geocoder no disponible');
//           console.error('Google Maps Geocoder no está listo.');
//         }
//       },
//       (error) => {
//         console.error('Error obteniendo la ubicación:', error);
//         setUserAddress('No se pudo obtener ubicación');
//       }
//     );
//   }, [isLoaded]);

//   useEffect(() => {
//     if (!userLocation) return;

//     const filtered = sectors.filter((sector) => {
//       const distance = getDistanceFromLatLonInKm(
//         userLocation.lat,
//         userLocation.lng,
//         sector.coordinates.lat,
//         sector.coordinates.lng
//       );
//       return distance <= 5 && isWithinSchedule(sector.scheduleFromMinutes, sector.scheduleToMinutes);
//     });

//     setAvailableSectors(filtered);
//   }, [userLocation, sectors]);

//   if (loadError) {
//     return <div>Error cargando Google Maps: {loadError.message}</div>;
//   }

//   if (!isLoaded) {
//     return <div>Cargando mapa...</div>;
//   }

//   return (
//     <div style={{ padding: '1rem' }}>
//       <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Sectores disponibles cerca de ti</h3>

//       {userLocation && (
//         <div style={{ marginBottom: '1rem' }}>
//           <label htmlFor="user-address" style={{ display: 'block', fontWeight: 'bold' }}>Tu ubicación actual:</label>
//           <input
//             type="text"
//             id="user-address"
//             value={userAddress}
//             readOnly
//             style={{
//               width: '100%',
//               padding: '8px',
//               marginTop: '4px',
//               borderRadius: '4px',
//               border: '1px solid #ccc',
//               fontFamily: 'monospace',
//             }}
//           />
//         </div>
//       )}

//       {userLocation && (
//         <GoogleMap
//           mapContainerStyle={mapContainerStyle}
//           zoom={14}
//           center={userLocation}
//         >
//           <Marker position={userLocation} label="Tú" />
//           {availableSectors.map((sector) => (
//             <Marker
//               key={sector.id}
//               position={{
//                 lat: sector.coordinates.lat,
//                 lng: sector.coordinates.lng,
//               }}
//               label={sector.name}
//             />
//           ))}
//           <Circle
//             center={userLocation}
//             radius={5000}
//             options={{
//               fillColor: 'rgba(0, 0, 255, 0.3)',
//               strokeColor: '#0000FF',
//               strokeOpacity: 0.5,
//               strokeWeight: 2,
//             }}
//           />
//         </GoogleMap>
//       )}

//       {availableSectors.length > 0 ? (
//         <ul style={{ marginTop: '1rem', paddingLeft: '1rem' }}>
//           {availableSectors.map((sector) => (
//             <li key={sector.id} style={{ marginBottom: '0.5rem' }}>
//               <strong>{sector.name}</strong> – {sector.address}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p style={{ marginTop: '1rem' }}>No hay servicios disponibles en tu zona actualmente.</p>
//       )}
//     </div>
//   );
// };

// export default AvailableSectors;
