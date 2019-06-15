import React, {useState, useEffect} from 'react'
import Header from './components/Header/Header.jsx'
import BpkPanel from 'bpk-component-panel'
import BlueHeader from './components/BlueHeader/BlueHeader';
import styles from './App.css'


const App = () => {

  const [flightData, setFlightData] = useState({})
  const [returnFlightData, setReturnFlightData] = useState({})
  
  const doGetRequest = () => {
    axios.get('/flightEDtoLN')
      .then((response) => {
        console.log(response.data.directFlight);
        console.log(response.data.returnFlight);
        setFlightData(response.data.directFlight)
        setReturnFlightData(response.data.returnFlight)
      }).catch((err) => { 
        console.log(err)
      });
  }

  useEffect(() => doGetRequest(), [])


  return (
    <div>
      <Header />
      <div className={styleSs['blue-header']}>
      <BlueHeader />
      </div>
      <div className="App">
      {Object.values(flightData).map((item, idx) => <p key={idx}>{item.countryFrom}</p>)}
      </div>
      {/* <BpkPanel fullWidth={false} padded={true}>
      </BpkPanel> */}
    </div>
  )
}

export default App; 