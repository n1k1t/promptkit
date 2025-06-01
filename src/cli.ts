#!/usr/bin/env node

import { Command, program } from 'commander';

import { IPromptkitCliOptions, LCollectFormat, LCollectOutput, TCollectFormat, TCollectOutput } from './types';
import { cast } from './utils';

import * as commands from './commands';
import env from './env';

program
  .description('It helps to setup AI code assistants with prompt annotations')
  .addCommand(
    new Command()
      .command('collect [pattern]')
      .description('Collects @ai annotations with code by provided path pattern')
      .option(`-f --format [${LCollectFormat.join('|')}]`, 'Annotations format', cast<TCollectFormat>('md'))
      .option(`-o --output [${LCollectOutput.join('|')}]`, 'Annotations output', cast<TCollectOutput>('file'))
      .option(`-d --dest [value]`, 'Destination path for a file')
      .option(`-i --ignore [value]`, 'Ignore pattern', env.ignore)
      .action(async (pattern, options: IPromptkitCliOptions['collect'], command: Command) =>
        commands.collect({ pattern: command.args, ...options })
      )
  )
  .parse();
