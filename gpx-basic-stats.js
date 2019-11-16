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
 * (times, distance, duration, elevation gain)
 * 
 * @param {file} inputFile
 * @return {object} statistics
 *
 */
module.exports = function(inputFile) {

  const statistics = {
    startTime: -1,
    endTime: -1,
    distance: -1,
    duration: -1,
    elevationGain: -1,
    successful: 0,
    message: null
  }

  // parse GPX to GeoJSON and extract relevant data
  let coords, coordTimes
  try {
    var doc = new DOMParser().parseFromString(inputFile)
    const geoJSON = toGeoJSON.gpx(doc)
    coords = geoJSON.features[0].geometry.coordinates
    coordTimes = geoJSON.features[0].properties.coordTimes
  } catch (e) {
    console.error(e)
    statistics.message = e.message
    return statistics // exit if error parsing inputFile
  }

  // start and end times
  statistics.startTime = coordTimes[0]
  statistics.endTime = coordTimes[coordTimes.length-1]

  // distance
  const lineStringGeom = turf.lineString(coords)
  statistics.distance = turf.length(lineStringGeom, {units: 'miles'});

  // duration
  statistics.duration = Date.parse(coordTimes[coordTimes.length-1]) - Date.parse(coordTimes[0])

  // elevationGain - calculate if elevation data is present
  if (coords[0].length > 2) statistics.elevationGain = gpxCalcElevationGain(inputFile)
 
  // mark as successful
  statistics.successful = 1
  statistics.message = "Statistics calculated successfully."

  return statistics

}
