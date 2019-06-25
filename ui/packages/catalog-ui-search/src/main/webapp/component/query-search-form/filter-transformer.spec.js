import { expect } from 'chai'
import { flatten, expand } from './filter-transformer'

describe('flatten', () => {
  it('leaves basic filter unmodified', () => {
    expect(flatten(basicFilter)).to.deep.equal([basicFilter])
  })
  it('converts OR properly', () => {
    expect(flatten(orFilter)).to.deep.equal([multivaluedChecksumFilter])
  })
  it('converts AND to multiple filters', () => {
    expect(flatten(andFilter)).to.deep.equal([
      basicFilter,
      multivaluedChecksumFilter,
    ])
  })
})

describe('expand', () => {
  it('leaves basic filter unmodified', () => {
    expect(expand([basicFilter])).to.deep.equal(basicFilter)
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

describe('flatten + expand', () => {
  it('flattens and expands basic filter', () => {
    expect(basicFilter).to.deep.equal(expand(flatten(basicFilter)))
  })
  it('flattens and expands orFilter', () => {
    expect(orFilter).to.deep.equal(expand(flatten(orFilter)))
  })
  it('flattens and expands andFilter', () => {
    expect(andFilter).to.deep.equal(expand(flatten(andFilter)))
  })
})

const basicFilter = {
  type: 'ILIKE',
  property: 'anyText',
  value: ['val1'],
}

const orFilter = {
  type: 'OR',
  filters: [
    {
      type: 'ILIKE',
      property: 'checksum',
      value: ['val2'],
    },
    {
      type: 'ILIKE',
      property: 'checksum',
      value: ['val3'],
    },
  ],
}

const multivaluedChecksumFilter = {
  type: 'ILIKE',
  property: 'checksum',
  value: ['val2', 'val3'],
}

const andFilter = {
  type: 'AND',
  filters: [
    {
      type: 'ILIKE',
      property: 'anyText',
      value: ['val1'],
    },
    {
      type: 'OR',
      filters: [
        {
          type: 'ILIKE',
          property: 'checksum',
          value: ['val2'],
        },
        {
          type: 'ILIKE',
          property: 'checksum',
          value: ['val3'],
        },
      ],
    },
  ],
}
