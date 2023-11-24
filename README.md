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

## Developing

```
nvm use
npm install
```

## Publishing to Internal @gritto NPM Registry

This build is published to the @gritto NPM Registry at `dev.gritto.net`. Ensure your `~/.npmrc` file contains configuration for this namespace:

```
; @gritto NPM registry publish (per project)
//dev-npm-publish.gritto.net/api/v4/projects/64/packages/npm/:_authToken=<gitlab-gritto-group-deploy-token>
```

This configuration will overlay the `publishConfig` specified in the `package.json` file with the proper auth token.

## What's Next

It would be great to include a "Moving Time" calculation similar to what Strava does. Also better error handling for GPX data that contains some data elements but not others.