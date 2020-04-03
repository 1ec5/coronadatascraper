const imports = require('esm')(module);

const fs = imports('../src/shared/lib/fs.js');

function getShortName(location) {
  return location.name.replace(/(\s|,)+/g, '-').toLowerCase();
}

async function prepare() {
  console.log('🤹‍♀️ Preparing the sandbox...');

  await Promise.all([
    fs.ensureDir('src/http/get-sources/dist/'),
    fs.ensureDir('src/http/get-crosscheck/dist/'),
    fs.ensureDir('src/http/get-000location/dist/')
  ]);

  await Promise.all([
    fs.copyFile('dist/timeseries.json', 'public/timeseries.json'),
    fs.copyFile('dist/locations.json', 'public/locations.json'),
    fs.copyFile('dist/features.json', 'public/features.json'),
    fs.copyFile('dist/ratings.json', 'src/http/get-sources/dist/ratings.json'),
    fs.copyFile('dist/report.json', 'src/http/get-crosscheck/dist/report.json'),
    fs.copyFile('dist/timeseries.json', 'src/http/get-000location/dist/timeseries.json'),
    fs.copyFile('dist/features.json', 'src/http/get-000location/dist/features.json')
  ]);

  // Generate location map
  const locations = await fs.readJSON('dist/locations.json');
  const locationMap = {};
  for (const [index, location] of Object.entries(locations)) {
    const shortName = getShortName(location);
    location.id = index;
    locationMap[shortName] = location;
  }

  await fs.writeJSON('src/http/get-000location/dist/location-map.json', locationMap);
  await fs.writeJSON('src/http/get-index/dist/location-map.json', locationMap);
}

module.exports = prepare;
