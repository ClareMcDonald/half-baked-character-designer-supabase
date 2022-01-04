import { 
    checkAuth, 
    getCharacter,
    logout, 
    createDefaultCharacter,
    updateBottom,
    updateHead,
    updateMiddle,
    updateCatchphrases
} from '../fetch-utils.js';

checkAuth();

const headDropdown = document.getElementById('head-dropdown');
const middleDropdown = document.getElementById('middle-dropdown');
const bottomDropdown = document.getElementById('bottom-dropdown');
const headEl = document.getElementById('head');
const middleEl = document.getElementById('middle');
const bottomEl = document.getElementById('bottom');
const reportEl = document.getElementById('report');
const catchphrasesEl = document.getElementById('catchphrases');
const catchphraseInput = document.getElementById('catchphrase-input');
const catchphraseButton = document.getElementById('catchphrase-button');
const logoutButton = document.getElementById('logout');

// we're still keeping track of 'this session' clicks, so we keep these lets
let headCount = 0;
let middleCount = 0;
let bottomCount = 0;
//let catchphrasesArray = [];

headDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    headCount++;
    // update the head in supabase with the correct data
    const selectedHead = headDropdown.value;

    await updateHead(selectedHead);
    refreshData();
});


middleDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    middleCount++;
    // update the middle in supabase with the correct data
    const selectedMiddle = middleDropdown.value;

    await updateMiddle(selectedMiddle);
    refreshData();
});


bottomDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    bottomCount++;
    // update the bottom in supabase with the correct data
    const selectedBottom = bottomDropdown.value;

    await updateBottom(selectedBottom);
    refreshData();
});

catchphraseButton.addEventListener('click', async() => {
    // go fetch the old catch phrases
    const character = await getCharacter();

    // update the catchphrases array locally by pushing the new catchphrase into the old array
    character.catchphrases.push(catchphraseInput.value);

    await updateCatchphrases(character.catchphrases);

    // update the catchphrases in supabase by passing the mutated array to the updateCatchphrases function
    refreshData();
    catchphraseInput.value = '';
});

window.addEventListener('load', async() => {
    // on load, attempt to fetch this user's character
    const character = await getCharacter();
    
    // if this user turns out not to have a character
    // create a new character with correct defaults for all properties (head, middle, bottom, catchphrases)
    if (!character) {

        await createDefaultCharacter();

    }
    // and put the character's catchphrases in state (we'll need to hold onto them for an interesting reason);

    // then call the refreshData function to set the DOM with the updated data
    refreshData();
});

logoutButton.addEventListener('click', () => {
    logout();
});

function displayStats() {
    reportEl.textContent = `In this session, you have changed the head ${headCount} times, the body ${middleCount} times, and the pants ${bottomCount} times. And nobody can forget your character's classic catchphrases:`;
}



async function fetchAndDisplayCharacter() {
    // fetch the character from supabase
    const character = await getCharacter();
    
    // if the character has a head, display the head in the dom
    if (character.head) headEl.style.backgroundImage = `url(../assets/${character.head}-head.png)`;

    // if the character has a middle, display the middle in the dom
    if (character.middle) middleEl.style.backgroundImage = `url(../assets/${character.middle}-middle.png)`;

    // if the character has a pants, display the pants in the dom
    if (character.bottom) bottomEl.style.backgroundImage = `url('../assets/${character.bottom}-pants.png')`;

    // loop through catchphrases and display them to the dom (clearing out old dom if necessary)
    catchphrasesEl.textContent = '';

    for (let catchphrase of character.catchphrases) {
        const phraseEl = document.createElement('p');
        phraseEl.classList.add('catchphrases');
        phraseEl.textContent = catchphrase;

        catchphrasesEl.append(phraseEl);
    }
}

function refreshData() {
    displayStats();
    fetchAndDisplayCharacter();
}