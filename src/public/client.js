// keeps the App state - mutable
let store = {
  apod: '',
  selectedRover: '',
  latestPhotos: {},
  // rovers list is immutable
  rovers: Immutable.List(['curiosity', 'opportunity', 'spirit']),
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};
// Pure function that renders header
const renderHeader = () => `
        <h1>Hello! Welocome on Mars Rovers Dashboard!</h1>
    `;
// Pure function that renders list of rovers to choose from
const renderRoversList = (rovers, selectedRover) => {
  if (selectedRover === 'curiosity') {
    return `
              <select name="rovers" id="rovers" onchange="selectRover()">
                <option value="${rovers.get(0)}">${rovers.get(0)}</option>
                <option value="${rovers.get(1)}">${rovers.get(1)}</option>
                <option value="${rovers.get(2)}">${rovers.get(2)}</option>
              </select>
            `;
  }

  if (selectedRover === 'opportunity') {
    return `
              <select name="rovers" id="rovers" onchange="selectRover()">
                <option value="${rovers.get(1)}">${rovers.get(1)}</option>
                <option value="${rovers.get(0)}">${rovers.get(0)}</option>
                <option value="${rovers.get(2)}">${rovers.get(2)}</option>
              </select>
            `;
  }
  if (selectedRover === 'spirit') {
    return `
              <select name="rovers" id="rovers" onchange="selectRover()">
                <option value="${rovers.get(2)}">${rovers.get(2)}</option>
                <option value="${rovers.get(0)}">${rovers.get(0)}</option>
                <option value="${rovers.get(1)}">${rovers.get(1)}</option>
              </select>
            `;
  }

  return `
              <select name="rovers" id="rovers" onchange="selectRover()">
                <option value="">select rover</option>
                <option value="${rovers.get(0)}">${rovers.get(0)}</option>
                <option value="${rovers.get(1)}">${rovers.get(1)}</option>
                <option value="${rovers.get(2)}">${rovers.get(2)}</option>
              </select>
            `;
};

// Pure function that renders selecte rover's base data
const renderRoverBaseData = (roverName) => {
  if (roverName !== '') {
    const baseData = store.latestPhotos.image.latest_photos[0];
    return `
              <ul>
                <li>Landing date: ${baseData.rover.landing_date}</li>
                <li>Launch date: ${baseData.rover.launch_date}</li>
                <li>Status: ${baseData.rover.status}</li>
                <li>Most recent available photos: ${baseData.earth_date}</li>
              </ul>
              <h3>Let's see what are ${roverName}'s latest photos</h3>
            `;
  }
  return `
        <h1>Hello!</h1>
    `;
};

// Pure function that renders selected rover heading
const renderSelectedRoverHeader = (roverName) => {
  if (roverName !== '') {
    return `
      <h3>You selected ${roverName}!</h3>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

// create content
const App = (state) => {
  const { rovers, apod, selectedRover } = state;
  return `
        <header>${renderHeader()}</header>
        <main>
            <section>
                <h3>Choose the rover from the list below:</h3>
                ${renderRoversList(rovers, selectedRover)}
                ${renderSelectedRoverHeader(selectedRover)}

                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS
const selectRover = () => {
  const selectedElement = document.getElementById('rovers');
  if (selectedElement !== null) {
    const selectedRover = selectedElement.value;
    console.log(`selected rover: ${selectedRover}`);
    updateStore({ selectedRover });
    const url = new URL('http://localhost:3000/rovers');
    url.searchParams.append('name', selectedRover);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const latestPhotos = data;
        updateStore({ latestPhotos });
      });
  }
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === 'video') {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  }
  return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
};

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
  const { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore({ apod }));

  return data;
};
