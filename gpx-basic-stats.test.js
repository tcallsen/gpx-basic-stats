'use strict';

const assert = require('assert')

// load dependencies 
const gpxBasicStats = require('./gpx-basic-stats.js')
const { mergeStats } = require('./lib/statsUtil.js');
const fs = require('fs')

describe('gpxBasicStats', () => {

  test('calc stats', () => {
    const gpxFileA = fs.readFileSync('./sample_data/Sample_Joaquin_Miller.gpx', 'utf8')
    const statsA = gpxBasicStats( gpxFileA )
    assert.deepEqual(statsA, [
      {
        startTime: "2019-11-02T17:49:50Z",
        endTime: "2019-11-02T19:15:26Z",
        distance: 2.83252139802459,
        duration: 5136000,
        elevationGain: 172.90000000000026,
        successful: 1,
        message: "Statistics calculated successfully.",
      }
    ])
  });

  // e.g. created if pause track recording in Gaia
  test('gpx file with multiple trkseg', () => {
    const gpxFileB = fs.readFileSync('./sample_data/sierra-nf-day-2-full.gpx', 'utf8')
    const statsB = gpxBasicStats( gpxFileB )
    assert.deepEqual(statsB, [
      {
        distance: 10.191841677433613,
        duration: 1607000,
        elevationGain: 597.2168945312503,
        endTime: "2023-09-10T15:04:38Z",
        message: "Statistics calculated successfully.",
        startTime: "2023-09-10T14:37:51Z",
        successful: 1
      },
      {
        distance: 54.865023687108405,
        duration: 11297000,
        elevationGain: 3361.8394775390625,
        endTime: "2023-09-10T18:29:05Z",
        message: "Statistics calculated successfully.",
        startTime: "2023-09-10T15:20:48Z",
        successful: 1,
      }
    ])
  });

  // e.g. manually created/edited in QGIS etc.
  test('gpx file - no time entries', () => {
    const gpxFileB = fs.readFileSync('./sample_data/day-2-views-loop-actual.gpx', 'utf8')
    const statsB = gpxBasicStats( gpxFileB )
    assert.deepEqual(statsB, [
      {
        distance: 106.7075181286904,
        duration: -1,
        elevationGain: 27585,
        endTime: -1,
        message: "Statistics calculated successfully.",
        startTime: -1,
        successful: 1
      }
    ])
  });

  // e.g. manually created/edited in QGIS etc.
  test('gpx file with multiple trkseg - no time entries', () => {
    const gpxFileB = fs.readFileSync('./sample_data/day-2-views-loop-actual-multi.gpx', 'utf8')
    const statsB = gpxBasicStats( gpxFileB )
    assert.deepEqual(statsB, [
      {
        distance: 106.7075181286904,
        duration: -1,
        elevationGain: 27585,
        endTime: -1,
        message: "Statistics calculated successfully.",
        startTime: -1,
        successful: 1
      },
      {
        distance: 106.7075181286904,
        duration: -1,
        elevationGain: 27585,
        endTime: -1,
        message: "Statistics calculated successfully.",
        startTime: -1,
        successful: 1
      }
    ])
  });

});

describe('gpxBasicStats with mergeStats=true', () => {

  test('gpx file', () => {
    const gpxFileA = fs.readFileSync('./sample_data/Sample_Joaquin_Miller.gpx', 'utf8')
    const statsA = gpxBasicStats( gpxFileA, true )
    assert.deepEqual(statsA, [
      {
        startTime: "2019-11-02T17:49:50Z",
        endTime: "2019-11-02T19:15:26Z",
        distance: 2.83252139802459,
        duration: 5136000,
        elevationGain: 172.90000000000026,
        successful: 1,
        message: "Statistics calculated successfully.",
      }
    ])
  });

  // e.g. created if pause track recording in Gaia
  test('gpx file with multiple trkseg', () => {
    const gpxFileB = fs.readFileSync('./sample_data/sierra-nf-day-2-full.gpx', 'utf8')
    const statsB = gpxBasicStats( gpxFileB, true )
    assert.deepEqual(statsB, [
      {
        distance: 65.05686536454202,
        duration: 12904000,
        elevationGain: 3959.056372070313,
        endTime: "2023-09-10T18:29:05.000Z",
        message: "Statistics calculated successfully.",
        startTime: "2023-09-10T14:37:51Z",
        successful: 1,
      }
    ])
  });

  // e.g. manually created/edited in QGIS etc.
  test('gpx file with multiple trkseg - no time entries', () => {
    const gpxFileB = fs.readFileSync('./sample_data/day-2-views-loop-actual-multi.gpx', 'utf8')
    const statsB = gpxBasicStats( gpxFileB, true )
    assert.deepEqual(statsB, [
      {
        distance: 213.4150362573808,
        duration: -1,
        elevationGain: 55170,
        endTime: -1,
        message: "Statistics calculated successfully.",
        startTime: -1,
        successful: 1
      }
    ])
  });

});
