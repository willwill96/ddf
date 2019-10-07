import { expect } from 'chai'
import { flatten, expand } from './filter-transformer'

const transformFilter = filter => filter

describe('flatten', () => {
  it('converts basic', () => {
    expect(flatten(basicFilter, transformFilter)).to.deep.equal([transformedBasicFilter])
  })
  it('converts OR', () => {
    expect(flatten(orFilter, transformFilter)).to.deep.equal([multivaluedChecksumFilter])
  })
  it('converts AND', () => {
    expect(flatten(andFilter, transformFilter)).to.deep.equal([transformedBasicFilter, multivaluedChecksumFilter])
  })
})

describe('expand', () => {
  it('converts basic', () => {
    expect(expand([transformedBasicFilter])).to.deep.equal(basicFilter)
  })
  it('converts multivalued to OR', () => {
    expect(expand([multivaluedChecksumFilter])).to.deep.equal(orFilter)
  })
  it('converts multiple filters to AND', () => {
    expect(expand([basicFilter, multivaluedChecksumFilter])).to.deep.equal(
      andFilter
    )
  })
})

// describe('flatten + expand', () => {
//   it('flattens and expands basic filter', () => {
//     expect(basicFilter).to.deep.equal(expand(flatten(basicFilter)))
//   })
//   it('flattens and expands orFilter', () => {
//     expect(orFilter).to.deep.equal(expand(flatten(orFilter)))
//   })
//   it('flattens and expands andFilter', () => {
//     expect(andFilter).to.deep.equal(expand(flatten(andFilter)))
//   })
// })

const basicFilter = {
  comparator: 'CONTAINS',
  type: 'anyText',
  value: ['val1'],
}
const transformedBasicFilter = {
  comparator: 'CONTAINS',
  attribute: 'anyText',
  value: 'val1',
}

const orFilter = {
  type: 'OR',
  filters: [
    {
      comparator: 'CONTAINS',
      type: 'checksum',
      value: ['val2'],
    },
    {
      comparator: 'CONTAINS',
      type: 'checksum',
      value: ['val3'],
    },
  ],
}

const multivaluedChecksumFilter = {
  comparator: 'CONTAINS',
  attribute: 'checksum',
  value: ['val2', 'val3'],
}

const andFilter = {
  type: 'AND',
  filters: [
    {
      comparator: 'CONTAINS',
      type: 'anyText',
      value: ['val1'],
    },
    {
      type: 'OR',
      filters: [
        {
          comparator: 'CONTAINS',
          type: 'checksum',
          value: ['val2'],
        },
        {
          comparator: 'CONTAINS',
          type: 'checksum',
          value: ['val3'],
        },
      ],
    },
  ],
}
