import {checkValue, 
        populateRowsForTableFromObservations,
        findClosestObservationStationURL,
        calculateDistance} from '../utils.js';
import * as observationsResponse from '../tst-data/observations-response.json';
import * as stationsResponse from '../tst-data/stations-response.json';

test('checkValue returns false for 2 dots', () => {
  // Arrange
  const value1 = '1.2.3';

  // Act
  const result = checkValue(value1)

  //Assert
  expect(result).toBeFalsy()
})

test('checkValue returns false for 3 dots', () => {
  // Arrange
  const value1 = '1.2.3.';

  // Act
  const result = checkValue(value1)

  //Assert
  expect(result).toBeFalsy()
})

test('checkValue returns true for 1 dots', () => {
  // Arrange
  const value1 = '1.0';

  // Act
  const result = checkValue(value1)

  //Assert
  expect(result).toBeTruthy()
})

test('checkValue returns false for letters', () => {
  // Arrange
  const value1 = 'asdfasdfljl';

  // Act
  const result = checkValue(value1)

  //Assert
  expect(result).toBeFalsy()
})

test('checkValue returns false for letters and numbers', () => {
  // Arrange
  const value1 = 'asdfa33sdfljl';

  // Act
  const result = checkValue(value1)

  //Assert
  expect(result).toBeFalsy()
})

test('calculateDistance returns the correct distance', () => {
  // Arrange
  const lat1 = '39.7392';
  const lon1 = '-104.9915';
  const lat2 = '39.71331';
  const lon2 = '-104.75806';

  // Act
  const result = calculateDistance(lat1, lon1, lat2, lon2)

  //Assert
  expect(result).toBe(20170.461086205578)
})

test('populateRowsForTableFromObservations correctly constructs the rows array', () => {
  // Arrange
  const observations = observationsResponse.features
  const expectedRows = [
    { startDate: '2024-07-20', highTemp: 29.4, lowTemp: 14.7 },
    { startDate: '2024-07-19', highTemp: 32.4, lowTemp: 18.4 },
    { startDate: '2024-07-18', highTemp: 31.7, lowTemp: 15.4 },
    { startDate: '2024-07-17', highTemp: 29.6, lowTemp: 15.2 },
    { startDate: '2024-07-16', highTemp: 31, lowTemp: 15.3 },
    { startDate: '2024-07-15', highTemp: 34.5, lowTemp: 21.4 },
    { startDate: '2024-07-14', highTemp: 36.4, lowTemp: 19.3 }
  ]
  
  // Act
  const rows = populateRowsForTableFromObservations(observations)
  
  // Assert
  expect(JSON.stringify(rows) === JSON.stringify(expectedRows)).toBeTruthy()
})

test('findClosestObservationStationURL should return the correct URL for the closest station', () => {
  // Arrange
  const lat = '39.7392';
  const lon = '104.9915';
  const stations = stationsResponse.features;
  const closestStationURL = "https://api.weather.gov/stations/KBKF"

  // Act
  const returnedClosestStationURL = findClosestObservationStationURL(stations, lat, lon)
  
  // Assert
  expect(returnedClosestStationURL === closestStationURL).toBeTruthy()
})