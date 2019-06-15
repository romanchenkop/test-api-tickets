const express = require('express')
const app = express()
const port = 5054
const axios = require('axios')
const moment = require('moment')

const getFlight = () => {
    try {
        let now = new Date();
        now.setDate(now.getDate() + (7 - now.getDay()) % 7 + 1)
        const nextMondayFromNow = new Date(now)
        return axios.get(`https://api.skypicker.com/flights?flyFrom=EDI&to=LGW&dateFrom=${moment(nextMondayFromNow).format('DD/MM/YYYY')}&dateTo=${moment(nextMondayFromNow).format('DD/MM/YYYY')}&partner=picky`)
    } catch (e) {
        console.log(e)
    }
}

const getReturnFlight = () => {
    try {
        let now = new Date();
        now.setDate(now.getDate() + (7 - now.getDay()) % 7 + 1)
        const nextMondayFromNow = new Date(now)
        const countNextDay = now.setDate(now.getDate()  + 1)
        const followingDay = new Date(countNextDay)
        return axios.get(`https://api.skypicker.com/flights?flyFrom=LGW&to=EDI&dateFrom=${moment(nextMondayFromNow).format('DD/MM/YYYY')}&dateTo=${moment(nextMondayFromNow).format('DD/MM/YYYY')}&partner=picky`)
    } catch (e) {
        console.log(e);
    }
}

// const getATime = (obj) => {
//     const formatedFlyDuration = moment(obj.fly_duration, 'H:mm').format("H:mm")
//     const prepareArrivalTime = moment.duration(obj.dTime).add(formatedFlyDuration)
//     return moment(prepareArrivalTime.asMilliseconds()).format("h:mm")
// }

const mapDirectFlight = () => getFlight()
    .then(response => {
        const returnFlightToFront = response.data.data
            .filter(obj => !obj.has_airport_change)
            .map((obj) => ({
                countryFrom : obj.countryFrom.name,
                countryTo : obj.countryTo.name,
                price : obj.price,
                departureTime : moment(obj.dTime * 1000).format('H:mm'),
                arriveTime : moment(obj.aTime * 1000).format('H:mm'),
                travelTime : obj.fly_duration,
                cityFrom : obj.cityFrom,
                cityTo : obj.cityTo,
                }  
            ));
        return returnFlightToFront;
        })
    .catch(e => console.log(e))

const mapReturnFlight = () => getReturnFlight()
    .then(response => {
        const directFlightToFront = response.data.data
            .filter(obj => !obj.has_airport_change)
            .map((obj) => ({
                countryFrom : obj.countryFrom.name,
                countryTo : obj.countryTo.name,
                price : obj.price,
                departureTime : moment(obj.dTime * 1000).format('H:mm'),
                arriveTime : moment(obj.aTime * 1000).format('H:mm'),
                travelTime : obj.fly_duration,
                cityFrom : obj.cityFrom,
                cityTo : obj.cityTo,
                }  
            ));
        return directFlightToFront;
        })
    .catch(e => console.log(e)) 

app.get("/flightEDtoLN", async (req, res) => {
    try {
        const returnFlight = await mapReturnFlight()
        const directFlight = await mapDirectFlight()
        const data = {
            directFlight,
            returnFlight
        }
        res.send(data)
    } catch(e) {
        console.log(e)
    }
})

app.listen(port, () => console.log(`listening on ${port} port`))