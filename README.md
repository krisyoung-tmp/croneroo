# croneroo-js

Node.js library for parsing cron expressions to a table of field values.

# Getting started

```bash
npm install -g .
yarn global add .
```

# Usage

```bash
chroneroo parse "*/15 0 1,15 * 1-5 /usr/bin/find"

// minute 0 15 30 45
// hour 0
// day of month 1 15
// month 1 2 3 4 5 6 7 8 9 10 11 12
// day of week 1 2 3 4 5
// command /usr/bin/find

```

# Supported format

```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    └ command to execute
│    │    │    │    └───── day of week (0 - 6, 0 is Sun)
│    │    │    └────────── month (1 - 12)
│    │    └─────────────── day of month (1 - 31)
│    └──────────────────── hour (0 - 23)
└───────────────────────── minute (0 - 59)
```

Supports ranges and frequency within range (ie 10-29/5 will result in 10,15,20,25) where the frequency must be evenly divisible by the size of the range.

# Build

Testing is implemented using [AVA](https://github.com/avajs/ava)

```bash
yarn build
```

# Test

Testing is implemented using [AVA](https://github.com/avajs/ava)

```bash
yarn test
```

# Troubleshooting

If you're having trouble running croneroo, you may need to give the script execute permissions

```bash
chmod +x ./build/main/index.js
```
