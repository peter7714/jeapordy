// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const table = document.querySelector('#board');
const btn = document.querySelector('.btn');

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

function getCategoryIds() {
    let catIds = []
    let idGenerator = ((x) => {
        return Math.floor(Math.random() * 27723);
    });
    for(let i = 0; i < 6; i++){
        catIds.push(idGenerator());
    }
    return catIds;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategories(catIds) {
    for( let id of catIds){
        categories.push(await axios.get(`https://jservice.io/api/category?id=${id}`));
    };
    return categories;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    let top = document.createElement('tr');
    table.classList.add('deployed');
    top.setAttribute('id', 'category');
    table.addEventListener('click', handleClick);
    for(let i = 0; i <= 5; i++){
        let category = document.createElement('th');
        category.innerText = `${categories[i].data.title}`;
        top.append(category);
    }
    table.append(top);
    for(let y = 0; y <= 4; y++){
        let row = document.createElement('tr');
        for(let x = 0; x <= 5; x++){
            let question = document.createElement('td');
            question.setAttribute('data-y', `${y}`);
            question.setAttribute('data-x', `${x}`);
            question.innerText = '?';
            row.append(question);
        }
        table.append(row);
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    const cell = evt.target;
    const cat = evt.target.dataset.x;
    const clue = evt.target.dataset.y;
    if(cell.innerText === '?'){
        return cell.innerHTML = `${categories[cat].data.clues[clue].question}`;
    } else return cell.innerHTML = `${categories[cat].data.clues[clue].answer}`;

}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    const loader = document.querySelector('#load');
    const dimmer = document.querySelector('#dimmer');
    loader.classList.add('loader');
    dimmer.classList.add('dim');
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    const loader = document.querySelector('#load');
    const dimmer = document.querySelector('#dimmer');
    loader.classList.remove('loader');
    dimmer.classList.remove('dim');
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    table.innerHTML = '';
    categories = [];
    let catIds = getCategoryIds();
    showLoadingView();
    await getCategories(catIds);
    fillTable();
    hideLoadingView();
    btn.innerText = 'Restart!';
}

/** On click of start / restart button, set up game. */

// TODO

btn.addEventListener('click', setupAndStart);
