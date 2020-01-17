import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as babel from '@babel/core';

export class Code {
  private static cacheMap = new Map<string, string>();
  private hash: string;
  private code: string;

  public constructor(filePath: string) {
    this.code = String(fs.readFileSync(filePath));
    this.hash = crypto
      .createHash('sha1')
      .update(this.code)
      .digest('base64');
  }

  public async transform() {
    if (Code.cacheMap.has(this.hash)) {
      return Code.cacheMap.get(this.hash)!;
    }

    const result = await babel.transformAsync(this.code, {
      babelrc: false,
      presets: [
        path.join(__dirname, '/../../../node_modules/@babel/preset-env')
      ]
    });
    if (result && result.code) {
      Code.cacheMap.set(this.hash, result.code);
      return result.code;
    }
    return this.code;
  }

  public async run() {
    // eslint-disable-next-line no-eval
    return eval(await this.transform());
  }
}
