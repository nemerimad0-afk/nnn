import fetch from 'node-fetch';
fetch('https://unsplash.com/napi/search/photos?query=ice%20cream&per_page=10')
  .then(r => r.json())
  .then(d => console.log(d.results.slice(0,2).map(i => i.urls.regular)));
