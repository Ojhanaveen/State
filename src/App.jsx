import { useEffect, useState } from "react";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  //  Fetch countries
  useEffect(() => {
    fetch("https://crio-location-selector.onrender.com/countries")
      .then((res) => res.json())
      .then((data) => {
        // clean up duplicates & spaces
        const unique = [...new Set(data.map((c) => c.trim()))];
        setCountries(unique);
      })
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!country) return;
    fetch(`https://crio-location-selector.onrender.com/country=${country}/states`)
      .then((res) => res.json())
      .then((data) => {
        const unique = [...new Set(data.map((s) => s.trim()))];
        setStates(unique);
        setState("");
        setCities([]);
        setCity("");
      })
      .catch((err) => console.error("Error fetching states:", err));
  }, [country]);

  //  Fetch cities when state changes
  useEffect(() => {
    if (!state) return;
    fetch(`https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`)
      .then((res) => res.json())
      .then((data) => {
        const unique = [...new Set(data.map((ct) => ct.trim()))];
        setCities(unique);
        setCity("");
      })
      .catch((err) => console.error("Error fetching cities:", err));
  }, [state, country]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Select Location</h2>

      {/* Country Dropdown */}
      <label>
        Country:{" "}
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />

      {/* State Dropdown */}
      <label>
        State:{" "}
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          disabled={!country}
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />

      {/* City Dropdown */}
      <label>
        City:{" "}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!state}
        >
          <option value="">Select City</option>
          {cities.map((ct) => (
            <option key={ct} value={ct}>
              {ct}
            </option>
          ))}
        </select>
      </label>

      <br />
      <br />

      {/* Final Selection */}
      {country && state && city && (
        <p>
          You selected: <b>{`${city}, ${state}, ${country}`}</b>
        </p>
      )}
    </div>
  );
}
