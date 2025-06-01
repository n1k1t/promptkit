

<div align='center'>
  <h1>PromptKit</h1>
  <p>CLI util that collects project code examples to make AI prompts better</p>

  <img src="https://raw.githubusercontent.com/n1k1t/promptkit/refs/heads/master/images/preview.png?raw=true" />

  <br />
  <br />

  ![License](https://img.shields.io/badge/License-MIT-yellow.svg)
  ![npm version](https://badge.fury.io/js/@n1k1t%2Fpromptkit.svg)
  ![Dynamic XML Badge](https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fgithub.com%2Fn1k1t%2Fpromptkit%2Fblob%2Fmaster%2Fcoverage%2Fcobertura-coverage.xml%3Fraw%3Dtrue&query=round(%2Fcoverage%2F%40line-rate%20*%201000)%20div%201000&label=coverage)
</div>

## Install

```bash
npm i -D @n1k1t/promptkit
```

## How it works?

The promptkit uses custom [JSDoc](https://jsdoc.app/) tags `@ai` to define what some code is actually do in a JavaScript/TypeScript project for AI perspective. It takes all segments of described code and compiles into batch of formats to use it for [AI fine-tuning](https://platform.openai.com/docs/guides/fine-tuning) or rules of [ContinueDEV](https://www.continue.dev/) and so on...

For example you have a NodeJs/Typescript project with some code:

```ts
// src/index.ts

const Property = (options?: object): PropertyDecorator => () => {/** ...code */};
const Class = (options?: object): ClassDecorator => () => {/** ...code */};

/** @ai Create a class Foo */
@Class()
export class Foo {
  /** @ai Create a property foo */
  @Property({ parameter: 'foo' })
  foo!: string;

  /** @ai Create a property bar */
  @Property({ parameter: 'bar' })
  bar!: string;

  /**
   * @ai Create a method baz
   * @description A baz method
   */
  public baz(): boolean {
    return true;
  }
}
```

Using the promptkit command `npx promptkit collect src/**/*.ts` the promptkit will generate a `promptkit.md` file in the root of project that contains:

**`... "promptkit.md" file content`**

<pre>
# Use examples below to generate code by prompt

### Create a property foo

```ts
@Property({ parameter: 'foo' })
foo!: string;
```

### Create a property bar

```ts
@Property({ parameter: 'bar' })
bar!: string;
```

### Create a method baz

```ts
public baz(): boolean {
  return true;
}
```

### Create a class Foo

```ts
@Class()
export class Foo {
  @Property({ parameter: 'foo' })
  foo!: string;

  @Property({ parameter: 'bar' })
  bar!: string;

  public baz(): boolean {
    return true;
  }
}
```
</pre>

After that you'll able to use the generated file for prompting as project context to get better results

## API

### General

```bash
$ npx promptkit -h

Usage: cli [options] [command]

It helps to setup AI code assistants with prompt annotations

Options:
  -h, --help                   display help for command

Commands:
  collect [options] [pattern]  Collects @ai annotations with code by provided path pattern
  help [command]               display help for command
```

### Command `collect`

```bash
$ npx promptkit collect -h

Usage: cli collect [options] [pattern]

Collects @ai annotations with code by provided path pattern

Options:
  -f --format [json|md|yaml|continuedev|finetuning]  Annotations format (default: "md")
  -o --output [stdout|file]                          Annotations output (default: "file")
  -d --dest [value]                                  Destination path for a file
  -i --ignore [value]                                Ignore pattern (default: "node_modules/**")
  -h, --help                                         display help for command
```

**Examples**

```bash
$ npx promptkit collect -f json -o stdout src/*.js

[{"path":"src/index.js","lang":"js","prompt":"Create a class method test","code":"test() {\n  return true;\n}"},{"path":"src/index.js","lang":"js","prompt":"Create a class","code":"export class Test1 {\n  constructor() {}\n\n  test() {\n    return true;\n  }\n}"}]
```

```bash
$ npx promptkit collect -f finetuning -o stdout src/*.js

{"messages":[{"role":"user","content":"Create a class method test"},{"role":"assistant","content":"```js\ntest() {\n  return true;\n}\n```\n"}]}
{"messages":[{"role":"user","content":"Create a class"},{"role":"assistant","content":"```js\nexport class Test1 {\n  constructor() {}\n\n  test() {\n    return true;\n  }\n}\n```\n"}]}
```

```bash
$ npx promptkit collect -f continuedev -o stdout src/*.js

name: PROMPTKIT
version: 0.0.1
schema: v1
rules:
  - |
    # Use examples below to generate code by prompt

    ### Create a class method test

    ```js
    test() {
      return true;
    }
    ```

    ### Create a class

    ```js
    export class Test1 {
      constructor() {}

      test() {
        return true;
      }
    }
    ```
```

## Features

### Groups

The promptkit supports a grouping of segments of code using `@ai {...group}` format

**Examples**

**`... TypeScript code`**

```ts
// src/index.ts

import { ConvertTupleToUnion } from '../../types';

const Property = (options?: object): PropertyDecorator => () => {/** ...code */};
const Class = (options?: object): ClassDecorator => () => {/** ...code */};

/** @ai {enum} Create enum test with values FOO, BAR, BAZ */
export type TTest = ConvertTupleToUnion<typeof LTest>;
/** @ai {enum} */
export const LTest = <const>['FOO', 'BAR', 'BAZ'];

/** @ai {class} Create a prepared class with properties */
@Class()
class Foo {
  @Property()
  foo!: number;
}

/** @ai {class} */
@Class()
class Bar extends Foo {
  @Property()
  bar!: string;
}
```

**`... Executing the "collect" command`**

```bash
npx promptkit collect -f md -o stdout src/*.ts
```

**`... Console stdout`**

<pre>
# Use examples below to generate code by prompt

### Create enum test with values FOO, BAR, BAZ

```ts
export type TTest = ConvertTupleToUnion❬typeof LTest❭;
export const LTest = ❬const❭['FOO', 'BAR', 'BAZ'];
```

### Create a prepared class with properties

```ts
@Class()
class Foo {
  @Property()
  foo!: number;
}
@Class()
class Bar extends Foo {
  @Property()
  bar!: string;
}
```
</pre>

## Additional

### ENV

```bash
# Ignore pattern
export PROMPTKIT_IGNORE = "node_modules/**"
# A header title that will be placed as H1 tag into markdown content
export PROMPTKIT_MD_HEADER = "Use examples below to generate code by prompt"
```
