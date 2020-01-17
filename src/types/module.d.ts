declare module 'markdown-table' {
  const markdownTable: (table: any[], options?: any) => string;
  export = markdownTable;
}

declare module 'find-babel-config' {
  interface FindResult {
    file: string;
    config: any;
  }
  const findBabelConfig: (directory: string) => Promise<FindResult>;
  export = findBabelConfig;
}
