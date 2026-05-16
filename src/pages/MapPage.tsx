import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Geolocation } from '@capacitor/geolocation';
import { useTheme } from '../contexts/ThemeContext';

// Fix para ícones do Leaflet que não carregam corretamente no build
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícone personalizado "Estilo Waze" para o carro
const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png', // Ícone de seta de navegação
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Componente para atualizar o centro do mapa
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const MapPage = () => {
  const { theme } = useTheme();
  const [position, setPosition] = useState<[number, number]>([-23.55052, -46.633308]); // São Paulo
  const [zoom] = useState(16);

  // Tenta pegar a localização real do usuário usando o plugin nativo do Capacitor
  useEffect(() => {
    const getLocation = async () => {
      try {
        const coordinates = await Geolocation.getCurrentPosition();
        setPosition([coordinates.coords.latitude, coordinates.coords.longitude]);
      } catch (error) {
        console.error("Erro ao obter localização:", error);
      }
    };
    
    getLocation();
  }, []);

  const tileLayerUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="relative h-[calc(100vh-110px)] w-full overflow-hidden" style={{ backgroundColor: 'var(--ios-bg)' }}>
      {/* MAPA */}
      <MapContainer 
        center={position} 
        zoom={zoom} 
        zoomControl={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileLayerUrl}
        />
        <Marker position={position} icon={carIcon}>
          <Popup>Você está aqui</Popup>
        </Marker>
        <ChangeView center={position} zoom={zoom} />
      </MapContainer>

    </div>
  );
};

export default MapPage;
