import figlet from 'figlet';
import chalk from 'chalk';
import boxen from 'boxen';

//* Function to render the banner
function renderBanner() {
  const title = figlet.textSync('VEDA', {
    font: 'Standard',
    horizontalLayout: 'fitted',
    verticalLayout: 'fitted',
    width: 78,
    whitespaceBreak: true,
  });

  const subtitle = ` ${chalk.hex('#10B981')('◆')} ${chalk.hex('#059669')(
    'Gemini-powered AI Assistant'
  )} ${chalk.hex('#047857')('◆')}`;

  const version = chalk.hex('#065F46')(`v${process.env.npm_package_version || '1.0.0'}`);
  const tagline = chalk.hex('#059669')('Terminal intelligence reimagined');

  const bannerContent = [
    chalk.hex('#10B981')(title),
    subtitle,
    chalk.hex('#059669')('┈'.repeat(42)),
    tagline,
    version,
  ].join('\n');

  const boxedBanner = boxen(bannerContent, {
    padding: 1,
    margin: 1,
    borderColor: '#10B981',
    borderStyle: 'round',
    textAlignment: 'center',
  });

  console.log(boxedBanner);
}

export { renderBanner };
