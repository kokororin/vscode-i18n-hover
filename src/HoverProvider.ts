import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as fg from 'fast-glob';
import * as babel from '@babel/core';

export default class HoverProvider implements vscode.HoverProvider {
  static REG_EXP = /(?:[\s{\.]intl\.get|t)\(['"]([^]+?)['"]/g;

  getKey(document: vscode.TextDocument, position: vscode.Position) {
    const keyRange = document.getWordRangeAtPosition(
      position,
      HoverProvider.REG_EXP
    );
    const key = keyRange
      ? document.getText(keyRange).replace(HoverProvider.REG_EXP, '$1')
      : undefined;

    if (!key) {
      return;
    }

    return key;
  }

  provideHover(document: vscode.TextDocument, position: vscode.Position) {
    const key = this.getKey(document, position);
    if (!key) {
      return;
    }
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders[0]) {
      try {
        const entries = fg.sync(['**/zh*.js'], {
          cwd: workspaceFolders[0].uri.fsPath,
          absolute: true
        });
        if (entries.length === 0) {
          return new vscode.Hover('Cannot find zh locale file');
        }
        const babelResult = babel.transform(
          String(fs.readFileSync(entries[0])),
          {
            babelrc: false,
            presets: [
              path.join(__dirname, '/../../node_modules/@babel/preset-env')
            ]
          }
        );
        if (babelResult && babelResult.code) {
          const localeMap = eval(babelResult.code);
          if (localeMap[key]) {
            return new vscode.Hover(`${key}: ${localeMap[key]}`);
          }
          return new vscode.Hover('Specified key is not existed');
        }
        return new vscode.Hover('Cannot parse zh locale file');
      } catch (err) {
        return new vscode.Hover('Error occured');
      }
    }
  }
}
