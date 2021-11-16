#!/usr/bin/env node
import { program } from 'commander';

import { parse } from './lib/parse';
import { table } from './lib/table';

program.version('0.0.1').description('Cron expression parser');

program
  .command('parse <expr>')
  .alias('p')
  .description('parse the specified expression')
  .action((expr) => {
    let result;
    try {
      result = table(parse(expr));
    } catch (err: any) {
      result = err.message;
    }

    process.stdout.write(result);
  });

program.parse(process.argv);
