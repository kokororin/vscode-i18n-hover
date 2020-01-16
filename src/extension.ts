import * as vscode from 'vscode';
import { HoverProvider } from './core/HoverProvider';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      [
        { language: 'react', scheme: '*' },
        { language: 'javascriptreact', scheme: '*' },
        { language: 'javascript', scheme: '*' }
      ],
      new HoverProvider()
    )
  );
}
