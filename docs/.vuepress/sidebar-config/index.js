const fs = require('fs');
const path = require('path');
const sidebarConfigList = getSideBarConfigList();
let sidebarConfig = {};
sidebarConfigList.forEach(config => {
  sidebarConfig = Object.assign(sidebarConfig, config);
});

function getSideBarConfigList() {
  const folderPath = path.resolve(__dirname, 'list');
  const configFiles = fs.readdirSync(folderPath);
  return configFiles.map(fileName => {
    const filePath = path.resolve(folderPath, fileName);
    return require(filePath);
  });
}

module.exports = sidebarConfig;
