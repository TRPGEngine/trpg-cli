const axios = require('axios');

const cmds = {};
let serverAddress = '';
const command = function(cmd, tip, fn, alias = []) {
  if(typeof alias === 'string') {
    alias = alias.split(',')
  }

  const payload = {
    cmd,
    tip,
    fn,
    alias,
  }
  cmds[cmd] = payload;

  if(alias.length > 0) {
    for (let a of alias) {
      cmds[a] = payload;
    }
  }
}

function query(path) {
  return axios.get(serverAddress + path).then(r => r.data);
}

command('help', '查看帮助', function() {
  console.log('当前可用的命令:')
  const tmp = Object.values(cmds).filter((v, i, a) => a.findIndex(_ => _.cmd === v.cmd) === i);
  for(let key in tmp) {
    const c = tmp[key];
    let alias = '';
    if(c.alias.length > 0) {
      alias = `(别名:${c.alias.join(',')})`;
    }
    console.log(' ', c.cmd, c.tip, alias);
  }
}, ['ls'])

command('nums', '列出当前在线用户人数', async function() {
  const nums = await query('/admin/api/player/_onlineCount');
  console.log('当前在线用户人数:' + nums);
})

command('exit', '退出交互终端', async function() {
  console.log('bye!');
  process.exit();
}, ['q'])

module.exports = {
  async run(cmd, args, cb) {
    cmd = cmd.trim();
    if(cmds[cmd]) {
      let ret = await cmds[cmd].fn();
      if(ret) {
        cb(null, ret);
      }else {
        cb(null);
      }
    }else if(cmd.length > 0) {
      cb('不存在的命令, 输入help查看命令列表');
    }else {
      cb();
    }
  },
  setServerAddress(address) {
    serverAddress = address;
  }
};
