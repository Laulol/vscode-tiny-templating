import * as vscode from 'vscode';

export default async function renderCommand(): Promise<void> {
    const lastEditor = vscode.window.activeTextEditor;
    if (lastEditor === undefined) {
        vscode.window.showErrorMessage('No focused editor.');
        return;
    }

    // Retrieve editor content
    const template = lastEditor.document.getText() || '';

    // Find used variables
    const selector = vscode.workspace.getConfiguration('tinyTemplating').get<string>('variableSelector') || '{{[a-z0-9]+}}';
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
        const input = await vscode.window.showInputBox({ prompt: `Value of the variable ${variable}` });
        if (input === undefined) {
            // Cancelled by user
            return;
        }
        variableValue[variable] = input;
    }

    // Render template
    const regexVar = tryParseRegex(selector, false)!; // Autre regex car sinon, conflit lors de l'execution.
    var text = template.replace(regex, v => variableValue[regexVar.exec(v)![0]]);

    // Open in the editor
    await vscode.workspace.openTextDocument({ language: lastEditor.document.languageId, content: text });
}

function tryParseRegex(selector: string, global: boolean): RegExp | null {
    try {
        return new RegExp(selector,  global ? 'ig' : 'i');
    } catch {
        return null;
    }
}
