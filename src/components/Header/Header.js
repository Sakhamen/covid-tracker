import React, { useState, useEffect } from 'react';
import './Header.css';
import { MenuItem, FormControl, Select } from "@material-ui/core";

import coronaImage from '../../images/covid.png';

function Header({ updateCountryInfoHandler }) {
  const [country, setInputCountry] = useState("worldwide");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // console.log('data', data);
        setInputCountry(countryCode);
        updateCountryInfoHandler(data);
      });
  };

  return (
    <div className="header">
      <img className="header__image" alt='COVID-19' src={coronaImage} />
      <FormControl className="header__dropdown">
        <Select
          variant="outlined"
          value={country}
          onChange={onCountryChange}
        >
          <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value={country.value} key={country.name}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default Header;
