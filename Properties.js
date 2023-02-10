const express = require('express')
const route = express.Router()
const fs = require("fs")

const path = require('path')
// const file = path.join(process.cwd(), 'Data', 'properties.json');
const PropertiesData = fs.readFileSync(__dirname + "/Data/properties.json", 'utf8');

route.get('/', (req, res) => {
    res.json(PropertiesData)
})

route.get('/Property', (req, res) => {
    const { Id, Level } = req.query
    let levelBoundary = Level + '_ID'
    let Properties = PropertiesData.filter(prop => { return prop.GEOGRAPHY_ID[levelBoundary] == Id })
    res.json(Properties)
})

module.exports = route;
