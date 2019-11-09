
// load dependencies 
const gpxBasicStats = require('./gpx-basic-stats.js')
const fs = require('fs')

// open sample file
const sampleFile = fs.readFileSync('./sample_data/Sample_Joaquin_Miller.gpx', 'utf8')

// calculate elevation (in same units as source data)
const statistics = gpxBasicStats( sampleFile )

console.log( statistics )
