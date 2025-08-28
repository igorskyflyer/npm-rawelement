<div align="center">
  <img src="https://raw.githubusercontent.com/igorskyflyer/npm-rawelement/main/media/rawelement.png" alt="Icon of RawElement" width="256" height="256">
  <h1>RawElement</h1>
</div>

<br>

<h4 align="center">
  🐯 A utility that lets you manipulate HTML elements, their attributes and innerHTML as strings, on the go and then render the modified HTML. Very useful in SSG projects. 💤
</h4>

<br>
<br>

## 📃 Table of Contents

- [Features](#-features)
- [Usage](#-usage)
- [API](#-api)
    - [`constructor()`](#rawelementoptions-irawelementoptions)
    - [`IRawElementOptions`](#irawelementoptions)
      - [`data`](#data-string)
      - [`tag`](#tag-string)
      - [`format`](#format-boolean)
    - [`wrapper`](#wrapper)
    - [`source`](#source)
    - [`hasAttribute()`](#hasattributename-string-boolean)
    - [`setAttribute()`](#setattributename-string-value-string--null-boolean)
    - [`removeAttribute()`](#removeattributename-string-boolean)
- [Examples](#️-examples)
- [Changelog](#-changelog)
- [Support](#-support)
- [License](#-license)
- [Related](#-related)
- [Author](#-author)

<br>
<br>

## 🤖 Features

- 🏗 Create and manage raw HTML element wrappers from plain strings
- 🛡 Validates matching start/end tags for consistency
- ✂ Strips wrapper tags while keeping inner content intact
- 🎨 Optional formatting to remove leading indentation
- 🏷 Add, update, check, or remove wrapper element attributes
- 📦 Returns full wrapper or just inner source on demand
- ⚡ Precompiled regex for fast whitespace and tag matching
- 🚫 Throws clear errors on invalid data or attribute usage without a wrapper

<br>
<br>

## 🕵🏼 Usage

Install it by executing any of the following, depending on your preferred package manager:

```bash
pnpm add @igorskyflyer/rawelement
```

```bash
yarn add @igorskyflyer/rawelement
```

```bash
npm i @igorskyflyer/rawelement
```

<br>
<br>

## 🤹🏼 API

### `RawElement(options: IRawElementOptions)`

Creates a `RawElement` instance.  

If no options are specified or the required `data` property is not passed, it will throw an error.

<br>

### `IRawElementOptions`

Options are an interface `IRawElementOptions` of the following structure:

```ts
interface IRawElementOptions {
  data: string
  tag?: keyof HTMLElementTagNameMap // = string
  format?: boolean
}
```

#### `data: string`

**`Required`**, the actual HTML element/data to process, as a `String`. 

Data will be normalized, i.e. CRLF (`\r\n`) replaced with LF (`\n`).

<br>

#### `tag?: string`

**`Optional`**, a wrapper HTML tag for the element that will contain the text content and optional attributes set by the [`setAttribute()`](#setattributename-string-value-string--null-boolean) method.

The provided HTML element **MUST** have a matching start and an end tag that correspond to the value of the `tag` property, otherwise an error is thrown.  

<br>

> ℹ️ **NOTE**
>
> [`setAttribute`](#setattributename-string-value-string--null-boolean) only works when the `tag` property is defined.
>

<br>

#### `format?: boolean`

**`Optional`**, indicates whether to format the text content inside of the element.

<br>

> 💡 **TIP**
>
> It is **highly** recommended to leave the property `format` to its default value of `true` otherwise the `source` property of an instance of `RawElement` might contain a lot of leading whitespace. 
>

---

### `wrapper`

Gets the whole wrapper element made of:
- a start tag (if [`tag`](#tag-string) was set),
- attributes (if [`tag`](#tag-string) was set),
- text content,
- an end tag (if [`tag`](#tag-string) was set).

---

### `source`

Gets the text content of the element.

<br>

> 💡 **TIP**
>
> The text content can be formatted (the default behavior), set `format` in the `options` to false to disable formatting. 
>

---

### `hasAttribute(name: string): boolean`

Checks whether the wrapper element has an attribute.  

<br>

> 🛑 **CAUTION**
>
> If the wrapper element is not set, i.e. [`tag`](#tag-string) is not defined, attributes cannot be used and this method will throw an Error. 
>

<br>

Returns a `Boolean` indicating whether the provided attribute exists.

---

### `setAttribute(name: string, value: string | null): boolean`

Sets an attribute and its value on the wrapper element.  

<br>

> 🛑 **CAUTION**
>
> If the wrapper element is not set, i.e. [`tag`](#tag-string) is not defined, attributes cannot be used and this method will throw an Error.
>

<br>

Passing the `value` of `null` removes the attribute (see [`removeAttribute`](#removeattributename-string-boolean)) as well.  

Returns a `Boolean` indicating whether the action succeeded.

---

### `removeAttribute(name: string): boolean`

Removes an attribute and its value from the wrapper element.  

<br>

> 🛑 **CAUTION**
>
> If the wrapper element is not set, i.e. [`tag`](#tag-string) is not defined, attributes cannot be used and this method will throw an Error.
>

<br>

Returns a `Boolean` with the value of:

- `true` - if the attribute was found and removed,
- `false` - if the attribute does not exist or there was an error in removing it.


<br>
<br>

## 🗒️ Examples

`EncodedComponent.astro`
```astro
---
import { Encoder } from '@igorskyflyer/encode-entities'
import { RawElement } from '@igorskyflyer/rawelement'

// here we are using Astro (the SSG)
// but the data can come from any source
const slot: string = await Astro.slots.render('default')

const element: RawElement = new RawElement({
  tag: 'div',
  data: slot
})
const encoder: Encoder = new Encoder()
const source: string = encoder.encode(element.source) // this component will always output encoded content
---

<Fragment set:html={source} />
```

<br>

`my-page.astro`
```astro
import EncodedComponent from './EncodedComponent.astro'

<EncodedComponent>
  <div is:raw>
    Mitochondria are known as the "powerhouses" of the cell because they generate most of the cell's supply of ATP & CO<sub>2</sub>, which is used as a source of chemical energy.
  </div>
</EncodedComponent>

{/*
  Will get rendered as:

  Mitochondria are known as the &#34;powerhouses&#34; of the cell because they generate most of the cell&#39;s supply of ATP &#38; CO&#60;sub&#62;2&#60;/sub&#62;, which is used as a source of chemical energy.
*/}
```

<br>
<br>

## 📝 Changelog

📑 The changelog is available here, [CHANGELOG.md](https://github.com/igorskyflyer/npm-rawelement/blob/main/CHANGELOG.md).

<br>
<br>

## 🪪 License

Licensed under the MIT license which is available here, [MIT license](https://github.com/igorskyflyer/npm-rawelement/blob/main/LICENSE).

<br>
<br>

## 💖 Support

<div align="center">
  I work hard for every project, including this one and your support means a lot to me!
  <br>
  Consider buying me a coffee. ☕
  <br>
  <br>
  <a href="https://ko-fi.com/igorskyflyer" target="_blank"><img src="https://raw.githubusercontent.com/igorskyflyer/igorskyflyer/main/assets/ko-fi.png" alt="Donate to igorskyflyer" width="180" height="46"></a>
  <br>
  <br>
  <em>Thank you for supporting my efforts!</em> 🙏😊
</div>

<br>
<br>

## 🧬 Related

[@igorskyflyer/astro-post-excerpt](https://www.npmjs.com/package/@igorskyflyer/astro-post-excerpt)

> _⭐ An Astro component that renders post excerpts for your Astro blog - directly from your Markdown and MDX files. Astro v2+ collections are supported as well! 💎_

<br>

[@igorskyflyer/extendable-string](https://www.npmjs.com/package/@igorskyflyer/extendable-string)

> _🦀 ExtendableString allows you to create strings on steroids that have custom transformations applied to them, unlike common, plain strings. 🪀_

<br>

[@igorskyflyer/duoscribi](https://www.npmjs.com/package/@igorskyflyer/duoscribi)

> _✒ DúöScríbî allows you to convert letters with diacritics to regular letters. 🤓_

<br>

[@igorskyflyer/magic-queryselector](https://www.npmjs.com/package/@igorskyflyer/magic-queryselector)

> _🪄 A TypeScript-types patch for querySelector/querySelectorAll, make them return types you expect them to! 🔮_

<br>

[@igorskyflyer/strip-headings](https://www.npmjs.com/package/@igorskyflyer/strip-headings)

> _⛸ Strips Markdown headings!🏹_

<br>
<br>
<br>

## 👨🏻‍💻 Author

Created by **Igor Dimitrijević** ([_@igorskyflyer_](https://github.com/igorskyflyer/)).
