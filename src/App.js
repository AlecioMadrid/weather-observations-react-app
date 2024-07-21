import './App.css';
import {checkValue, 
        populateRowsForTableFromObservations,
        findClosestObservationStationURL} from './utils.js';

import {callPointsAPIAndGetObservationStationsURL, 
        callObservationStationsAPIAndGetStations,
        getObservationsForClosestObservationStation
 } from './nationalWeatherServiceClientFunctions.js';
 
import {TextField, 
        Button, 
        Table, 
        TableHead, 
        TableRow, 
        TableBody, 
        TableCell,
        Alert,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogContentText,
        DialogActions,
        Backdrop,
        CircularProgress
      } from '@mui/material';
import { useState } from 'react';


const App = () => {

  const [lat,setLat] = useState('');
  const [lon, setLon] = useState('');
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [displayHelp, setDisplayHelp] = useState(false);
  const [tableRows, setTableRows] = useState([{},{},{},{},{},{}]);

  const latOnChange = (event) => {
    const value = event.target.value;
    if (checkValue(value)) {
      setLat(event.target.value);
    }
  }

  const lonOnChange = (event) => {
    const value = event.target.value;
    if (checkValue(value)) {
      setLon(event.target.value);
    }
  }

  const handleSubmitClick = async (lat, lon) => {
    setBackdropOpen(true);
    setTableRows([{},{},{},{},{},{},{}]);
    setDisplayAlert(false);
    try {
      const observationStationsURL = await callPointsAPIAndGetObservationStationsURL(lat,lon);
      const observationStations = await callObservationStationsAPIAndGetStations(observationStationsURL);
      const closestStationURL = findClosestObservationStationURL(observationStations, lat, lon);
      const observations = await getObservationsForClosestObservationStation(closestStationURL);
      const rows = populateRowsForTableFromObservations(observations)
      if (rows.length !== 0) {
        setTableRows(rows);
      } else {
        setDisplayAlert(true);
      }
    } catch {
      // In a real production environment we would set up a logging service
      setTableRows([{},{},{},{},{},{},{}]);
      setDisplayAlert(true);
    }
    setBackdropOpen(false);
  }

  const handleHelpClick = () => {
    setDisplayHelp(true);
  }

  const handleHelpClose = () => {
    setDisplayHelp(false);
  }

  return (
    <div 
      className="App"
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: 1000}}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={displayHelp}
        onClose={handleHelpClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Using the National Weather Service Observation Query Tool"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This tool provides 7 day high and low temperatures for a provided latitude (positive degrees North) and longitude (positive degrees West) within the United States using observation data
            from the National Weather Service's closest station (if available). If there are no stations within a close enough geographical proximity to the 
            provided point it is possible that there may not be data available. 
            <br/><br/>https://www.latlong.net/convert-address-to-lat-long.html is one of many 
            tools available for converting to a latitude and longitude from other location types (e.g. city, state, zipcode, address).
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHelpClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {displayAlert ?
      <Alert 
        severity="error" 
        variant='filled' 
        onClose={() => {setDisplayAlert(false)}}
        sx={{
          zIndex: 10000,
          position: 'fixed',
          top:5
        }}
      >
        Either there was an issue retrieving the data or no data available. Please double check your coordinates and try again.
      </Alert>
      :
      <></>}

      <div
        className="Main-div"
      >
        <header className="App-header">
            <p>
              National Weather Service Observation Query Tool
            </p>
        </header>
        <div>
          <TextField 
            autoFocus 
            data-testid="latitude-text-input" 
            label={"Latitude (\u00B0N)"}
            variant="outlined" 
            value={lat}
            onChange={latOnChange}
            sx={{
              marginBottom: 2,
              marginRight: 1
            }}
          />
          <TextField 
            data-testid="longitude-text-input" 
            label={"Longitude (\u00B0W)"} 
            variant="outlined"
            value={lon}
            onChange={lonOnChange}
            sx={{
              marginRight: 2
            }} 
          />
        </div>
        <div>
          <Button 
            id="help-button"
            variant="outlined"
            onClick={() => handleHelpClick()}
            sx={{
              marginRight: 1
            }}
          >
            Help
          </Button>
          { lat === '' || lon === '' ?
            <Button 
              id="disabled-submit-button"
              disabled 
              variant="contained"
            >
              Submit
            </Button>
          :
            <Button 
              variant="contained"
              onClick={() => handleSubmitClick(lat, lon)}
            >
              Submit
            </Button>
          }

          </div>

          <Table 
            sx={{ width: 400 }} 
            aria-label="simple table"
            data-testid="data-table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">High (&deg;C)</TableCell>
                <TableCell align="right">Low (&deg;C)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row) => (
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.startDate}
                  </TableCell>
                  <TableCell align="right">{row.highTemp}</TableCell>
                  <TableCell align="right">{row.lowTemp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
    </div>
  );
}

export default App;
