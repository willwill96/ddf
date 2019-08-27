import React from 'react'
import withListenTo from '../container/backbone-container'
const DropdownView = require('../../component/dropdown/dropdown.view.js')
import MarionetteRegionContainer from '../../react-component/container/marionette-region-container'

const getValue = model => {
  const multivalued = model.get('enumMulti')
  let value = model.get('value')[0]
  if (value !== undefined && model.get('type') === 'DATE') {
    if (multivalued && value.map) {
      value = value.map(subvalue => user.getUserReadableDateTime(subvalue))
    } else {
      value = user.getUserReadableDateTime(value)
    }
  }
  if (!multivalued) {
    value = [value]
  }
  return value
}

const getList = enumValues => {
  return enumValues.map(value => {
    if (value.label) {
      return {
        label: value.label,
        value: value.value,
        class: value.class,
      }
    } else {
      return {
        label: value,
        value,
        class: value,
      }
    }
  })
}

class EnumInput extends React.Component {
  getCurrentValue = value => {
    const currentValue = this.props.model.get('enumMulti') ? value : value[0]
    switch (this.props.model.getCalculatedType()) {
      case 'date':
        if (currentValue) {
          return moment(currentValue).toISOString()
        } else {
          return null
        }
      default:
        return currentValue
    }
  }
  isValid = value => {
    const enumValues = this.props.model.get('enum') || []
    return (
      enumValues.filter(
        choice =>
          value.filter(
            subvalue =>
              JSON.stringify(choice.value) === JSON.stringify(subvalue) ||
              JSON.stringify(choice) === JSON.stringify(subvalue)
          ).length > 0
      ).length > 0
    )
  }
  render() {
    const value = getValue(this.props.model)
    const enumValues = this.props.model.get('enum') || []
    const list = getList(enumValues)
    if (this.props.model.get('enumCustom')) {
      list.unshift({
        label: value[0],
        value: value[0],
        filterChoice: true,
      })
    }

    const component = DropdownView.createSimpleDropdown({
      list,
      defaultSelection: value,
      isMultiSelect: this.props.model.get('enumMulti'),
      hasFiltering: this.props.model.get('enumFiltering'),
      filterChoice: this.props.model.get('enumCustom'),
      matchcase: this.props.model.get('matchcase'),
    })
    this.props.listenTo(component.model, 'change:value', () => {
      // this.props.setValue(this.getCurrentValue(component.model.get('value')))
      // this.props.isValid(this.isValid(value))
      console.log(
        component.model.get('value'),
        this.getCurrentValue(component.model.get('value')),
        this.isValid(component.model.get('value'))
      )
    })
    return (
      <div onClick={() => this.setValue()}>
        <MarionetteRegionContainer view={component} />
      </div>
    )
  }
}

export default withListenTo(EnumInput)
