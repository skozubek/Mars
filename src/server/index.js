/**
 * Required External Modules
 */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || '4000';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// your API calls
/**
 * Routes Definitions
 */
// API call - photo of the day
app.get('/apod', async (req, res) => {
  try {
    const image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ image });
  } catch (err) {
    console.log('error:', err);
  }
});
// API call - rover's latest photos
app.get('/rovers', async (req, res) => {
  try {
    const { name } = req.query;
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/latest_photos?api_key=${process.env.API_KEY}`;
    console.log(url);
    const data = await fetch(url).then((res) => res.json());
    res.send({ data });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
