'use strict';

// praseing gpx
const toGeoJSON = require('@mapbox/togeojson')
const DOMParser = require('xmldom').DOMParser

const { computeStats, mergeStats } = require('./lib/statsUtil');

/**
 * Returns basic statistics for route in supplied GPX file (times, distance, duration, elevation gain).
 * 
 * @param {file} inputFile gpx file
 * @param {boolean} mergeStatObjects if true, will merge all stat objects for gpx files with multiple
 *  trkseg into single stats object
 * @return {object[]} array of stat objects, one for each trkseg in the gpx file
 */
module.exports = function(inputFile, mergeStatObjects = false) {

  let statisticsArray = [];

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

      // optionally merge all stats objects in statisticsArray into a single stats object
      if (mergeStatObjects) {
        statisticsArray = [ mergeStats(statisticsArray) ];
      }
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
