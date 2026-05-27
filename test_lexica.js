import fetch from 'node-fetch';
fetch('https://lexica.art/api/v1/search?q=ice%20cream')
  .then(r => r.json())
  .then(d => console.log(d.images.slice(0,2).map(i => i.src)));
