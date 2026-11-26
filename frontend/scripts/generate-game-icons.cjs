'use strict';
const fs = require('fs');
const path = require('path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const icons = require('react-icons/gi');
const ids = Object.keys(icons).filter(id => /^Gi[A-Z][A-Za-z0-9]*$/.test(id));
if (ids.length < 1000) throw new Error('Incomplete Game Icons catalogue');
const directory = path.join(__dirname, '..', 'public', 'game-icons');
const manifest = path.join(__dirname, '..', 'src', 'generated', 'game-icons.json');
fs.mkdirSync(directory, {recursive:true});
fs.mkdirSync(path.dirname(manifest), {recursive:true});
for (const id of ids) {
    const svg = renderToStaticMarkup(React.createElement(icons[id], {size: 24, color: '#000'}));
    if (!svg.startsWith('<svg')) throw new Error('Invalid icon: ' + id);
    fs.writeFileSync(path.join(directory, id + '.svg'), svg);
}
fs.writeFileSync(manifest, JSON.stringify(ids));
fs.writeFileSync(path.join(directory, 'ATTRIBUTION.txt'), 'Game-icons.net illustrations distributed by react-icons/gi. CC BY 3.0: https://creativecommons.org/licenses/by/3.0/ . Original artwork and author credits: https://game-icons.net/ . Converted to standalone SVG for use as monochrome CSS masks.\n');
console.log('Generated ' + ids.length + ' Game Icons as independent SVG assets.');
