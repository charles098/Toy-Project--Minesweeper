import level_options from "./level-options.js";

const box = document.querySelector('table');
const container = document.querySelector('.container');
const menu = document.querySelector('.menu');
const level = getLevel() || 'easy';
const options = level_options[level];
const focusColor = '#DBDBDB';
const clickColor = '#EDF3F5';
const BgColor = '#C3C4CD';
const mousedown = { value: false };
const { row: rowNum, col: colNum, mine: mineNum } = options;

// 6x6 빈 행렬, 방문 배열 생성
const table = Array.from(Array(rowNum), () => Array(colNum).fill(0));

// 0: non-visit, 1: visit, 2: flag
const visit = Array.from(Array(rowNum), () => Array(colNum).fill(0));

const fix = Array.from(Array(rowNum), () => Array(colNum).fill(0));

// 요소 크기 변경
changeElementSize(box, container, menu, options);

// table 내부 요소 생성
makeTabelFromLevel(box, options);

const cells = box.querySelectorAll('td');
const img = document.querySelector('img');

// get level from querystring
function getLevel() {
    const queryString = new URLSearchParams(location.search);
    const level = queryString.get('level');
    return level;
}

// change element size by options
function changeElementSize(table, container, menu, options) {
    const { tWidth, tHeight } = options.table;
    const { cWidth, cHeight } = options.container;
    const { mWidth, mHeight } = options.menu;

    table.style.width = tWidth;
    table.style.height = tHeight;
    container.style.width = cWidth;
    container.style.height = cHeight;
    menu.style.width = mWidth;
    menu.style.height = mHeight;
}

// create table element by options
function makeTabelFromLevel(table, options) {
    const { row, col, width, height } = options;
    
    table.style.width = `${width}px`;
    table.style.height = `${height}px`;

    const trTags = Array(row).fill(0);
    const tdTags = Array(col).fill('<td></td>');

    const tableElements = trTags.map((_) => {
        const td = tdTags.join('');
        return `<tr>${td}</tr>`;
    }).join('')
    
    table.innerHTML = tableElements;
}

export { 
    cells, 
    box, 
    img, 
    table, 
    visit, 
    fix, 
    rowNum, 
    colNum,
    mineNum, 
    mousedown, 
    focusColor, 
    clickColor, 
    BgColor
}