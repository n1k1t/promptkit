import { TCollectFormat, TCollectOutput } from '../../types';

export interface ICollectCommandParameters {
  pattern: string | string[];

  format: TCollectFormat;
  output: TCollectOutput;

  ignore?: string;
  dest?: string;

  md?: {
    header?: string;
  };
}

export interface IMatchedFile {
  path: string;
  lang: string;

  code: string;
}

export interface IAiAnnotation extends IMatchedFile {
  prompt: string;
}
