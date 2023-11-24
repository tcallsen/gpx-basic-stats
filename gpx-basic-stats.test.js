'use strict';

const assert = require('assert')

// load dependencies 
const gpxBasicStats = require('./gpx-basic-stats.js')
const fs = require('fs')

// test regular GPX
test('gpx file with multiple trkseg', () => {
  const gpxFileA = fs.readFileSync('./sample_data/Sample_Joaquin_Miller.gpx', 'utf8')
  const statsA = gpxBasicStats( gpxFileA )
  assert.deepEqual(statsA, {
    startTime: "2019-11-02T17:49:50Z",
    endTime: "2019-11-02T19:15:26Z",
    distance: 2.83252139802459,
    duration: 5136000,
    elevationGain: 172.90000000000026,
    successful: 1,
    message: "Statistics calculated successfully.",
  })
});

// e.g. created if pause track recording in Gaia)
test('gpx file with multiple trkseg', () => {
  const gpxFileB = fs.readFileSync('./sample_data/sierra-nf-day-2-full.gpx', 'utf8')
  const statsB = gpxBasicStats( gpxFileB )
  assert.deepEqual(statsB, {
    startTime: "2023-09-10T14:37:51Z",
    endTime: "2023-09-10T18:29:05Z",
    distance: 65.06628704175897,
    duration: 13874000,
    elevationGain: 0,
    successful: 1,
    message: "Statistics calculated successfully.",
  })
});
