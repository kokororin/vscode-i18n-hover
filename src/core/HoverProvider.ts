import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';
import * as fg from 'fast-glob';
import { Code } from './Code';

export class HoverProvider implements vscode.HoverProvider {
  private static REG_EXP = /(?:[\s{\.]intl\.get|t)\(['"]([^]+?)['"]/g;

  private getKey(document: vscode.TextDocument, position: vscode.Position) {
    const keyRange = document.getWordRangeAtPosition(
      position,
      HoverProvider.REG_EXP
    );
    const key = keyRange
      ? document.getText(keyRange).replace(HoverProvider.REG_EXP, '$1')
      : undefined;

    return key;
  }

  private createHover(content: string) {
    const markdownText = new vscode.MarkdownString(content);
    markdownText.isTrusted = true;
    return new vscode.Hover(markdownText);
  }

  public async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ) {
    const key = this.getKey(document, position);
    if (!key) {
      return;
    }
    const config = vscode.workspace.getConfiguration('i18n_hover') as any;
    const patterns = config.patterns as string[];
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders[0]) {
      try {
        const entries = await fg(
          [
            ...patterns,
            ...['!node_modules/**/*', '!bower_components/**/*', '!vendor/**/*']
          ],
          {
            cwd: workspaceFolders[0].uri.fsPath,
            absolute: true
          }
        );
        if (entries.length === 0) {
          return this.createHover('Cannot find any locale file');
        }

        let result = '';

        for (const entry of entries) {
          const ext = path.extname(entry);
          const fileName = path.basename(entry, ext);

          const localeMap = await new Code(entry).run();
          const openFile = vscode.Uri.file(entry);
          result += `* [${fileName}](${openFile}) ${localeMap[key] || '-'}${
            os.EOL
          }`;
        }

        return this.createHover(result);
      } catch (err) {
        console.error(err);
        return this.createHover('Error occured');
      }
    }
    return this.createHover('Not in workspace');
  }
}
