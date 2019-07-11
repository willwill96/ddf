/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/

const Marionette = require('marionette')
const _ = require('underscore')
const CustomElements = require('../../js/CustomElements.js')
const FilterComparatorDropdownView = require('../dropdown/filter-comparator/dropdown.filter-comparator.view.js')
const MultivalueView = require('../multivalue/multivalue.view.js')
const metacardDefinitions = require('../singletons/metacard-definitions.js')
const PropertyModel = require('../property/property.js')
const DropdownModel = require('../dropdown/dropdown.js')
const DropdownView = require('../dropdown/dropdown.view.js')
const RelativeTimeView = require('../relative-time/relative-time.view.js')
const BetweenTimeView = require('../between-time/between-time.view.js')
const ValueModel = require('../value/value.js')
const properties = require('../../js/properties.js')
const Common = require('../../js/Common.js')
import {
  geometryComparators,
  dateComparators,
  stringComparators,
  numberComparators,
  booleanComparators,
} from './comparators'
import * as React from 'react'
import ExtensionPoints from '../../extension-points'
import MarionetteRegionContainer from '../../react-component/container/marionette-region-container'
import withListenTo from '../../react-component/container/backbone-container'

const Filter = withListenTo(
  class Filter extends React.Component {
    filterComparatorModel
    filterAttributeView
    filterInput
    constructor(props) {
      super(props)
      const state = props.model.toJSON()
      if (props.includedAttributes && !props.includedAttributes(state.type)) {
        state.type = !props.includedAttributes[0]
      }

      this.state = state
      this.filterAttributeView = DropdownView.createSimpleDropdown({
        list: this.getFilteredAttributeList(),
        defaultSelection: [this.state.type],
        hasFiltering: true,
      })
      this.filterComparatorModel = new DropdownModel({
        value: this.state.comparator || 'CONTAINS',
      })
    }

    componentDidMount() {
      this.props.listenTo(this.props.model, 'change', () =>
        this.setState(this.props.model.toJSON())
      )
      this.props.listenTo(
        this.filterAttributeView.model,
        'change:value',
        this.handleAttributeUpdate
      )
    }

    render() {
      this.determineInput()
      return (
        <React.Fragment>
          <div className="filter-rearrange">
            <span className="cf cf-sort-grabber" />
          </div>
          <button
            onClick={() => this.props.model.destroy()}
            className="filter-remove is-negative"
          >
            <span className="fa fa-minus" />
          </button>
          <div
            className="filter-attribute"
            data-help="Property to compare against."
          >
            <MarionetteRegionContainer view={this.filterAttributeView} />
          </div>
          <div
            className="filter-comparator"
            data-help="How to compare the value for this property against
the provided value."
          >
            <MarionetteRegionContainer
              view={FilterComparatorDropdownView}
              viewOptions={{
                model: this.filterComparatorModel,
                modelForComponent: this.props.model,
              }}
            />
          </div>
          <div
            className="filter-input"
            data-help="The value for the property to use during comparison."
          >
            <MarionetteRegionContainer view={this.filterInput} />
          </div>
          <ExtensionPoints.filterActions
            model={this.props.model}
            metacardDefinitions={this.props.metacardDefinitions}
            options={this.props}
          />
        </React.Fragment>
      )
    }

    handleAttributeUpdate = () => {
      const previousAttributeType =
        metacardDefinitions.metacardTypes[this.state.type].type
      this.props.model.set(
        'type',
        this.filterAttributeView.model.get('value')[0]
      )
      const currentAttributeType =
        metacardDefinitions.metacardTypes[this.state.type].type
      if (currentAttributeType !== previousAttributeType) {
        this.props.model.set('value', [''])
      }
    }

    getFilteredAttributeList = () => {
      return metacardDefinitions.sortedMetacardTypes
        .filter(({ id }) => !properties.isHidden(id))
        .filter(({ id }) => !metacardDefinitions.isHiddenType(id))
        .filter(({ id }) =>
          this.props.includedAttributes === undefined
            ? true
            : this.props.includedAttributes.includes(id)
        )
        .map(({ alias, id }) => ({
          label: alias || id,
          value: id,
          description: (properties.attributeDescriptions || {})[id],
        }))
    }

    determineInput = () => {
      this.updateValueFromInput()
      let value = Common.duplicate(this.state.value)
      const currentComparator = this.state.comparator
      value = transformValue(value, currentComparator)
      const propertyJSON = generatePropertyJSON(
        value,
        this.state.type,
        currentComparator
      )
      const ViewToUse = determineView(currentComparator)
      const model = new PropertyModel(propertyJSON)
      this.props.listenTo(model, 'change:value', this.updateValueFromInput)
      this.filterInput = new ViewToUse({
        model,
      })
                const property =
      this.filterInput.model instanceof ValueModel
        ? this.filterInput.model.get('property')
        : this.filterInput.model
    property.set('isEditing', true)
    }

    updateValueFromInput = () => {
      if (this.filterInput) {
        const value = Common.duplicate(
          this.filterInput.model.getValue()
        )
        const isValid = this.filterInput.isValid()
        this.props.model.set({ value, isValid }, { silent: true })
      }
    }
  }
)

