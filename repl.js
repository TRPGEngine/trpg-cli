const repl = require('repl');
const chalk = require('chalk');
const axios = require('axios');
const cfonts = require('cfonts');
const command = require('./repl/cmd');

async function checkLink(address) {
  console.log(chalk.white.bgBlue(` 正在尝试连接服务器:${address}... `));
  let ret = await axios.get(address);
  let code = ret.status;
  if(code === 200) {
    command.setServerAddress(address)
    return true;
  }
  return false;
}

function start() {
  let r = repl.start({
    prompt: 'trpg > ',
    useGlobal: false,
    eval: function(cmd, context, filename, callback) {
      command.run(cmd, {}, callback);
    }
  });
  r.on('exit', () => {
    console.log('bye!')
  })
}

module.exports = async function(host, port) {
  // cfonts.say('TRPG Engine', {
  //   font: 'block',
  //   align: 'center',
  //   colors: ['system'],
  //   background: 'transparent',
  //   letterSpacing: 1,
  //   lineHeight: 1,
  //   space: true,
  //   maxLength: '0',
  // })

  let ret = await checkLink(`http://${host}:${port}`);
  if(!ret) {
    console.log(chalk.white.bold.bgRed(' 服务器连接失败, 请检查您的服务器是否运行成功 '));
    return;
  }
  console.log(chalk.cyan.bold(` 连接成功 `));
  start();
}
