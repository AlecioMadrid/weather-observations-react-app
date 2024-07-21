import {
  callPointsAPIAndGetObservationStationsURL,
  callObservationStationsAPIAndGetStations,
  getObservationsForClosestObservationStation
} from '../nationalWeatherServiceClientFunctions'
import { NWS_POINTS_URL } from "../constants";


test('callPointsAPIAndGetObservationStationsURL calls fetch and parses the response body correctly', async() => {
  // Arrange
  const lat = 1.0;
  const lon = 2.0;
  const URL = NWS_POINTS_URL + lat + ',-' + lon;
  const expectedReturnedStations = [1,5]

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({properties: {observationStations: expectedReturnedStations}}),
    })
  );

  // Act
  const returnedStations = await callPointsAPIAndGetObservationStationsURL(lat,lon);

  // Assert
  expect(fetch).toHaveBeenCalledWith(URL)
  expect(returnedStations === expectedReturnedStations).toBeTruthy()
})

test('callObservationStationsAPIAndGetStations calls fetch and parses the response body correctly', async() => {
  // Arrange
  const URL = "test.test.com"
  const expectedStations = {test: "test"}

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({features: expectedStations}),
    })
  );

  // Act
  const returnedStations = await callObservationStationsAPIAndGetStations(URL);

  // Assert
  expect(fetch).toHaveBeenCalledWith(URL)
  expect(expectedStations === returnedStations).toBeTruthy()
})

test('getObservationsForClosestObservationStation calls fetch and parses the response body correctly', async() => {
  // Arrange
  const URL = "test.test.com"
  const endPointURL = URL + '/observations'
  const expectedObservations = {test: "test"}

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({features: expectedObservations}),
    })
  );

  // Act
  const returnedObservations = await getObservationsForClosestObservationStation(URL);

  // Assert
  expect(fetch).toHaveBeenCalledWith(endPointURL)
  expect(expectedObservations === returnedObservations).toBeTruthy()
})