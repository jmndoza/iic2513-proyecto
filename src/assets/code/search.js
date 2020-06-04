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
  const columns = ['courseName', 'courseCode', 'professorName', 'comment'];

  let cell;


  columns.forEach((col) => {
    cell = document.createElement('div');
    cell.classList.add('search-results-evaluation-attribute');
    cell.classList.add(`search-results-evaluation-${col}`);
    cell.innerHTML = data[col];
    row.appendChild(cell);
  });

  return row;
}

function removeChildren(element) {
  while (element.lastElementChild) {
    resultDiv.removeChild(element.lastElementChild);
  }
}

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

function inputHandler(event) {
  console.log('Input handler called');
  window.clearTimeout(inputTimer);
  inputTimer = window.setTimeout(searchHandler, 300);
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