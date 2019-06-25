
export const flatten = (filter) => {
    if (filter.type === 'AND') {
      return filter.filters.map(flatten).reduce((a, b) => a.concat(b), [])
    }
  
    if (filter.type === 'OR') {
      const filters = filter.filters.reduce((filters, filter) => {
        const { type, property, value } = filter
  
        if (filters[property] === undefined) {
          filters[property] = { type, property, value: [] }
        }
        if (Array.isArray(value)) {
          filters[property].value.push(value[0])
        } else {
          filters[property].value.push(value) 
        }
        
  
        return filters
      }, {})
  
      return Object.keys(filters).map((property) => filters[property])
    }
    if (Array.isArray(filter.value)) {
      return filter
    } else {
      return [{...filter, value: [filter.value]}]
    }
  }
  
export const expand = (filters) => {
    const newFilters = filters.map(filter => {
      if (filter.value.length > 1) {
        return {
          type: 'OR',
          filters: filter.value.map(value => {
            return {
              property: filter.property,
              type: filter.type,
              value,
            }
          })
        }
      }
      return {...filter, value: filter.value[0]}
    })
    if (newFilters.length > 1) {
      return {
        type: 'AND',
        filters: newFilters
      }
    }
    return newFilters[0]
  }