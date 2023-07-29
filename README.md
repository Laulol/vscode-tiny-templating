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

### Additionnal variables files

Two files can be use to have variables without prompt.

* tinyvars.json at the root folder of the workspace.  
* tinyvars.json at the folder of the template.

## Extension Settings

This extension contributes the following settings:

* `tinyTemplating.variableSelector`: The RegExp to select variables in the template.
* `tinyTemplating.variablePrefixLength`: Number of characters to remove at the begin of the regex match to have de variable name.
* `tinyTemplating.variableSuffixLength`: Number of characters to remove at the end of the regex match to have de variable name.

## Release Notes

### 1.0.0

Initial release of the package.
