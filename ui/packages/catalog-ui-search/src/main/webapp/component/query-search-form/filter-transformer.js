import { transformFilter } from '../filter-builder/filter-serialization'

export const flatten = filter => {
  //top level filter
  if (filter.type === 'AND') {
    return filter.filters.map(flatten).reduce((a, b) => a.concat(b), [])
  }

  //multivalued filter
  if (filter.type === 'OR') {
    const filters = filter.filters.reduce((filters, filter) => {
      const { attribute, comparator, value } = getTransformedFilter(filter)

      if (filters[attribute] === undefined) {
        filters[attribute] = { comparator, attribute, value: [] }
      }

      filters[attribute].value.push(value[0])

      return filters
    }, {})

    return Object.keys(filters).map(attribute => filters[attribute])
  }

  return getTransformedFilter(filter)
}

export const expand = filters => {
  const newFilters = filters.map(filter => {
    if (Array.isArray(filter.value)) {
      return {
        type: 'OR',
        filters: filter.value.map(value => {
          return {
            property: filter.property,
            type: filter.type,
            value,
          }
        }),
      }
    }
    return filter
  })
  if (newFilters.length > 1) {
    return {
      type: 'AND',
      filters: newFilters,
    }
  }
  return newFilters[0]
}

const getTransformedFilter = filter => {
  const { type: attribute, comparator, value } = transformFilter(filter)
  return { attribute, comparator, value: value || [] }
}
