export const flatten = (filter, transformFilter) => {
  //top level filter
  if (filter.type === 'AND') {
    return filter.filters.map(filter => flatten(filter, transformFilter)).reduce((a, b) => a.concat(b), [])
  }

  //multivalued filter
  if (filter.type === 'OR') {
    const filters = filter.filters.reduce((filters, filter) => {
      const { type: attribute, comparator, value } = transformFilter(filter)

      if (filters[attribute] === undefined) {
        filters[attribute] = { comparator, attribute, value: [] }
      }

      filters[attribute].value.push(value[0])

      return filters
    }, {})

    return Object.keys(filters).map(attribute => filters[attribute])
  }
  const { type:attribute ,comparator, value } = transformFilter(filter)
  return [{attribute, comparator, value: value[0]}]
}

export const expand = filters => {
  const newFilters = filters.map(filter => {
    if (Array.isArray(filter.value)) {
      if (filter.value.length === 0) {
        return {attribute: filter.attribute, comparator: filter.comparator, value: ['']}
      } else if (filter.value.length === 1) {
        return {attribute: filter.attribute, comparator: filter.comparator, value: filter.value}
      }

      return {
        type: 'OR',
        filters: filter.value.map(value => {
          return {
            attribute: filter.attribute,
            comparator: filter.comparator,
            value: [value],
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
