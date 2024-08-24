
import React, { useState } from 'react';
import Image from 'next/image';
const MarsMaps = () => {
  const [markers, setMarkers] = useState([]);


  const [identicoons, setIdenticoons] = useState([""])

  const mapWidth = 1792;  // Ajusta según el tamaño real del mapa
  const mapHeight = 1024;

  // Simula el cálculo de coordenadas basadas en la posición del clic
  const calculateCoordinates = (x, y) => {
    const lon = (x / mapWidth) * 360 - 180;
    const lat = 90 - (y / mapHeight) * 180;
    return { lat: lat.toFixed(2), lon: lon.toFixed(2) };
  };

  const handleMapClick = (e) => {
    console.log(markers);
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // x en píxeles dentro del mapa
    const y = e.clientY - rect.top; // y en píxeles dentro del mapa

    const newCoordinates = calculateCoordinates(x, y);

    // Añadir el nuevo marcador al array de marcadores
    setMarkers([...markers, { x, y, coordinates: newCoordinates }]);
  };

  return (
    <div style={{ position: '', textAlign: 'center', margin:"0 auto" }}>
     <Image
    width={1792}  // Tamaño real de la imagen
    height={1024}  // Tamaño real de la imagen
    src="/mars_map.webp"
    alt="Mars Map"
    style={{ maxWidth: '100%', height: 'auto' }}  // Escalado responsivo
  />

      {markers.map((marker, index) => (
        <React.Fragment key={index}>
          <div
            style={{
              position: 'absolute',
              top: `${marker.y}px`,
              left: `${marker.x}px`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'red',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
            }}
          ></div>
          <div style={{ position: 'absolute', top: `${marker.y + 15}px`, left: `${marker.x + 15}px`, backgroundColor: 'black', padding: '5px', borderRadius: '5px', fontSize: '12px', color: 'white' }}>
            Lat: {marker.coordinates.lat}, Lon: {marker.coordinates.lon}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default MarsMaps;
