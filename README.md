# Tiny Templating

## Features

### Command "Render Template"

The command "Render Template" allow to copy a template (from the open editor) to a new editor, asking the variable to replace.

By default, the variable must be like `{{VarName}}` (to match the regular expression `{{[a-z0-9]+}}`).  
This regular expression can be change by the [settings](#extension-settings).

To use it :
- Open the template editor.
- Run the command "Render Template".
- Set the value of each variable that VSCode ask.
- A new editor appear with the remplaced text.

## Extension Settings

This extension contributes the following settings:

* `tinyTemplating.variableSelector`: The RegExp to select variables in the template.

## Release Notes

### 1.0.0

Initial release of the package.