const generatePropertyJSON = (value, type, comparator) => {
  const propertyJSON = _.extend({}, metacardDefinitions.metacardTypes[type], {
    value,
    multivalued: false,
    enumFiltering: true,
    enumCustom: true,
    matchcase: ['MATCHCASE', '='].indexOf(comparator) !== -1 ? true : false,
    enum: metacardDefinitions.enums[type],
    showValidationIssues: false,
  })

  if (propertyJSON.type === 'GEOMETRY') {
    propertyJSON.type = 'LOCATION'
  }

  if (propertyJSON.type === 'STRING') {
    propertyJSON.placeholder = 'Use * for wildcard.'
  }

  if (comparator === 'NEAR') {
    propertyJSON.type = 'NEAR'
    propertyJSON.param = 'within'
    propertyJSON.help =
      'The distance (number of words) within which search terms must be found in order to match'
    delete propertyJSON.enum
  }

  // if we don't set this the property model will transform the value as if it's a date, clobbering the special format
  if (comparator === 'RELATIVE' || comparator === 'BETWEEN') {
    propertyJSON.transformValue = false
  }

  return propertyJSON
}

const transformValue = (value, comparator) => {
  switch (comparator) {
    case 'NEAR':
      if (value[0].constructor !== Object) {
        value[0] = {
          value: value[0],
          distance: 2,
        }
      }
      break
    case 'INTERSECTS':
    case 'DWITHIN':
      break
    default:
      if (value === null || value[0] === null) {
        value = ['']
        break
      }
      if (value[0].constructor === Object) {
        value[0] = value[0].value
      }
      break
  }
  return value
}

const determineView = comparator => {
  let necessaryView
  switch (comparator) {
    case 'RELATIVE':
      necessaryView = RelativeTimeView
      break
    case 'BETWEEN':
      necessaryView = BetweenTimeView
      break
    default:
      necessaryView = MultivalueView
      break
  }
  return necessaryView
}

function comparatorToCQL() {
  return {
    BEFORE: 'BEFORE',
    AFTER: 'AFTER',
    RELATIVE: '=',
    BETWEEN: 'DURING',
    INTERSECTS: 'INTERSECTS',
    CONTAINS: 'ILIKE',
    MATCHCASE: 'LIKE',
    EQUALS: '=',
    '>': '>',
    '<': '<',
    '=': '=',
    '<=': '<=',
    '>=': '>=',
  }
}

module.exports = Marionette.LayoutView.extend({
  template() {
    return <Filter model={this.model} {...this.options} />
  },
  tagName: CustomElements.register('filter'),
  attributes() {
    return { 'data-id': this.model.cid }
  },
  events: {
    'click > .filter-remove': 'delete',
  },
  modelEvents: {},
    turnOnEditing() {
    this.$el.addClass('is-editing')
    //this.filterAttribute.currentView.turnOnEditing()
    //this.filterComparator.currentView.turnOnEditing()
    // const property =
    //   this.filterInput.currentView.model instanceof ValueModel
    //     ? this.filterInput.currentView.model.get('property')
    //     : this.filterInput.currentView.model
    // property.set('isEditing', true)
  },
  turnOffEditing() {
    this.$el.removeClass('is-editing')
    //this.filterAttribute.currentView.turnOffEditing()
    //this.filterComparator.currentView.turnOffEditing()
    /*
    const property =
      this.filterInput.currentView.model instanceof ValueModel
        ? this.filterInput.currentView.model.get('property')
        : this.filterInput.currentView.model
    property.set(
      'isEditing',
      this.options.isForm === true || this.options.isFormBuilder === true
    )*/
  },
})
