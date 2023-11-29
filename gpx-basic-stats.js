'use strict';

// praseing gpx
const toGeoJSON = require('@mapbox/togeojson')
const DOMParser = require('xmldom').DOMParser

// elevation calc
const { calculateCoordsElevation } = require('gpx-calc-elevation-gain')

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

  const statisticsArray = [];

  // parse GPX to GeoJSON and extract relevant data
  let coords = [];
  let coordTimes = [];
  try {
    var doc = new DOMParser().parseFromString(inputFile)
    const geoJSON = toGeoJSON.gpx(doc)

    // NOTE: only first feature is read
    const feature = geoJSON.features[0];

    // special handling for GPX files with multiple trkseg (e.g. Gaia creates these if pausing track
    //  recording) which will have their coords and coordTimes concatenated together
    if (feature.geometry.type === 'MultiLineString') {
      
      if (feature.geometry.coordinates.length !== feature.properties.coordTimes.length) {
        throw new Error('geojson feature does not contain same number of geometries and coordinate times - aborting');
      }
      
      feature.geometry.coordinates.forEach((coords, index) => {
        coordTimes = feature.properties.coordTimes[index];
        statisticsArray.push(computeStats(coords, coordTimes));
      });
    } else {
      // regular gpx files with single trkseg handled here
      coords = geoJSON.features[0].geometry.coordinates;
      coordTimes = geoJSON.features[0].properties.coordTimes;
      statisticsArray.push(computeStats(coords, coordTimes));
    }

  } catch (e) {
    // example might be error parsing input file
    console.error(e)
    statisticsArray.push({ successful: 0, message: e.message });
  }

  return statisticsArray;
}

const computeStats = function(coords, coordTimes) {
  const statistics = {
    startTime: -1,
    endTime: -1,
    distance: -1,
    duration: -1,
    elevationGain: -1,
    successful: 0,
    message: null
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
  if (coords[0].length > 2) statistics.elevationGain = calculateCoordsElevation(coords)

  // mark as successful
  statistics.successful = 1
  statistics.message = "Statistics calculated successfully."

  return statistics
}
