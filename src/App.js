import React, { useState, useEffect } from 'react';
import './App.css';
import "leaflet/dist/leaflet.css";

import numeral from "numeral";
import { sortData, prettyPrintStat } from "./utils/utils";

import Map from './components/Map/Map';
import Header from './components/Header/Header';
import InfoBox from './components/InfoBox/InfoBox';
import SideContent from './components/SideContent/SideContent';

function App() {
  const [countryInfo, setCountryInfo] = useState({});
  const [casesType, setCasesType] = useState("cases");
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          let sortedData = sortData(data);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  // Parent - Child Component Communication
  const updateCountryInfoHandler = (data) => {
    const latitude = (data.countryInfo) ? data.countryInfo.lat : 34.80746;
    const longitude = (data.countryInfo) ? data.countryInfo.long : -40.4796;

    setCountryInfo(data);
    setMapCenter({ lat: latitude, lng: longitude });
    setMapZoom(4);
  };

  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        <Header
          updateCountryInfoHandler={updateCountryInfoHandler}
        />

        {/* Stat Card */}
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>

        {/* Map */}
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <div className="app__right">
        {/* Table and Chart */}
        <SideContent
          type={casesType}
          data={tableData}
        />
      </div>
    </div>
  );
}

export default App;
