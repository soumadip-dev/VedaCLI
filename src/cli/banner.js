import figlet from 'figlet';
import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';

//* Function to render the banner
function renderBanner() {
  const title = figlet.textSync('VEDA AI', {
    font: 'ANSI Shadow',
    horizontalLayout: 'fitted',
    verticalLayout: 'fitted',
    width: 80,
    whitespaceBreak: true,
  });

  const greenGradient = gradient('#10B981', '#34D399', '#A7F3D0');
  const titleWithGradient = greenGradient(title);

  const subtitle = ` ${chalk.hex('#10B981')('◆')} ${chalk.hex('#059669')(
    'Gemini-powered AI Assistant'
  )} ${chalk.hex('#047857')('◆')}`;

  const version = chalk.hex('#065F46')(`v${process.env.npm_package_version || '1.0.0'}`);
  const tagline = chalk.hex('#34D399').italic('Terminal intelligence reimagined');

  const bannerContent = [
    titleWithGradient,
    '',
    subtitle,
    chalk.hex('#059669')('─'.repeat(48)),
    tagline,
    version,
  ].join('\n');

  const boxedBanner = boxen(bannerContent, {
    padding: { top: 1, bottom: 1, left: 2, right: 2 },
    margin: 1,
    borderColor: '#10B981',
    borderStyle: 'round',
    textAlignment: 'center',
    backgroundColor: '#064E3B',
  });

  console.log(boxedBanner);
}

export { renderBanner };