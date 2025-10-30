import chalk from 'chalk';
import boxen from 'boxen';

export function printSystem(text) {
  const boxed = boxen(chalk.hex('#FFD700')(text), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#FF9933',
  });
  console.log(boxed);
}
