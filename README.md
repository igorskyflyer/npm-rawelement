<h1 align="center">&lt;RawElement &sol;&gt;</h1>

<br>

<div align="center">
  🐯 A wrapper-utility that lets you manipulate HTML elements, their attributes
  <br>
  and innerHTML as strings, on the go and then render the modified HTML. Very useful in SSG projects. 💤
</div>

<br>
<br>

<div align="center">
  <blockquote>
    <br>
    <h4>💖 Support further development</h4>
    <span>I work hard for every project, including this one
    <br>
    and your support means a lot to me!
    <br>
    <br>
    Consider buying me a coffee. ☕
    <br>
    <strong>Thank you for supporting my efforts! 🙏😊</strong></span>
    <br>
    <br>
    <a href="https://ko-fi.com/igorskyflyer" target="_blank"><img src="https://raw.githubusercontent.com/igorskyflyer/igorskyflyer/main/assets/ko-fi.png" alt="Donate to igorskyflyer" width="150"></a>
    <br>
    <br>
    <a href="https://github.com/igorskyflyer"><em>@igorskyflyer</em></a>
    <br>
    <br>
    <br>
  </blockquote>
</div>

<br>
<br>

## 📃 Table of contents

- [Usage](#-usage)
- [API](#-api)
- [Examples](#-examples)
- [Changelog](#-changelog)
- [License](#-license)
- [Related](#-related)
- [Author](#-author)

<br>
<br>

## 🕵🏼 Usage

Install it by executing:

```shell
npm i "@igor.dvlpr/rawelement"
```

<br>

## 🤹🏼 API

### `RawElement(options: IRawElementOptions)`

Creates a `RawElement` instance.  

If no options are specified or the required `tag` and `data` properties are not passed, it will throw an error.

<br>

### `IRawElementOptions`

Options are an interface `IRawElementOptions` of the following structure:

```ts
interface IRawElementOptions {
  tag: keyof HTMLElementTagNameMap // = string
  data: string
  format?: boolean
}
```

`tag` - the wrapper HTML tag for the element that will contain the text content and optional attributes set by the [`setAttribute()`](#setattributename-string-value-string--null-boolean) method.

`data` - the actual HTML element to process, as a `String`.  

The provided HTML element **MUST** have a matching start and an end tag that correspond to the `tag` property, otherwise an error is thrown.  

Data will be normalized, i.e. CRLF (`\r\n`) replaced with LF (`\n`).

`format` - an optional property, whether to format the text content inside of the wrapper element.


<br>

> [!TIP]
> It is **highly** recommended to leave the property `format` to its default value of `true` otherwise the `source` property of an instance of `RawElement` might contain a lot of leading whitespace.
>

---

### `wrapper`

The whole wrapper element made of:
- a start tag,
- attributes (if present),
- text content,
- an end tag.

---

### `source`

The text content of the wrapper element.

<br>

> [!TIP]
> The text content can be formatted (the default behavior), set `format` in the `options` to false to disable formatting.
>

---

### `setAttribute(name: string, value: string | null): boolean`

Sets an attribute and its value on the wrapper element.  

To remove an attribute, pass the `value` of `null`.  

Returns a `Boolean` whether the action succeeded.

---

## ✨ Examples

`EncodedComponent.astro`
```astro
---
import { Encoder } from '@igor.dvlpr/encode-entities'
import { RawElement } from '../src/index.mjs'

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

---

## 📝 Changelog

📑 The changelog is available here: [CHANGELOG.md](https://github.com/igorskyflyer/npm-rawelement/blob/main/CHANGELOG.md).

---

## 🪪 License

Licensed under the MIT license which is available here, [MIT license](https://github.com/igorskyflyer/npm-rawelement/blob/main/LICENSE).

---

## 🧬 Related

[@igor.dvlpr/astro-post-excerpt](https://www.npmjs.com/package/@igor.dvlpr/astro-post-excerpt)

> _⭐ An Astro component that renders post excerpts for your Astro blog - directly from your Markdown and MDX files. Astro v2+ collections are supported as well! 💎_

<br>

[@igor.dvlpr/extendable-string](https://www.npmjs.com/package/@igor.dvlpr/extendable-string)

> _🦀 ExtendableString allows you to create strings on steroids that have custom transformations applied to them, unlike common, plain strings. 🪀_

<br>

[@igor.dvlpr/duoscribi](https://www.npmjs.com/package/@igor.dvlpr/duoscribi)

> _✒ DúöScríbî allows you to convert letters with diacritics to regular letters. 🤓_

<br>

[@igor.dvlpr/magic-queryselector](https://www.npmjs.com/package/@igor.dvlpr/magic-queryselector)

> _🪄 A TypeScript-types patch for querySelector/querySelectorAll, make them return types you expect them to! 🔮_

<br>

[@igor.dvlpr/strip-headings](https://www.npmjs.com/package/@igor.dvlpr/strip-headings)

> _⛸ Strips Markdown headings!🏹_

---

<br>

### 👨🏻‍💻 Author
Created by **Igor Dimitrijević** ([*@igorskyflyer*](https://github.com/igorskyflyer/)).
