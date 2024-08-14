#!/usr/bin/env node
const path = require('path');

const { program } = require('commander');

const {
  getConfig,
  buildPrettifier,
  createParentDirectoryIfNecessary,
  logIntro,
  logItemCompletion,
  logConclusion,
  logError,
} = require('./helpers');
const {
  mkDirPromise,
  readFilePromiseRelative,
  writeFilePromise,
} = require('./utils');

// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require('../package.json');
// Get the default config for this component (looks for local/global overrides,
// falls back to sensible defaults).
const config = getConfig();

// Convenience wrapper around Prettier, so that config doesn't have to be
// passed every time.
const prettify = buildPrettifier(config.prettierConfig);

program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-d, --dir <pathToDirectory>',
    'Path to the "components" directory (default: "features/views")',
      config.dir
  )
    .option('-c, --constants', 'Create a component file')
    .option('-h, --hooks', 'Create a hook file')
    .option('-t, --types', 'Create a test file')
    .option('-s, --schemas', 'Create a style file')
    .option('-i, --index', 'Create an index file')
    .option('-all, --all', 'Create all files')
  .parse(process.argv);


const [componentName] = program.args;

const options = program.opts();

// Find the path to the selected template file.
const templatePaths = {
    hooks: './templates/hooks.ts',
    default: './templates/i.tsx',
    constants: './templates/constants.ts',
    schemas: './templates/schemas.ts',
    types: './templates/types.ts',
};

let filesToCreate = [];

if (options.all) {
    filesToCreate = Object.keys(templatePaths);
    const index = filesToCreate.indexOf('schemas');
    if (index > -1) {
        filesToCreate.splice(index, 1);
    }
} else {
    if (options.constants) filesToCreate.push('constants');
    if (options.hooks) filesToCreate.push('hooks');
    if (options.types) filesToCreate.push('types');
    if (options.schemas) filesToCreate.push('schemas');
    if (options.index) filesToCreate.push('default');
}

const componentDir = `${options.dir}/${componentName}`;

const indexTemplate = prettify(`\
import ${componentName} from './${componentName}';

export default ${componentName}
`);

logIntro({
  name: componentName,
  dir: componentDir,
});

// Check if componentName is provided
if (!componentName) {
  logError(
    `Sorry, you need to specify a name for your component like this: new-component <name>`
  );
  process.exit(0);
}

createParentDirectoryIfNecessary(options.dir);

// Start by creating the directory that our component lives in.
// Create an array of promises for each template file
mkDirPromise(componentDir)
    .then(() => {
const filePromises = filesToCreate.map((fileType) => {
const templatePath = templatePaths[fileType];
const fileName = fileType === 'default' ? `${componentName}.tsx` : `${componentName}.${fileType}.ts`;
const filePath = path.join(componentDir, fileName);

return readFilePromiseRelative(templatePath)
    .then((template) => {
      // Replace placeholders with real data

        return template
            .replace(/import type { MyType } from "\.\/types";/g, `import type { MyType } from "./${componentName}.types";`)
            .replace(/useMyHook/g, `use${componentName}`)
            .replace(/COMPONENT_NAME/g, componentName);
    })
    .then((template) => {
      // Write the formatted content to the target file
        writeFilePromise(filePath, template);
    })
});

// Add the index file promise to the array
const indexPath = path.join(componentDir, `index.tsx`);
const indexPromise = writeFilePromise(indexPath, prettify(indexTemplate));

filePromises.push(indexPromise);

// Wait for all file promises to be resolved
return Promise.all(filePromises);
    })
    .then((filePromises) => {
        logItemCompletion('Directory created.');
        logItemCompletion(`Template built and saved to disk.`);
        logConclusion();
    })
    .catch((err) => {
        console.error(err);
    });

