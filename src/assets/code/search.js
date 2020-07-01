/* eslint-disable no-console */
let inputTimer;
let searchContainer;
let professorField;
let courseField;
let resultDiv;

function createRow(data) {
  const row = document.createElement('div');
  row.classList.add('search-results-evaluation');
  row.classList.add('card');
  const columns = ['courseCode', 'courseName', 'professorName', 'comment', 'timeRating', 'difficultyRating', 'year', 'semester'];
  const labels = {
    courseCode: 'Course Code',
    courseName: 'Course Name',
    professorName: 'Professor',
    comment: 'Comment',
    timeRating: 'Time',
    difficultyRating: 'Difficulty',
    year: 'Year',
    semester: 'Semester',
  };
  let cell;

  columns.forEach((col) => {
    cell = document.createElement('div');
    cell.classList.add('search-results-evaluation-attribute');
    cell.classList.add(`search-results-evaluation-${col}`);
    cell.innerHTML = `${labels[col]}: ${data[col]}`;
    row.appendChild(cell);
  });

  return row;
}

function removeChildren(element) {
  while (element.lastElementChild) {
    resultDiv.removeChild(element.lastElementChild);
  }
}

// eslint-disable-next-line no-unused-vars
async function searchHandler(event) {
  console.log('Search handler called');
  if (!professorField.value && !courseField.value) {
    removeChildren(resultDiv);
    return;
  }

  const url = `/evaluations/search?course=${encodeURIComponent(courseField.value)}&professor=${encodeURIComponent(professorField.value)}`;
  let response = await fetch(url);
  response = await response.json();

  removeChildren(resultDiv);
  response.forEach((evaluation) => {
    resultDiv.appendChild(createRow(evaluation));
  });
  console.log('Fetch returned');
}

// eslint-disable-next-line no-unused-vars
function inputHandler(event) {
  console.log('Input handler called');
  window.clearTimeout(inputTimer);
  inputTimer = window.setTimeout(searchHandler, 100);
}

window.onload = () => {
  searchContainer = document.getElementById('search-container');
  if (searchContainer) {
    professorField = document.getElementById('search-professor');
    courseField = document.getElementById('search-course');
    resultDiv = document.getElementById('search-results');
    professorField.addEventListener('input', inputHandler);
    courseField.addEventListener('input', inputHandler);
  }
};
