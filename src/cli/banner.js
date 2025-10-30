import figlet from 'figlet';
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';

//* Function to render the banner
function renderBanner() {
  const titleGradient = gradient('#FF9933', '#FFD700', '#8B0000');
  const accentGradient = gradient('#FF9933', '#8B0000');

  const title = figlet.textSync('VEDA', {
    font: 'Delta Corps Priest 1',
    horizontalLayout: 'fitted',
    verticalLayout: 'fitted',
    width: 78,
    whitespaceBreak: true,
  });

  const subtitle = ` ${chalk.hex('#FFD700')('◈')} ${accentGradient(
    'Gemini-powered AI Assistant'
  )} ${chalk.hex('#8B0000')('◈')}`;

  const version = chalk.hex('#8B4513')(`v${process.env.npm_package_version || '1.0.0'}`);
  const tagline = chalk.hex('#D2691E')(' Terminal intelligence reimagined');

  const bannerContent = [
    titleGradient.multiline(title),
    subtitle,
    chalk.hex('#CD853F')('┄'.repeat(42)),
    tagline,
    version,
  ].join('\n');

  const boxedBanner = boxen(bannerContent, {
    padding: 1,
    margin: 1,
    borderColor: '#FF9933',
    borderStyle: 'round',
    textAlignment: 'center',
    float: 'center',
  });

  console.log(boxedBanner);
}

export { renderBanner };
