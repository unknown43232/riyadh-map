import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon as LeafletIcon } from "leaflet";

type LocationData = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

type Props = {
  hospitals: LocationData[];
  pharmacies: LocationData[];
};

const LeafletMap: React.FC<Props> = ({ hospitals, pharmacies }) => {
  const isClient = typeof window !== "undefined";
  const [redIcon, setRedIcon] = useState<LeafletIcon | undefined>();
  const [blueIcon, setBlueIcon] = useState<LeafletIcon | undefined>();

  useEffect(() => {
    if (isClient) {
      const L = require("leaflet");
      setRedIcon(
        new L.Icon({
          iconUrl:
            "https://cdn.iconscout.com/icon/premium/png-512-thumb/navigation-pin-5848273-4910997.png?f=webp&w=256",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [0, -41],
        })
      );
      setBlueIcon(
        new L.Icon({
          iconUrl:
            "https://cdn.iconscout.com/icon/premium/png-512-thumb/map-pin-1473766-1249535.png?f=webp&w=256",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [0, -41],
        })
      );
    }
  }, [isClient]);

  if (!isClient) {
    // If not on client side, don't render anything
    return null;
  }

  return (
    <MapContainer
      center={[24.7136, 46.6753]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {hospitals.map((hospital) => (
        <Marker
          position={[hospital.lat, hospital.lng]}
          key={hospital.id}
          icon={redIcon}
        >
          <Popup>{hospital.name}</Popup>
        </Marker>
      ))}

      {pharmacies.map((pharmacy) => (
        <Marker
          position={[pharmacy.lat, pharmacy.lng]}
          key={pharmacy.id}
          icon={blueIcon}
        >
          <Popup>{pharmacy.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletMap;
