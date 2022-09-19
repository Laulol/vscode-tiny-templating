import * as vscode from 'vscode';
import renderCommand from './commands/render';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "tiny-templating" is now active!');

	const disposable = vscode.commands.registerCommand('tiny-templating.render', renderCommand);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
