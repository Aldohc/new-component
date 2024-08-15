# next-component-cli
This is package for create new component 
<br />

## Quick Start

Install via NPM:

```bash
# Using NPM
$ npm i next-component-cli

# or, using PNPM:
$ pnpm i next-component-cli
```
## Reference

This package has several options for generating files.

```bash
-i = {ComponentName}.tsx
-t = {ComponentName}.types.ts
-h = {ComponentName}.hooks.ts
-c = {ComponentName}.constants.ts
-s = {ComponentName}.schemas.ts

-all = generate all files

```

You can create a folder structure according to what you want to create.

`cd` into your project's directory, and try creating a new component:

```bash
$ new-component NewComponent
```
Your project will now have a new directory has one files index.tsx:

```jsx
// `NewComponent/index.tsx`
import NewComponent from './NewComponent';

export default NewComponent;
```

`$ new-component <ComponentName> <Option>`

```bash
$ new-component NewComponent -all
# or
$ new-component NewComponent -i -t -c -h -s

```

`$ new-component <ComponentName> -d <Path>`

```bash
$ new-component NewComponent -d features/parent-folder/views 
```

`$ new-component <ComponentName> <Path> <Option>`

```bash
$ new-component NewComponent -d features/parent-folder/views -all
# or
$ new-component NewComponent -d features/parent-folder/views -i -t -c -h -s

```

These files will be formatted according to your Prettier configuration.

<br />
