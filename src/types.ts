import { ConvertTupleToUnion } from '../types';

export type TCollectFormat = ConvertTupleToUnion<typeof LCollectFormat>;
export const LCollectFormat = <const>['json', 'md', 'yaml', 'continuedev', 'finetuning'];

export type TCollectOutput = ConvertTupleToUnion<typeof LCollectOutput>;
export const LCollectOutput = <const>['stdout', 'file'];

export interface IPromptkitCliOptions {
  collect: {
    format: TCollectFormat;
    output: TCollectOutput;

    dist?: string;
    ignore?: string;
  };
}
