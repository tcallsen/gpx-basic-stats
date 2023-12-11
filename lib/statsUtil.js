// elevation calc
const { calculateCoordsElevation } = require('gpx-calc-elevation-gain')

// distance calc
const turf = require('@turf/turf')

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
  if (coordTimes) {
    statistics.startTime = coordTimes[0]
    statistics.endTime = coordTimes[coordTimes.length-1]
  }

  // distance
  const lineStringGeom = turf.lineString(coords)
  statistics.distance = turf.length(lineStringGeom, {units: 'miles'});

  // duration
  if (coordTimes) {
    statistics.duration = Date.parse(coordTimes[coordTimes.length-1]) - Date.parse(coordTimes[0])
  }

  // elevationGain - calculate if elevation data is present
  if (coords[0].length > 2) statistics.elevationGain = calculateCoordsElevation(coords)

  // mark as successful
  statistics.successful = 1
  statistics.message = "Statistics calculated successfully."

  return statistics
}

/**
 * Merge stats array into single stats object. Return the first stats object if an error
 * is encountered. The 'successful' and message' properties from the first stats object
 * are returned (they are not merged).
 *
 * @param {Object[]} statsArray - Array of stats objects.
 * @returns {Object} Single object with merged stats, or the first stats object if an error
 *  is encountered.
 */
const mergeStats = function(statsArray) {
  try {

    // use first stats object as baseline to merge into
    const mergedStats = Object.assign({}, statsArray[0]);

    // iterate over the rest of stats objects (skipping first)
    statsArray.slice(1).forEach((statsObject) => {
      mergedStats.elevationGain += statsObject.elevationGain;
      mergedStats.distance += statsObject.distance;

      // time based calculcations are optional - some GPX files may not contain time info,
      //  e.g. if manually created in QGIS etc.
      if (statsObject.duration > 0) mergedStats.duration += statsObject.duration;

      // startTime and endTime are set to -1 when empty
      if (statsObject.startTime !== -1 && statsObject.endTime !== -1) {
        const statsObjectStartTime = new Date(statsObject.startTime);
        const statsObjectEndTime = new Date(statsObject.endTime);

        const mergedStatsStartTime = new Date(mergedStats.startTime);
        const mergedStatsEndTime = new Date(mergedStats.endTime);

        // ensure earliest time is used as startTime
        if (statsObjectStartTime < mergedStatsStartTime) {
          mergedStats.startTime = statsObjectStartTime.toISOString();
        }

        // ensure latest time is used as endTime
        if (statsObjectEndTime > mergedStatsEndTime) {
          mergedStats.endTime = statsObjectEndTime.toISOString();
        }
      }
    })

    return mergedStats;
  } catch (ex) {
    console.error('error encountered when merging stats - returning first stats object');
    console.error(ex.stack);
    return (statsArray && statsArray.length) ? statsArray[0] : {};
  }
}

module.exports = {
  computeStats,
  mergeStats
}