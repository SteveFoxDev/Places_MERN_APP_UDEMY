const axios = require("axios");

const ExpressError = require("../models/ExpressError");


async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  const data = response.data;
  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new ExpressError(
      "Could Not Find Location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;
