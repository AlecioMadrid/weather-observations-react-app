import { NWS_POINTS_URL } from "./constants";

export const callPointsAPIAndGetObservationStationsURL = async (lat,lon) => {
  const URL = NWS_POINTS_URL + lat + ',-' + lon;
  const response = await fetch(URL);
  const body = await response.json();
  return body.properties.observationStations;
}

export const callObservationStationsAPIAndGetStations = async (observationSationsURL) => {
  const response = await fetch(observationSationsURL);
  const body = await response.json();
  return body.features;
}

export const getObservationsForClosestObservationStation = async (closestStationURL) => {
  const observationsURL = closestStationURL + '/observations';
  const response = await fetch(observationsURL);
  const body = await response.json();
  return body.features;
}