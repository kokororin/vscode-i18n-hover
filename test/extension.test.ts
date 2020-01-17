import * as assert from 'assert';
import * as vscode from 'vscode';
import * as pkg from 'pjson';

suite('i18n Hover Test', () => {
  const extension = vscode.extensions.getExtension(
    `${pkg.author}.${pkg.name}`
  )!;

  test('extension should be present', () => {
    assert.ok(extension);
  });

  test('can activate', () => {
    return extension.activate().then(() => {
      assert.ok(true);
    });
  });
});
