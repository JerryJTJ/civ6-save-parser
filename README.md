# Civ 6 Save File Parser

This is a fork of the [civ6-save-parser](https://github.com/pydt/civ6-save-parser) with some updates and additional functionality.

Usage: `node index.js filename.Civ6Save [OPTIONS]`

## Options

-   **--outputCompressed**: Writes the compressed payload to the working directory.
-   **--simple**: Just outputs the parsed information, no metadata.
-   **--clean**: Outputs the very basic information in a JSON format.

## Tests

Tests are written in Mocha and can be run using `npm run test`.
