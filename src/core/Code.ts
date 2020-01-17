import * as fs from 'fs';
import * as crypto from 'crypto';
import * as babel from '@babel/core';
import * as findBabelConfig from 'find-babel-config';

export class Code {
  private static cacheMap = new Map<string, string>();
  private hash: string;
  private code: string;
  private cwd: string;

  public constructor(filePath: string, cwd: string) {
    this.cwd = cwd;
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

    let babelConfig: any;
    try {
      babelConfig = await findBabelConfig(this.cwd);
    } catch (err) {
      babelConfig = false;
    }
    let transformOptions: babel.TransformOptions = {
      babelrc: false,
      cwd: this.cwd
    };
    if (babelConfig && babelConfig.config) {
      transformOptions = {
        ...transformOptions,
        ...babelConfig.config
      };
    } else {
      transformOptions = {
        ...transformOptions,
        presets: ['@babel/preset-env']
      };
    }

    const result = await babel.transformAsync(this.code, transformOptions);
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
