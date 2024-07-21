/**
 * Function to check if a value is numerical and contains at most one dot
 * @param value 
 * @returns 
 */
export const checkValue = (value) => {
  const regex = new RegExp('^[\.0-9]*$');
  if (value.indexOf('.') === -1 || (value.indexOf('.') === value.lastIndexOf('.'))) {
    return regex.test(value)
  } else {
    return false
  }
}

/**
 * Here we calculate the distance to each station using the 
 * haversine formula https://www.movable-type.co.uk/scripts/latlong.html
 * @param lat1 
 * @param lon1 
 * @param lat2 
 * @param lon2 
 * @returns
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const phi1 = lat1 * Math.PI/180; // φ, λ in radians
  const phi2 = lat2 * Math.PI/180;
  const deltaPhi = (lat2-lat1) * Math.PI/180;
  const deltaLambda = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const populateRowsForTableFromObservations = (observations) => {
  const rows = []

  // Skip any observations with a null temperature value
  let firstNonNullIndex = 0;
  while (!observations[firstNonNullIndex].properties.temperature.value) {
    firstNonNullIndex += 1;
  }

  // If there are no non-null temperatures return an empty array
  if (firstNonNullIndex + 1 === rows.length) {
    return []
  }
  
  // Get the date and temperature of the first observation with a non-null temperature
  let startDate = observations[firstNonNullIndex].properties.timestamp.slice(0,10)
  let highTemp = observations[firstNonNullIndex].properties.temperature.value
  let lowTemp = observations[firstNonNullIndex].properties.temperature.value

  observations.slice(firstNonNullIndex + 1,).forEach(observation => {
    if (observation.properties.temperature.value) {
      if (observation.properties.timestamp.slice(0,10) !== startDate) {
        rows.push({startDate, highTemp, lowTemp})
        startDate = observation.properties.timestamp.slice(0,10)
        highTemp = observation.properties.temperature.value
        lowTemp = observation.properties.temperature.value
      } else{ 
        const obsTemp = observation.properties.temperature.value
        if (obsTemp) {
          if (obsTemp > highTemp) {
            highTemp = obsTemp
          } else if (obsTemp < lowTemp) {
            lowTemp = obsTemp
          }      
        }  
      }
    }
  })
  return rows;
}

export const findClosestObservationStationURL = (observationStations, lat, lon) => {
  let closestStation = observationStations[0]
  let closestDistance = calculateDistance(lat, lon * -1, observationStations[0].geometry.coordinates[1], observationStations[0].geometry.coordinates[0])

  observationStations.slice(1,).forEach(station => {
    const stationLat = station.geometry.coordinates[1]
    const stationLon = station.geometry.coordinates[0]
    const distanceToStation = calculateDistance(lat, lon * -1, stationLat, stationLon)
    
    if (distanceToStation < closestDistance) {
      closestStation = station
      closestDistance = distanceToStation
    }
  })
  return closestStation.id
}