import { TextDecoder } from 'util';
import * as vscode from 'vscode';

export default async function renderCommand(): Promise<void> {
    const lastEditor = vscode.window.activeTextEditor;
    if (lastEditor === undefined) {
        vscode.window.showErrorMessage('No focused editor.');
        return;
    }

    const config = vscode.workspace.getConfiguration('tinyTemplating');
    const prefixLength = config.get<number>('variablePrefixLength') || 2;
    const suffixLength = config.get<number>('variableSuffixLength') || 2;

    // Retrieve variables for folder an workspace
    const vars = await getTinyVars(lastEditor.document);

    // Retrieve editor content
    const template = lastEditor.document.getText() || '';

    // Find used variables
    const selector = config.get<string>('variableSelector') || '{{[a-z0-9]+}}';
    const regex = tryParseRegex(selector, true);
    if (regex === null) {
        vscode.window.showErrorMessage(`The selector '${selector}' isn't a valid regular expression.`);
        return;
    }

    const variables = [...template.matchAll(regex)]
        .map(m => m[0])
        .filter((v, i, a) => i === a.indexOf(v));

    const variableValue : { [key: string]: string } = {};
    for (const variable of variables) {
        const shortVariableName = variable.slice(prefixLength, -1 * suffixLength);
        if (vars[shortVariableName] !== undefined) {
            variableValue[variable] = vars[shortVariableName];
        } else {
            const input = await vscode.window.showInputBox({ prompt: `Value of the variable ${variable}` });
            if (input === undefined) {
                // Cancelled by user
                return;
            }
            variableValue[variable] = input;
        }
    }

    // Render template
    const regexVar = tryParseRegex(selector, false)!; // Autre regex car sinon, conflit lors de l'execution.
    var text = template.replace(regex, v => variableValue[regexVar.exec(v)![0]]);

    // Open in the editor
    const newDoc = await vscode.workspace.openTextDocument({ language: lastEditor.document.languageId, content: text });
    await vscode.window.showTextDocument(newDoc, undefined, false);
}

function tryParseRegex(selector: string, global: boolean): RegExp | null {
    try {
        return new RegExp(selector,  global ? 'ig' : 'i');
    } catch {
        return null;
    }
}

async function getTinyVars(document: vscode.TextDocument): Promise<{ [key: string]: string }> {
    const vars = {};

    const workspaces = vscode.workspace.workspaceFolders;
    if (workspaces && workspaces.length > 0) {
        const files = await vscode.workspace.findFiles('tinyvars.json', null, 1);
        if (files.length > 0) {
            const bytes = await vscode.workspace.fs.readFile(files[0]);
            const json = new TextDecoder().decode(bytes);
            Object.assign(vars, JSON.parse(json));
        }
    }

    if (document.uri.scheme === 'file') {
        let path = document.uri.path;
        path = path.slice(0, path.lastIndexOf('/')) + '/tinyvars.json';
        const files = await vscode.workspace.findFiles(vscode.workspace.asRelativePath(path), null, 1);
        if (files.length > 0) {
            const bytes = await vscode.workspace.fs.readFile(files[0]);
            const json = new TextDecoder().decode(bytes);
            Object.assign(vars, JSON.parse(json));
        }
    }

    return vars;
}
