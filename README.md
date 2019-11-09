# Compute basic statistics for GPX routes 
Computes the distance, duration, and elevation gain for GPX routes. 

Elevation data must be supplied in the GPX data (no external elevation APIs are used in the calculcation). The final result will be in the same units as the source data (e.g. meters, feet).

## Installing with NPM

```
npm i --save gpx-basic-stats
```

## Example
```
// load dependencies 
const gpxBasicStats = require('gpx-basic-stats')
const fs = require('fs')

// open sample file
const sampleFile = fs.readFileSync('./sample_data/Sample_Joaquin_Miller.gpx', 'utf8')

// calculate elevation (in same units as source data)
const statistics = gpxBasicStats( sampleFile )

console.log( statistics )
```

## What's Next

It would be great to include a "Moving Time" calculation similar to what Strava does. Also better error handling for GPX data that contains some data elements but not others.