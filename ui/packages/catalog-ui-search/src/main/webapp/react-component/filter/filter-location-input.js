import React from 'react'
import withListenTo from '../backbone-container'
const LocationView = require('../location/index.js')
const LocationOldModel = require('../../component/location-old/location-old')
const { Direction } = require('../../component/location-new/utils/dms-utils.js')
const ShapeUtils = require('../../js/ShapeUtils.js')
const CQLUtils = require('../../js/CQLUtils.js')
const wreqr = require('../../js/wreqr.js')
const store = require('../../js/store.js')
const wkx = require('wkx')
import { deserialize } from '../../component/location-old/location-serialization'

const filterToLocationOldModel = filter => {
  if (filter === '') return filter

  if (typeof filter.geojson === 'object') {
    return deserialize(filter.geojson)
  }

  // for backwards compatability with wkt
  if (filter.value && typeof filter.value === 'string') {
    const geometry = wkx.Geometry.parse(filter.value).toGeoJSON()
    return deserialize({
      type: 'Feature',
      geometry,
      properties: {
        type: geometry.type,
        buffer: {
          width: filter.distance,
          unit: 'meters',
        },
      },
    })
  }
}

const clearedLocation = {
  north: undefined,
  east: undefined,
  west: undefined,
  south: undefined,
  dmsNorth: '',
  dmsSouth: '',
  dmsEast: '',
  dmsWest: '',
  dmsNorthDirection: Direction.North,
  dmsSouthDirection: Direction.North,
  dmsEastDirection: Direction.East,
  dmsWestDirection: Direction.East,
  lat: undefined,
  lon: undefined,
  dmsLat: '',
  dmsLon: '',
  dmsLatDirection: Direction.North,
  dmsLonDirection: Direction.East,
  radius: 1,
  bbox: undefined,
  polygon: undefined,
  hasKeyword: false,
  usng: undefined,
  usngbb: undefined,
  utmUpsEasting: undefined,
  utmUpsNorthing: undefined,
  utmUpsZone: 1,
  utmUpsHemisphere: 'Northern',
  utmUpsUpperLeftEasting: undefined,
  utmUpsUpperLeftNorthing: undefined,
  utmUpsUpperLeftZone: 1,
  utmUpsUpperLeftHemisphere: 'Northern',
  utmUpsLowerRightEasting: undefined,
  utmUpsLowerRightNorthing: undefined,
  utmUpsLowerRightZone: 1,
  utmUpsLowerRightHemisphere: 'Northern',
  line: undefined,
  lineWidth: 1,
}

const minimumBuffer = 0.000001

class LocationInput extends React.Component {
  locationModel
  constructor(props) {
    super(props)
    this.locationModel = new LocationOldModel()
    this.state = this.locationModel.toJSON()
    this.deserialize()
  }
  setModelState() {
    this.setState(this.locationModel.toJSON())
    this.onChange()
  }
  componentWillMount() {
    this.locationModel.on('change', this.setModelState, this)
  }
  componentDidMount() {
    this.props.listenTo(
      this.locationModel,
      'change:mapNorth change:mapSouth change:mapEast change:mapWest',
      this.locationModel.setLatLon
    )
    this.props.listenTo(this.locationModel, 'change', this.updateMap)
    this.props.listenTo(this.locationModel, 'change:polygon', () => {
      if (this.locationModel.get('mode') !== 'poly') {
        wreqr.vent.trigger('search:polydisplay', this.locationModel)
      }
    })
    this.props.listenTo(this.locationModel, 'change:mode', () => {
      this.clearLocation()
    })
  }
  componentWillUnmount() {
    this.locationModel.off('change', this.setModelState)
    wreqr.vent.trigger('search:drawend', this.locationModel)
  }
  updateMap = () => {
    const mode = this.locationModel.get('mode')
    if (mode !== undefined && store.get('content').get('drawing') !== true) {
      wreqr.vent.trigger('search:' + mode + 'display', this.locationModel)
    }
  }
  deserialize = () => {
    const filter = this.props.value ? this.props.value : null
    if (filter === null || filter.value == undefined) {
      return
    }

    this.locationModel.set(filterToLocationOldModel(filter))

    switch (filter.type) {
      // these cases are for when the model matches the filter model
      case 'DWITHIN':
        if (CQLUtils.isPointRadiusFilter(filter)) {
          wreqr.vent.trigger('search:circledisplay', this.locationModel)
        } else if (CQLUtils.isPolygonFilter(filter)) {
          wreqr.vent.trigger('search:polydisplay', this.locationModel)
        } else {
          wreqr.vent.trigger('search:linedisplay', this.locationModel)
        }
        break
      case 'INTERSECTS':
        wreqr.vent.trigger('search:polydisplay', this.locationModel)
        break
      // these cases are for when the model matches the location model
      case 'BBOX':
        wreqr.vent.trigger('search:bboxdisplay', this.locationModel)
        break
      case 'MULTIPOLYGON':
      case 'POLYGON':
        wreqr.vent.trigger('search:polydisplay', this.locationModel)
        break
      case 'POINTRADIUS':
        wreqr.vent.trigger('search:circledisplay', this.locationModel)
        break
      case 'LINE':
        wreqr.vent.trigger('search:linedisplay', this.locationModel)
        break
    }
  }
  clearLocation() {
    this.locationModel.set(clearedLocation)
    wreqr.vent.trigger('search:drawend', this.locationModel)
    this.setState(this.locationModel.toJSON())
  }
  getCurrentValue() {
    const modelJSON = this.locationModel.toJSON()
    let type
    if (modelJSON.polygon !== undefined) {
      type = ShapeUtils.isArray3D(modelJSON.polygon)
        ? 'MULTIPOLYGON'
        : 'POLYGON'
    } else if (
      modelJSON.lat !== undefined &&
      modelJSON.lon !== undefined &&
      modelJSON.radius !== undefined
    ) {
      type = 'POINTRADIUS'
    } else if (
      modelJSON.line !== undefined &&
      modelJSON.lineWidth !== undefined
    ) {
      type = 'LINE'
    } else if (
      modelJSON.north !== undefined &&
      modelJSON.south !== undefined &&
      modelJSON.east !== undefined &&
      modelJSON.west !== undefined
    ) {
      type = 'BBOX'
    }

    return Object.assign(modelJSON, {
      type,
      lineWidth: Math.max(modelJSON.lineWidth, minimumBuffer),
      radius: Math.max(modelJSON.radius, minimumBuffer),
    })
  }
  onDestroy() {
    wreqr.vent.trigger('search:drawend', this.model)
  }
  onChange = () => {
    const value = this.getCurrentValue()
    this.props.onChange(value)
  }
  render() {
    const options = {
      onDraw: drawingType => {
        wreqr.vent.trigger(
          'search:draw' + this.locationModel.get('mode'),
          this.locationModel
        )
      },
    }
    return (
      <LocationView
        state={this.state}
        options={options}
        setState={(...args) => this.locationModel.set(...args)}
      />
    )
  }
}

export default withListenTo(LocationInput)
