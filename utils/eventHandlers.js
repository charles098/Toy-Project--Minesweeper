import { 
    cells, 
    box, 
    img, 
    table, 
    visit, 
    fix, 
    rowNum, 
    colNum,
    mousedown, 
    focusColor, 
    BgColor
} from '../global-variables/global-variables.js';
import {
    gameOver,
    findAll,
    setMine,
    checkwin,
    paintAround, 
    updateAround,
    pushVal
} from './functions.js';

export function mouseOverHandler(e){
    let row = e.target.dataRow;
    let col = e.target.dataCol;
    if(mousedown.value && e.target.tagName === 'TD'){
        // 방문 안한 경우 그 칸만 색 변화
        if(visit[row][col] === 0) e.target.style.backgroundColor = focusColor;
        
        // 방문한 경우 주변에 방문하지 않은 칸 모두 색 변화
        if(visit[row][col] === 1){
            paintAround(row, col, 'on');
        }
    }
}

export function mouseOutHandler(e){
    let row = e.target.dataRow;
    let col = e.target.dataCol;
    if(mousedown.value && e.target.tagName === 'TD'){
        if(visit[row][col] === 0) e.target.style.backgroundColor = BgColor;
        
        // 방문한 경우 주변에 방문하지 않은 칸 모두 색 변화
        if(visit[row][col] === 1){
            paintAround(row, col, 'off');
        }
    }
}

// 깃발: 무반응. visit == 2
// 빈칸: 빈칸만 hover. visit == 0
// 빈칸 아님: 자기 테두리에 빈칸 아닌 칸들 hover. visit == 1
export function mouseDownHandler(e){
    let row = e.target.dataRow;
    let col = e.target.dataCol;
    mousedown.value = true;

    if(e.target.tagName === 'TD'){
        if(e.button === 0 || e.button === 2){
            // 빈칸: 빈칸만 hover. visit == 0
            // 빈칸 아님: 자기 테두리에 빈칸 아닌 칸들 hover. visit == 1
            if(visit[row][col] === 0){
                e.target.style.backgroundColor = focusColor;
            }
            if(visit[row][col] === 1 && e.button !== 2){
                paintAround(row, col, 'on');
            }
        }
    }
}

export function mouseUpHandler(e){
    let row = e.target.dataRow;
    let col = e.target.dataCol;
    mousedown.value = false;
    
    if(e.target.tagName === 'TD'){
        // 클릭으로 인한 색 변경 취소
        if(e.target.style.backgroundColor === focusColor){
            e.target.style.backgroundColor = BgColor;
        }

        if(e.button === 2){
            if(visit[row][col] === 2){
                // 깃발 있으면 없앰
                visit[row][col] = 0;
                e.target.style.backgroundImage = "url('')";
                updateAround(row, col, '+');
            }
            else if(visit[row][col] === 0){
                // 깃발 없으면 삽입
                visit[row][col] = 2;
                pushVal(row, col, -2);
                e.target.style.backgroundColor = BgColor;
                updateAround(row, col,'-');
            }
        }
        if(e.button === 0){
            paintAround(row, col, 'off');

            if(visit[row][col] === 0){ 
                visit[row][col] = 1;
                if(fix[row][col] === -1){
                    // 지뢰 밟아서 게임끝
                    gameOver(row, col);
                }
                if(table[row][col] > 0){
                    // 값이 0이 아니면 그 칸만 색칠
                    pushVal(row, col, fix[row][col]);
                }
                if(table[row][col] === 0){
                    // 값이 0이면 bfs로 탐색해서 가능한 칸 모두 색칠
                    pushVal(row, col, fix[row][col]);
                    findAll(row, col);
                }
            }
            else if(visit[row][col] === 1){ 
                // 방문한 경우 - 인접한 칸 검사해서 가능한거 다 표시. 깃발 칸은 값을 0으로 본다
                findAll(row, col);
            }
        }
    }
    checkwin();
}

// 사진 클릭시 초기화
export function init(e){
    img.src = "./images/smile.png";
    
    for(let i = 0; i < rowNum; i++){
        for(let j = 0; j < colNum; j++){
            table[i][j] = 0;
            visit[i][j] = 0;
            fix[i][j] = 0;
            cells[colNum * i + j].style.backgroundImage = "url('')";
            cells[colNum * i + j].style.backgroundColor = BgColor;
        }
    }
    box.style.pointerEvents = 'auto';
    setMine();
}