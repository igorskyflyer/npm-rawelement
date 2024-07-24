// Author: Igor Dimitrijević (@igorskyflyer)

import type { IRawElementAttribute } from './IRawElementAttribute.mjs'
import type { IRawElementOptions } from './IRawElementOptions.mjs'

export class RawElement {
  #rxLeadingWhitespace: RegExp = /^([\s]*)/
  #rxWrapperTags: RegExp = /\s*<(\w+)(?:\s[^>]*)?>[\s\S]*?<\/(.*?)>$/im

  #tag: keyof HTMLElementTagNameMap
  #format: boolean
  #source: string
  #attributes: IRawElementAttribute[]

  #_wrapper: string

  constructor(options: IRawElementOptions) {
    this.#assertOptions(options)

    this.#tag = options.tag
    this.#format = options.format ?? true
    this.#attributes = []
    this.#_wrapper = options.data.trim()
    this.#source = ''

    this.#init()
  }

  #assertOptions(options: IRawElementOptions) {
    if (typeof options !== 'object') {
      throw new Error('No options passed to RawElement.')
    }

    if (typeof options.data !== 'string' || options.data.length === 0) {
      throw new Error('No data passed to RawElement.')
    }

    if (typeof options.tag !== 'string' || options.tag.length === 0) {
      throw new Error('No tag name passed to RawElement.')
    }
  }

  #assertWrapper(): boolean {
    this.#rxWrapperTags.lastIndex = -1

    const match: RegExpExecArray | null = this.#rxWrapperTags.exec(
      this.#_wrapper
    )

    if (match && match.length === 3) {
      const startTag: string = match[1]
      const endTag: string = match[2]

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
    this.#source = this.#_wrapper

    this.#assertWrapper()

    this.#source = this.#source.replace(
      new RegExp(
        `\\s*<${this.#tag}(?:\\s[^>]*?)?>\n?([\\s\\S]*?)<\/${this.#tag}>`,
        'im'
      ),
      '$1'
    )

    if (this.#format) {
      this.#formatCode()
      this.#source = this.#source.trim()
    }

    this.#source = `\n${this.#source}\n`
  }

  #formatCode() {
    const lines = this.#source.split('\n')

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

    this.#source = trimmedLines.join('\n')
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
        allAttributes += `${attribute.name}="${attribute.value}"`
      }
    }

    return `<${this.#tag} ${allAttributes}>${this.#source}</${this.#tag}>`
  }

  get wrapper(): string {
    if (this.#attributes.length > 0) {
      this.#_wrapper = this.#addWrapperAttributes()
    } else {
      this.#_wrapper = `<${this.#tag}>${this.#source}</${this.#tag}>`
    }

    return this.#_wrapper
  }

  setAttribute(name: string, value: string | null): boolean {
    if (typeof name !== 'string' || name.length === 0) {
      return false
    }

    if (value !== null && typeof value !== 'string') {
      return false
    }

    const attributeIndex = this.#findAttribute(name)

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
}
