'use strict';

const toGeoJSON = require('@mapbox/togeojson')
const DOMParser = require('xmldom').DOMParser

const gpxCalcElevationGain = require('gpx-calc-elevation-gain')

/**
 * Returns basic statistics for route in supplied GPX file 
 * (distance, duration, elevation gain)
 * 
 * @param {file} inputFile
 * @return {object} statistics
 *
 */
module.exports = function(inputFile) {

  const statistics = {
    distance: -1,
    duration: -1,
    elevationGain: -1,
    movingTime: -1
  }

  // parse GPX to GeoJSON and extract coords
  let coords
  try {
    var doc = new DOMParser().parseFromString(inputFile)
    const geoJSON = toGeoJSON.gpx(doc)
    coords = geoJSON.features[0].geometry.coordinates
  } catch (e) {
    console.error(e);
    return -1 // exit if error parsing inputFile
  }

  // elevation gain - calculate if elevation data is present
  if (coords[0].length > 2) statistics.elevationGain = gpxCalcElevationGain(inputFile)
 
  return statistics

}
