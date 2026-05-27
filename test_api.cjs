const https = require('https');
const options = {
  hostname: 'commons.wikimedia.org',
  path: '/w/api.php?action=query&generator=search&gsrsearch=ice%20cream&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*',
  headers: {'User-Agent': 'CoolApp/1.0'}
};
https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.stringify(JSON.parse(data), null, 2).substring(0, 1000)));
});
