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

    const mergedStats = {
      startTime: '2222-09-10T18:29:05.000Z', // arbitrary date way out in the future
      endTime: 0,
      distance: 0,
      duration: 0,
      elevationGain: 0,
      successful: statsArray[0].successful,
      message: statsArray[0].message
    }

    statsArray.forEach((statsObject) => {
      mergedStats.distance += statsObject.distance;
      mergedStats.duration += statsObject.duration;
      mergedStats.elevationGain += statsObject.elevationGain;

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