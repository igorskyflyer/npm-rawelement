// Author: Igor Dimitrijević (@igorskyflyer)

import { describe, expect, it } from 'vitest'
import type { IRawElementOptions } from '../src/IRawElementOptions.js'
import { RawElement } from '../src/index.js'

const wrap = (tag: string, content: string) => `<${tag}>${content}</${tag}>`

describe('RawElement', () => {
  it('throws if options are missing', () => {
    // @ts-expect-error
    expect(() => new RawElement()).toThrow()
  })

  it('throws if data is missing', () => {
    expect(() => new RawElement({ data: '' } as IRawElementOptions)).toThrow()
  })

  it('parses wrapper and extracts inner source', () => {
    const html: string = wrap('div', 'Hello')
    const el: RawElement = new RawElement({
      data: html,
      tag: 'div',
      format: false
    })
    expect(el.source.trim()).toBe('Hello')
    expect(el.wrapper).toBe('<div>\nHello\n</div>')
  })

  it('trims indentation when format=true', () => {
    const html: string = wrap('pre', '    indented')
    const el: RawElement = new RawElement({
      data: html,
      tag: 'pre',
      format: true
    })
    expect(el.source.startsWith('    ')).toBe(false)
  })

  it('throws on mismatched start/end tag', () => {
    const badHtml: string = `<div>test</span>`
    expect(() => new RawElement({ data: badHtml, tag: 'div' })).toThrow()
  })

  it('supports adding, checking, updating and removing attributes', () => {
    const el: RawElement = new RawElement({
      data: wrap('div', 'X'),
      tag: 'div'
    })

    // add
    expect(el.setAttribute('id', 'my-id')).toBe(true)
    expect(el.hasAttribute('id')).toBe(true)
    expect(el.wrapper).toContain('id="my-id"')

    // update
    expect(el.setAttribute('id', 'new-id')).toBe(true)
    expect(el.wrapper).toContain('id="new-id"')

    // remove
    expect(el.removeAttribute('id')).toBe(true)
    expect(el.hasAttribute('id')).toBe(false)
  })

  it('returns false for hasAttribute if name is not a string', () => {
    const el: RawElement = new RawElement({
      data: wrap('div', 'Y'),
      tag: 'div'
    })
    // @ts-expect-error
    expect(el.hasAttribute(123)).toBe(false)
  })
})
