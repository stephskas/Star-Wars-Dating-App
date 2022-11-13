/*
STAR WARS DATING APP is a simple single page web app created with Vanilla JS. 
This is Pre-Work for CTD Advanced Classes to demonstrate knowledge of git,  HTML, CSS, and ability to make API calls.

User visits the app homepage and clicks a pulsing 'MATCH ME' button to find their intergalactic love match. 
Their match's attributes (Birth year, Hair color, Eye color, Height, Gender, Film Appearances, and Homeworld) are pulled from the Star Wars API and displayed along with the character's image. Images are stored locally and are named using the API's character id number so they can be easily added to the profile.  
The user can click on the match's Homeworld, a link to get more information about their match's homeworld (Climate, Terrain, Orbital Period, Population) to see if they would fit in. They can then navigate back to view their match's profile or find a new match.
 */
"use strict"
const container = document.querySelector(".container")
let characterHtmlSegment = ``

/* provide (10) API character IDs and onClick of button get random number between 1 and (10) to be used as index to select characterID. (Only 10 character images are available.) */
const characterIds = [1, 5, 11, 13, 14, 16, 21, 24, 45, 57]

document.getElementById("CTA").addEventListener("click", renderCharacter)

/* sets HTML back to previous segment */
function resetData(selectedData) {
  container.innerHTML = selectedData
}

/* Get API data for (films, homeworld) or randomly chosen character */
async function getData(selectedUrl) {
  let randomNum = Math.floor(Math.random() * 10)
  let id = characterIds[randomNum]
  try {
    let url = selectedUrl ? selectedUrl : `https://swapi.dev/api/people/${id}`
    let res = await fetch(url).then((resp) => resp.json())
    return res
  } catch (error) {
    console.log(error)
  }
  /*
  try {
    let url = selectedUrl ? selectedUrl : `https://swapi.tech/api/people/${id}`
    let res = await fetch(url)
    return res.json()
  } catch (error) {
    console.log(error)
  }
*/
}
/* Renders character data if available. Provides link for user to get the selected character's homeworld data. */
async function renderCharacter(selectedData) {
  const character = await getData()

  /* get character id which corresponds with character image name */
  const url = character.url
  const splitId = url.split("/")
  const id = splitId[5]
  /* get character's homeworld data */
  const homeworld = await getData(character.homeworld)
  /* get films character has been in */
  const filmUrls = character.films
  const filmList = []
  for (const filmUrl of filmUrls) {
    let film = await getData(filmUrl)
    filmList.push(film.title)
  }
  const films = filmList.join("<br>  ")

  characterHtmlSegment = `
        <div class="childContainer">
          <h2 class="center">YOUR MATCH</h2>
          <img src="img/${id}.jpg" />
          <h3 class="center">${character.name}</h3>
            <div class="userData">
              <p><span class="dataLabel">Birth year:</span> ${character.birth_year}</p>
              <p><span class="dataLabel">Hair color:</span> ${character.hair_color}</p>
              <p><span class="dataLabel">Eye color:</span> ${character.eye_color}</p>
              <p><span class="dataLabel">Height:</span> ${character.height}cm</p>
              <p><span class="dataLabel">Gender:</span> ${character.gender}</p>
              <p onClick="renderFilms('${character.films}', '${character.name}')"><span class="dataLabel">Film Appearances:</span> <br>${films}</p>
              <p onClick="renderHomeworld('${character.homeworld}', '${character.name}', '${homeworld.name}')"><span class="dataLabel">Homeworld:</span> <span class="link">${homeworld.name}</span></p>
            <button class="fullwidth" onClick = "renderCharacter()">NEXT</button>
         </div>
        </div>
        `
  /* Until user clicks button to get match, display no text */
  if (!selectedData) {
    container.innerHTML = characterHtmlSegment
  }
}
/* Renders homeworld data if known. Formats population number with commas. */
async function renderHomeworld(selectedUrl, characterName, homeworldName) {
  const homeworld = await getData(selectedUrl)
  const population = homeworld.population
    .toString()
    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
  homeworldName !== "unknown"
    ? (container.innerHTML = `
        <div class="childContainer">
          <h2 class="center">${characterName} Home:</h2>
            <h3 class="center">${homeworld.name}</h3>
            <div class="userData">
              <p><span class="dataLabel">Climate:</span> ${homeworld.climate}</p>
              <p><span class="dataLabel">Terrain:</span> ${homeworld.terrain}</p>
              <p><span class="dataLabel">Orbital Period:</span> ${homeworld.orbital_period}</p>
              <p><span class="dataLabel">Population:</span> ${population}</p>
            <div class="nav fullwidth">
              <button class="spacer-right" onClick="renderCharacter()">NEXT</button>
              <button onClick = "resetData(characterHtmlSegment)">BACK</button>
            </div>
         </div>
        </div>
        `)
    : null
}
/* Renders film data if known. */
async function renderFilms(selectedUrl, characterName) {
  const films = await getData(selectedUrl)
  container.innerHTML = `
        <div class="childContainer">
          <h3>${characterName} Films</h3>
            ${filmHtmlSegment}
            <div class="userData">
              <button onClick="renderCharacter()">Match Me</button>
            </div>
        </div>
   `
}
