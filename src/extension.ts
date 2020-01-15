import * as vscode from 'vscode';
import HoverProvider from './HoverProvider';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      [
        { language: 'react', scheme: '*' },
        { language: 'javascriptreact', scheme: '*' },
        { language: 'typescriptreact', scheme: '*' },
        { language: 'javascript', scheme: '*' },
        { language: 'typescript', scheme: '*' }
      ],
      new HoverProvider()
    )
  );
}
