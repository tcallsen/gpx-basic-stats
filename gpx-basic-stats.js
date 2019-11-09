'use strict';

// praseing gpx
const toGeoJSON = require('@mapbox/togeojson')
const DOMParser = require('xmldom').DOMParser

// elevation calc
const gpxCalcElevationGain = require('gpx-calc-elevation-gain')

// distance calc
const turf = require('@turf/turf')

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

  // parse GPX to GeoJSON and extract relevant data
  let coords, coordTimes
  try {
    var doc = new DOMParser().parseFromString(inputFile)
    const geoJSON = toGeoJSON.gpx(doc)
    coords = geoJSON.features[0].geometry.coordinates
    coordTimes = geoJSON.features[0].properties.coordTimes
  } catch (e) {
    console.error(e);
    return statistics // exit if error parsing inputFile
  }

  // distance
  const lineStringGeom = turf.lineString(coords)
  statistics.distance = turf.length(lineStringGeom, {units: 'miles'});

  // duration
  statistics.duration = Date.parse(coordTimes[coordTimes.length-1]) - Date.parse(coordTimes[0])

  // elevation gain - calculate if elevation data is present
  if (coords[0].length > 2) statistics.elevationGain = gpxCalcElevationGain(inputFile)
 
  return statistics

}
