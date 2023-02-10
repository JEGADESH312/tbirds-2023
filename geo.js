const express = require('express')
const route = express.Router()
const fs = require("fs")

const PropertiesData = JSON.parse(fs.readFileSync('./Data/Properties.json', 'utf8'))

const getData = (url, levelBoundary) => {
    let geodata = JSON.parse(fs.readFileSync(url, 'utf-8'))
    levelBoundary = levelBoundary + '_ID'
    let propertyGeographyId = PropertiesData.map(prop => { return prop.GEOGRAPHY_ID[levelBoundary] })

    propertyGeographyId = [...new Set(propertyGeographyId)]
    let Property_Contained_Geo = propertyGeographyId.map(id => {
        let Contained_Geo = geodata.filter(geo => { return geo.id == id })
        return Contained_Geo
    })

    // Geo Names
    let NameList = geodata.map(geo => { return { id: geo.id, name: geo.name } })
    NameList.sort((a, b) => a.name.localeCompare(b.name))

    //return if Geo have length
    let Geography = Property_Contained_Geo.filter(props => { return props.length > 0 }).map(s => { return s[0] })
    return { Geography, NameList }
}


const getBoundary = (url, ID) => {
    let geodata = JSON.parse(fs.readFileSync(url, 'utf-8'))
    let BoundaryFile = []
    ID == 2900000000 ? BoundaryFile = geodata : BoundaryFile = geodata.filter(geo => { return geo.id == ID })
    return BoundaryFile
}

const getPropertieslength = (Id, Level) => {
    const levelBoundary = Level + '_ID'
    let Properties = PropertiesData.filter(prop => { return prop.GEOGRAPHY_ID[levelBoundary] == Id })
    return Properties.length
}

route.get('/state', (req, res) => { 
    let apiData = { 
        GeoJsons: {  
            OuterBoundary: JSON.parse(fs.readFileSync('./Data/state.json', 'utf8'))} 
        }
         res.json(apiData)
         // res.status(403).json({'me':"err"})
})
route.get('/districts', (req, res) => {
    BoundaryFile = JSON.parse(fs.readFileSync('./Data/state.json', 'utf8'))
    let Geographys = getData('./Data/district.json', 'District')
    let Boundary = getBoundary('./Data/state.json', 2900000000)
    let apiData = {

        GeoJsons: {
            ContainProperty: true,
            Boundary: Geographys.Geography,
            OuterBoundary: Boundary
        },
        NameList: Geographys.NameList
    }
    res.json(apiData)
})
route.get('/mandals', (req, res) => {
    let { DistrictID } = req.query
    let Geographys = getData(`./Data/Mandals/${DistrictID}.json`, 'Mandal')
    let PropertiesLen = getPropertieslength(DistrictID, 'District')
    let Boundary = [];
    let ContainProperty = false;
    if (PropertiesLen == 0) {
        Boundary = getBoundary('./Data/state.json', 2900000000)
    }
    else {
        Boundary = getBoundary('./Data/district.json', DistrictID)
        ContainProperty = true
    }

    //    Structuring;
    let apiData = {
        GeoJsons: {
            ContainProperty: ContainProperty,
            Boundary: Geographys.Geography,
            OuterBoundary: Boundary
        },
        NameList: Geographys.NameList
    }
    res.json(apiData)
})

route.get('/villages', (req, res) => {
    let { DistrictID, MandalID } = req.query
    let Geographys = getData(`./Data/Village/${DistrictID}/${MandalID}.json`, 'Village')
    let PropertiesLen = getPropertieslength(MandalID, 'Mandal')
    let Boundary = []
    let ContainProperty = false;
    if (PropertiesLen == 0) {
        Boundary = getBoundary('./Data/state.json', 2900000000)
    }
    else {
        Boundary = getBoundary(`./Data/Mandals/${DistrictID}.json`, MandalID)
        ContainProperty = true
    }

    //    Structuring;
    let apiData = {
        GeoJsons: {
            ContainProperty: ContainProperty,
            Boundary: Geographys.Geography,
            OuterBoundary: Boundary
        },
        NameList: Geographys.NameList
    }
    res.json(apiData)
})
route.get('/villages/village', (req, res) => {
    let { DistrictID, MandalID, VillageID } = req.query
    // let Properties = PropertiesData.filter(prop => { return prop.GEOGRAPHY_ID.Village_ID == VillageID })
    let Geography = []
    let PropertiesLen = getPropertieslength(VillageID, 'Village')
    let Boundary = []
    let ContainProperty = false;
    // if (PropertiesLen == 0) {
    //     Boundary = getBoundary('./Data/state.json', 2900000000)
    // }
    // else { 
        Boundary = getBoundary(`./Data/Village/${DistrictID}/${MandalID}.json`, VillageID)
    //     ContainProperty = true
    // }

    //    Structuring;
    let apiData = {
        ContainProperty: ContainProperty,
        GeoJsons: {
            Boundary: Geography,
            OuterBoundary: Boundary
        }
    }
    res.json(apiData)
})

module.exports = route;
