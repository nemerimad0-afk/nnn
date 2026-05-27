const fetch = require('node-fetch');
fetch('https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=ice%20cream&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*')
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)));
