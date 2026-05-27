import fetch from 'node-fetch';
fetch('https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=ice%20cream%20cone&prop=pageimages&piprop=original&pithumbsize=500&format=json')
  .then(r => r.json())
  .then(d => {
    const pages = d.query.pages;
    const images = Object.values(pages).map(p => p.thumbnail?.source || p.original?.source).filter(Boolean);
    console.log(images);
  });
