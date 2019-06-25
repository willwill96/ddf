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

import * as React from 'react'
import {
  deserialize,
  serialize,
  FilterModel,
  transformFilter,
} from '../filter-builder/filter-serialization'
import { expand, flatten } from './filter-transformer'

const Marionette = require('marionette')
const memoize = require('lodash/memoize')
const $ = require('jquery')
const CustomElements = require('../../js/CustomElements.js')
const cql = require('../../js/cql.js')
const store = require('../../js/store.js')
const QuerySettingsView = require('../query-settings/query-settings.view.js')
const properties = require('../../js/properties.js')
const CqlUtils = require('../../js/CQLUtils')

import query from '../../react-component/utils/query'
import TokenizedAutocomplete from '../../react-component/presentation/tokenized-autocomplete'
import { isArray } from 'util'
import Filter from '../../react-component/filter'

const fetchSuggestions = memoize(async attr => {
  const json = await query({
    count: 0,
    cql: "anyText ILIKE ''",
    facets: [attr],
  })

  const suggestions = json.facets[attr]

  if (suggestions === undefined) {
    return []
  }

  suggestions.sort((a, b) => b.count - a.count)

  return suggestions.map(({ value }) => value)
})

const isValidFacetAttribute = (id, type) => {
  if (!['STRING', 'INTEGER', 'FLOAT'].includes(type)) {
    return false
  }
  if (id === 'anyText') {
    return false
  }
  if (!properties.facetWhitelist.includes(id)) {
    return false
  }
  return true
}

const suggester = async ({ id, type }) => {
  if (!isValidFacetAttribute(id, type)) {
    return []
  }

  return fetchSuggestions(id)
}
const AutocompleteWrapper = Marionette.LayoutView.extend({
  template() {
    return (
      <TokenizedAutocomplete
        onChange={value => this.model.set('value', value)}
        value={this.model.get('value')}
        suggestions={['United States', 'Mexico', 'Canada', 'Brazil', 'England']}
      />
    )
  },
  isValid() {
    return true
  },
})

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

class SearchForm extends React.Component {
  constructor(props) {
    super(props)

    const filters = flatten(props.filter).map(filter=> new FilterModel(transformFilter(filter)))
    this.state = {
      filters
    }
  }
  render() {
    return (
      <form
        target="autocomplete"
        action="/search/catalog/blank.html"
        noValidate
      >
        <button
          style={{ paddingLeft: '50px' }}
          onClick={() => {
            const filters = this.state.filters.concat(new FilterModel(transformFilter({
              type: 'ILIKE',
              property: 'anyText',
              value: [''],
            })))
            this.setState({ filters })
          }}
        >
          Add Filter
        </button>
        <div className="editor-properties">
          {this.state.filters.map((model, i) => {
            return (
                <div key={model.cid} className="filter">
              <Filter
                model={model}
                editing={true}
              />
              </div>
            )
          })}

          <div className="query-settings" />
        </div>
        <div className="editor-footer">
          <button className="editor-edit is-primary">
            <span className="fa fa-pencil" />
            <span>Edit</span>
          </button>
          <button className="editor-cancel is-negative" type="button">
            <span className="fa fa-times" />
            <span>Cancel</span>
          </button>
          <button className="editor-save is-positive" type="submit">
            <span className="fa fa-floppy-o" />
            <span>Save</span>
          </button>
        </div>
      </form>
    )
  }
}

module.exports = Marionette.LayoutView.extend({
  template() {
    return (
      <SearchForm
        onChange={value => this.onChange(value)}
        filter={this.getFilter()}
        {...this.options}
      />
    )
  },
  tagName: CustomElements.register('query-search-form'),
  modelEvents: {},
  events: {
    'click .editor-edit': 'edit',
    'click .editor-cancel': 'cancel',
    'click .editor-save': 'save',
  },
  regions: {
    querySettings: '.query-settings',
  },
  ui: {},
  initialize() {},
  getFilter() {
    if (this.model.get('filterTree') !== undefined) {
      return this.model.get('filterTree')
    } else if (this.options.isAdd) {
      return cql.read("anyText ILIKE '%'")
    } else if (this.model.get('cql')) {
      return cql.simplify(cql.read(this.model.get('cql')))
    }
  },
  onBeforeShow() {
    this.model = this.model._cloneOf
      ? store.getQueryById(this.model._cloneOf)
      : this.model
    this.querySettings.show(
      new QuerySettingsView({
        model: this.model,
        isForm: this.options.isForm || false,
        isFormBuilder: this.options.isFormBuilder || false,
      })
    )
    this.edit()
  },
  onChange(value) {
    this.model.set('filterTree', value)
  },
  focus() {
    const tabbable = _.filter(
      this.$el.find('[tabindex], input, button'),
      element => element.offsetParent !== null
    )
    if (tabbable.length > 0) {
      $(tabbable[0]).focus()
    }
  },
  edit() {
    this.$el.addClass('is-editing')
    this.querySettings.currentView.turnOnEditing()
  },
  cancel() {
    fetchSuggestions.cache.clear()
    this.$el.removeClass('is-editing')
    this.onBeforeShow()
    if (typeof this.options.onCancel === 'function') {
      this.options.onCancel()
    }
  },
  save() {
    fetchSuggestions.cache.clear()
    if (!this.options.isSearchFormEditor) {
      this.$el.removeClass('is-editing')
    }
    this.querySettings.currentView.saveToModel()
    this.model.set({
      cql: CqlUtils.transformFilterToCQL(this.model.get('filterTree')),
      filterTree: this.model.get('filterTree'),
    })
    if (typeof this.options.onSave === 'function') {
      this.options.onSave()
    }
  },
  isValid() {
    return this.querySettings.currentView.isValid()
  },
  setDefaultTitle() {
    this.model.set('title', this.model.get('cql'))
  },
  serializeTemplateParameters() {
    return {
      filterTree: this.model.get('filterTree'),
      filterSettings: this.querySettings.currentView.toJSON(),
    }
  },
})
