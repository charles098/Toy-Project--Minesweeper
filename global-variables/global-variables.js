import level_options from "./level-options.js";
import { getLevel, changeElementSize, makeTableFromLevel } from "./functions.js";

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
makeTableFromLevel(box, options);

const cells = box.querySelectorAll('td');
const img = document.querySelector('img');

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