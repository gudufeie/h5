const hostConfig = {
  hostUrl: 'https://industry-cloud-wx-backend-dev.uworks.cc',
  pcHostUrl: 'https://industry-cloud-backend-dev.uworks.cc',
}
var domain = window.location.host;
domain = domain.split(".")[0];
if (domain.indexOf("test") >= 0) {
  hostConfig.hostUrl = 'https://industry-cloud-wx-backend-test.uworks.cc';
  hostConfig.pcHostUrl = 'https://industry-cloud-backend-test.uworks.cc';
} else if (domain.indexOf("dev") >= 0) {
  hostConfig.hostUrl = 'https://industry-cloud-wx-backend-dev.uworks.cc';
  hostConfig.pcHostUrl = 'https://industry-cloud-backend-dev.uworks.cc';
} else {
  hostConfig.hostUrl = 'https://industry-wx.trenshion.com';
  // hostConfig.hostUrl = 'http://10.234.16.168:9999';
  // hostConfig.hostUrl = 'https://backend.iuindustry.com';
  // hostConfig.pcHostUrl = 'https://api.iuindustry.com';
}

export default hostConfig
