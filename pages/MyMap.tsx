import { useEffect, useState } from "react";

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

const MyMap: React.FC<Props> = ({ hospitals, pharmacies }) => {
  const [isClient, setIsClient] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);

    if (isClient) {
      import("react-leaflet").then((reactLeaflet) => {
        import("leaflet").then((leaflet) => {
          setLeafletComponents({
            MapContainer: reactLeaflet.MapContainer,
            TileLayer: reactLeaflet.TileLayer,
            Marker: reactLeaflet.Marker,
            Popup: reactLeaflet.Popup,
            Icon: leaflet.Icon,
          });
        });
      });
    }
  }, [isClient]);

  if (!LeafletComponents) {
    return null;
  }

  const { MapContainer, TileLayer, Marker, Popup, Icon } = LeafletComponents;

  const redIcon = new Icon({
    iconUrl:
      "https://cdn.iconscout.com/icon/premium/png-512-thumb/navigation-pin-5848273-4910997.png?f=webp&w=256",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

  const blueIcon = new Icon({
    iconUrl:
      "https://cdn.iconscout.com/icon/premium/png-512-thumb/map-pin-1473766-1249535.png?f=webp&w=256",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

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

export default MyMap;
