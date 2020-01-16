import * as path from 'path';
import * as fs from 'fs';
import * as babel from '@babel/core';

export class Code {
  private static cacheMap = new Map<string, string>();
  private filePath: string;
  private code: string;

  public constructor(filePath: string) {
    this.filePath = filePath;
    this.code = String(fs.readFileSync(filePath));
  }

  public transform() {
    if (Code.cacheMap.has(this.filePath)) {
      return Code.cacheMap.get(this.filePath)!;
    }

    const result = babel.transform(this.code, {
      babelrc: false,
      presets: [
        path.join(__dirname, '/../../../node_modules/@babel/preset-env')
      ]
    });
    if (result && result.code) {
      Code.cacheMap.set(this.filePath, result.code);
      return result.code;
    }
    return this.code;
  }

  public run() {
    // eslint-disable-next-line no-eval
    return eval(this.transform());
  }
}
