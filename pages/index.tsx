import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

// import { LocationData } from "./types";

type LocationData = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Home() {
  const [hospitals, setHospitals] = useState<LocationData[]>([]);
  const [pharmacies, setPharmacies] = useState<LocationData[]>([]);
  const [showHospitals, setShowHospitals] = useState(false);
  const [showPharmacies, setShowPharmacies] = useState(false);
  const [fetchedHospitals, setFetchedHospitals] = useState(false);
  const [fetchedPharmacies, setFetchedPharmacies] = useState(false);

  const fetchHospitals = async () => {
    try {
      const response = await fetch("/api/getRiyadhHospitals");
      if (!response.ok) {
        throw new Error("Failed to fetch hospitals");
      }
      const data = await response.json();
      setHospitals(data);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const fetchPharmacies = async () => {
    try {
      const response = await fetch("/api/getRiyadhPharmacies");
      if (!response.ok) {
        throw new Error("Failed to fetch pharmacies");
      }
      const data = await response.json();
      setPharmacies(data);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const updateHospitalDB = async () => {
    try {
      const response = await fetch("/api/updateHospitalDB", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to update HospitalDB");
      }
      // Handle success (e.g., show a success message to the user)
      console.log("HospitalDB updated successfully");
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const updatePharmacyDB = async () => {
    try {
      const response = await fetch("/api/updatePharmacyDB", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to update PharmacyDB");
      }
      // Handle success (e.g., show a success message to the user)
      console.log("PharmacyDB updated successfully");
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleHospitalsToggle = async () => {
    setShowHospitals(!showHospitals);
    if (!fetchedHospitals) {
      await fetchHospitals();
      setFetchedHospitals(true);
    }
  };

  const handlePharmaciesToggle = async () => {
    setShowPharmacies(!showPharmacies);
    if (!fetchedPharmacies) {
      await fetchPharmacies();
      setFetchedPharmacies(true);
    }
  };

  return (
    <div>
      <label className="custom-button">
        <input type="checkbox" onChange={handleHospitalsToggle} />
        Hospitals
      </label>
      <label className="custom-button">
        <input type="checkbox" onChange={handlePharmaciesToggle} />
        Pharmacies
      </label>

      <button onClick={updateHospitalDB}>Update HospitalDB</button>
      <button onClick={updatePharmacyDB}>Update PharmaciesDB</button>

      <LeafletMap
        hospitals={showHospitals ? hospitals : []}
        pharmacies={showPharmacies ? pharmacies : []}
      />
      <div className="penny-software">
        <Image
          src="https://penny.co/wp-content/uploads/2020/07/Penny-Logo.svg"
          alt="Penny Software Logo"
          width={150} // Adjust width as needed
          height={150} // Adjust height proportionally
          className="penny-logo"
        />

        <p>Created by Penny Software</p>
      </div>

      <style jsx>{`
        .penny-software {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin-top: 20px;
        }

        .penny-logo {
          width: 150px; // Adjust width as needed
          height: auto;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}
