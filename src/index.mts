// Author: Igor Dimitrijević (@igorskyflyer)

import type { IRawElementAttribute } from './IRawElementAttribute.mjs'
import type { IRawElementOptions } from './IRawElementOptions.mjs'

export class RawElement {
  #rxLeadingWhitespace: RegExp = /^([\s]*)/
  #rxWrapperTags: RegExp = /^\s*<(\w+)(?:\s[^>]*)?>([\s\S]*?)<\/(\1)>$/i

  #tag?: keyof HTMLElementTagNameMap
  #format: boolean
  #attributes: IRawElementAttribute[]

  #_source: string
  #_wrapper: string

  /** Creates a `RawElement` instance.
   *
   *  If no options are specified
   *  or the required `data`
   *  property is not passed,
   *  it will throw an error.
   * @since v1.0.0
   */
  constructor(options: IRawElementOptions) {
    this.#assertOptions(options)

    this.#_wrapper = options.data.trim()
    this.#tag = options.tag
    this.#format = options.format ?? true
    this.#attributes = []
    this.#_source = ''

    this.#init()
  }

  #assertOptions(options: IRawElementOptions) {
    if (typeof options !== 'object') {
      throw new Error('No options passed to RawElement.')
    }

    if (typeof options.data !== 'string' || options.data.length === 0) {
      throw new Error('No data passed to RawElement.')
    }
  }

  #assertWrapper(): boolean {
    this.#rxWrapperTags.lastIndex = -1

    const match: RegExpExecArray | null = this.#rxWrapperTags.exec(
      this.#_wrapper
    )

    if (match && match.length === 4) {
      const startTag: string = match[1]
      const endTag: string = match[3]

      if (startTag !== endTag) {
        throw new Error(
          `Mismatch of tags, got <${startTag}> as the start tag and </${endTag}> as the end tag.`
        )
      }

      if (this.#tag !== startTag || this.#tag !== endTag) {
        throw new Error(
          `Mismatch of tags, expected an element of type <${this.#tag}> but got <${startTag}> and </${endTag}>.`
        )
      }
    } else {
      throw new Error(
        `Mismatch of tags, expected an element of type <${this.#tag}>.`
      )
    }

    return true
  }

  #init() {
    this.#_wrapper = this.#_wrapper.replace(/\r\n/gm, '\n')
    this.#_source = this.#_wrapper

    if (typeof this.#tag === 'string') {
      this.#assertWrapper()

      this.#_source = this.#_source.replace(
        new RegExp(
          `\\s*<${this.#tag}(?:\\s[^>]*?)?>\n?([\\s\\S]*?)<\/${this.#tag}>`,
          'im'
        ),
        '$1'
      )
    }

    if (this.#format) {
      this.#formatCode()
      this.#_source = this.#_source.trim()
    }

    if (typeof this.#tag === 'string') {
      this.#_source = `\n${this.#_source}\n`
    }
  }

  #formatCode() {
    const lines = this.#_source.split('\n')

    if (lines.length === 0) {
      return
    }

    const firstLineIndentMatch = this.#rxLeadingWhitespace.exec(lines[0])
    const firstLineIndent = firstLineIndentMatch ? firstLineIndentMatch[1] : ''

    const trimmedLines = lines.map((line) => {
      if (line.startsWith(firstLineIndent)) {
        return line.slice(firstLineIndent.length)
      }
      return line
    })

    this.#_source = trimmedLines.join('\n')
  }

  #findAttribute(name: string): number {
    const count: number = this.#attributes.length

    if (count === 0) {
      return -1
    }

    for (let i = 0; i < count; i++) {
      if (this.#attributes[i].name === name) {
        return i
      }
    }

    return -1
  }

  #addWrapperAttributes(): string {
    const count: number = this.#attributes.length
    let allAttributes: string = ''

    for (let i = 0; i < count; i++) {
      const attribute: IRawElementAttribute = this.#attributes[i]

      if (typeof attribute.value === 'string') {
        allAttributes += ` ${attribute.name}="${attribute.value}"`
      }
    }

    return `<${this.#tag}${allAttributes}>${this.#_source}</${this.#tag}>`
  }

  #assertAttributes(): void {
    if (typeof this.#tag !== 'string') {
      throw new Error(
        'Attributes do not work without a wrapper, specify a wrapper tag in order to add attributes.'
      )
    }
  }

  /**
   * Gets the whole wrapper element made of:
   * - a start tag (if `tag` was set),
   * - attributes (if `tag` was set),
   * - text content,
   * - an end tag (if `tag` was set).
   * @since v1.0.0
   */
  get wrapper(): string {
    if (typeof this.#tag === 'string') {
      if (this.#attributes.length > 0) {
        this.#_wrapper = this.#addWrapperAttributes()
      } else {
        this.#_wrapper = `<${this.#tag}>${this.#_source}</${this.#tag}>`
      }
    }

    return this.#_wrapper
  }

  /**
   * Gets the text content of the element.
   * @since v1.0.0
   */
  get source(): string {
    return this.#_source
  }

  /**
   * Checks whether the wrapper element
   * has an attribute.
   *
   * If the wrapper element is not set, i.e. `tag` is not defined, attributes cannot be used and this method will throw an Error.
   * @since v1.1.0
   * @param name The name of the attribute to look for
   * @returns Returns a Boolean indicating the existence of
   * the attribute
   */
  hasAttribute(name: string): boolean {
    this.#assertAttributes()

    if (typeof name !== 'string') {
      return false
    }

    if (this.#attributes.length > 0) {
      const count: number = this.#attributes.length

      for (let i = 0; i < count; i++) {
        if (this.#attributes[i].name === name) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Sets an attribute and its value on the wrapper element.
   *
   * If the wrapper element is not set, i.e. `tag` is not defined, attributes cannot be used and this method will throw an Error.
   * @since v1.0.0
   * @param name The attribute's name.
   * @param value The value of the attribute.
   * @returns Returns a Boolean whether the action succeeded.
   */
  setAttribute(name: string, value: string | null): boolean {
    this.#assertAttributes()

    if (typeof name !== 'string' || name.length === 0) {
      return false
    }

    const attributeIndex = this.#findAttribute(name)

    if (value === null) {
      if (attributeIndex > -1) {
        this.#attributes.splice(attributeIndex, 1)
        return true
      }

      return false
    }

    if (typeof value !== 'string') {
      return false
    }

    if (attributeIndex > -1) {
      this.#attributes[attributeIndex].value = value
      return true
    }

    this.#attributes.push({
      name,
      value
    })

    return true
  }

  /**
   * Removes an attribute and its value from the wrapper element.
   *
   * If the wrapper element is not set, i.e. `tag` is not defined, attributes cannot be used and this method will throw an Error.
   * @since v1.1.0
   * @param name The attribute's name
   * @returns Returns a `Boolean` with the value of:
   *
   * - `true` - if the attribute was found and removed,
   * - `false` - if the attribute does not exist or there was an error in removing it.
   */
  removeAttribute(name: string): boolean {
    return this.setAttribute(name, null)
  }
}
