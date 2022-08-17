import { 
    cells, 
    box, 
    img, 
    table, 
    visit, 
    fix, 
    rowNum, 
    colNum,
    mineNum, 
    focusColor, 
    clickColor, 
    BgColor
} from '../global-variables/global-variables.js';


export function gameOver(row, col){
    cells[colNum * row + col].style.backgroundColor = '#E38985';
    box.style.pointerEvents = 'none';
    for(let i = 0; i < rowNum; i++){
        for(let j = 0; j < colNum; j++){
            if(fix[i][j] == -1 && visit[i][j] != 2) pushVal(i, j, -1);

            // 지뢰가 아닌데 깃발 표시한거면 잘못. 표시해준다
            if(visit[i][j] == 2 && fix[i][j] != -1) cells[colNum * i + j].style.backgroundColor = '#F6D6CF';
        }
    }
    img.src = "./images/lose.png";
    setTimeout(() => alert('Game over'), 50);
}

export function findAll(row, col){
    // (table[row][col] == 0)인 경우 
    // 1. 인접칸 중 방문하지 않은 칸 모두 큐에 담는다.
    // 2. 큐에 하나씩 뽑으면서 방문처리 하고 색칠한 뒤에 또 값이 0이면 방문하지 않은 칸 담는다. 큐 빌때까지 계속작업. 
    let q = [], zero = [], loc, i, j, tmp;

    if(table[row][col] == 0){
        q.push([row, col]);
        zero.push([row, col]);
    } 

    while(q.length !== 0){
        loc = q.shift();
        tmp = []
        pushAround(loc[0], loc[1], tmp);
        for(let elem of tmp){
            i = elem[0];
            j = elem[1];
            
            if(table[i][j] == 0){
                q.push([i,j]);
                zero.push([i,j]);
                visit[i][j] = 1;
                pushVal(i, j, fix[i][j]);
            }
        }
    }

    for(let elem of zero){
        paintAround(elem[0], elem[1], 'bfs');
    }
}


// 중복 없이 네 지점에 지뢰 설치 및 위치 정보 초기화
// 숫자는 근접한 위치에 존재하는 지뢰 개수를 의미한다
export function setMine(){

    // 지뢰 초기화
    let tmp = []
    for(let i = 0; i < cells.length; i++){
        tmp.push(i);
    }
    let row, col, idx;
    for(let i = 0; i < mineNum; i++){ 
        idx = tmp.splice(Math.floor(Math.random() * tmp.length),1)[0]
        row = parseInt(idx / colNum);
        col = idx % colNum;
        table[row][col] = -1;
        fix[row][col] = -1;
    }

    // 나머지 숫자 초기화 + cells에 id 추가
    for(let i = 0; i < rowNum; i++){
        for(let j = 0; j < colNum; j++){
            if(table[i][j] == 0){
                table[i][j] = myNum(i,j);
                fix[i][j] = myNum(i,j);
            }
            cells[colNum * i + j].dataRow = i;
            cells[colNum * i + j].dataCol = j;
        }
    }
}


// visit == 0이 하나도 없으면 이긴것
export function checkwin(){
    let check = true;
    for(let i = 0; i < rowNum; i++){
        for(let j = 0; j < colNum; j++){
            if(visit[i][j] == 0) check = false;
        }
    }

    if(check){
        img.src = "./images/win.png";
        setTimeout(() => alert('Congratulation!'), 50);
        visit[0][0] = 0;
    }
}

// 마우스 눌렀을때 주변칸 색칠
export function paintAround(i, j, paint){
    let color, r, c;
    let end = false;
    if(paint == 'on') color = focusColor; 
    if(paint == 'off') color = BgColor; 
    if(paint == 'bfs') color = clickColor;
    
    if(isRange(i, j+1) && visit[i][j+1] == 0){
        if(paint == 'bfs'){
            if(fix[i][j+1] == -1){
                end = true;
                r = i;
                c = j+1;
            } 
            else{
                visit[i][j+1] = 1;
                pushVal(i,j+1,fix[i][j+1]);
            }
        }
        else cells[colNum * i + (j+1)].style.backgroundColor = color; //동 : [row][col+1]
    }
    if(isRange(i-1, j+1) && visit[i-1][j+1] == 0){
        if(paint == 'bfs'){
            if(fix[i-1][j+1] == -1){
                end = true;
                r = i-1;
                c = j+1;
            }
            else{
            visit[i-1][j+1] = 1;
            pushVal(i-1,j+1,fix[i-1][j+1]);
            }
        }
        else cells[colNum * (i-1) + (j+1)].style.backgroundColor = color; // 동북 : [row-1][col+1]
    }
    if(isRange(i-1, j) && visit[i-1][j] == 0){
        if(paint == 'bfs'){
            if(fix[i-1][j] == -1){
                end = true;
                r = i-1;
                c = j;
            }
            else{
                visit[i-1][j] = 1;
                pushVal(i-1,j,fix[i-1][j]);
            }
        }
        else cells[colNum * (i-1) + (j)].style.backgroundColor = color; // 북 : [row-1][col]
    }
    if(isRange(i-1, j-1) && visit[i-1][j-1] == 0){
        if(paint == 'bfs'){
            if(fix[i-1][j-1] == -1){
                end = true;
                r = i-1;
                c = j-1;
            }
            else{ 
                visit[i-1][j-1] = 1;
                pushVal(i-1,j-1,fix[i-1][j-1]);
            }
        }
        else cells[colNum * (i-1) + (j-1)].style.backgroundColor = color; // 북서 : [row-1][col-1]
    }
    if(isRange(i, j-1) && visit[i][j-1] == 0){
        if(paint == 'bfs'){
            if(fix[i][j-1] == -1){
                end = true;
                r = i;
                c = j-1;
            }
            else{
                visit[i][j-1] = 1;
                pushVal(i,j-1,fix[i][j-1]);
            }
        }
        else cells[colNum * i + (j-1)].style.backgroundColor = color; // 서 : [row][col-1]
    }
    if(isRange(i+1, j-1) && visit[i+1][j-1] == 0){
        if(paint == 'bfs'){
            if(fix[i+1][j-1] == -1){
                end = true;
                r = i+1;
                c = j-1;
            }
            else{
                visit[i+1][j-1] = 1;
                pushVal(i+1,j-1,fix[i+1][j-1]);
            }
        }
        else cells[colNum * (i+1) + (j-1)].style.backgroundColor = color; // 남서 : [row+1][col-1]
    }
    if(isRange(i+1, j) && visit[i+1][j] == 0){
        if(paint == 'bfs'){
            if(fix[i+1][j] == -1){
                end = true;
                r = i+1;
                c = j;
            }
            else{
                visit[i+1][j] = 1;
                pushVal(i+1,j,fix[i+1][j]);
            }
        }
        else cells[colNum * (i+1) + (j)].style.backgroundColor = color; // 남 : [row+1][col]
    }
    if(isRange(i+1, j+1) && visit[i+1][j+1] == 0){
        if(paint == 'bfs'){
            if(fix[i+1][j+1] == -1){
                end = true;
                r = i+1;
                c = j+1;
            }
            else{
                visit[i+1][j+1] = 1;
                pushVal(i+1,j+1,fix[i+1][j+1]);
            }
        }
        else cells[colNum * (i+1) + (j+1)].style.backgroundColor = color; // 동남 : [row+1][col+1]
    }

    if(end) gameOver(r,c);
}


// 깃발에 따른 인접칸 번호 초기화
export function updateAround(row, col, how){
    if(how == '-'){
        if(isRange(row, col+1) && table[row][col+1] != -1) table[row][col+1] -= 1; //동 : [row][col+1]
        if(isRange(row-1, col+1) && table[row-1][col+1] != -1) table[row-1][col+1] -= 1; // 동북 : [row-1][col+1]
        if(isRange(row-1, col) && table[row-1][col] != -1) table[row-1][col] -= 1; // 북 : [row-1][col]
        if(isRange(row-1, col-1) && table[row-1][col-1] != -1) table[row-1][col-1] -= 1; // 북서 : [row-1][col-1]
        if(isRange(row, col-1) && table[row][col-1] != -1) table[row][col-1] -= 1; // 서 : [row][col-1]
        if(isRange(row+1, col-1) && table[row+1][col-1] != -1) table[row+1][col-1] -= 1; // 남서 : [row+1][col-1]
        if(isRange(row+1, col) && table[row+1][col] != -1) table[row+1][col] -= 1; // 남 : [row+1][col]
        if(isRange(row+1, col+1) && table[row+1][col+1] != -1) table[row+1][col+1] -= 1; // 동남 : [row+1][col+1]
    }
    if(how == '+'){
        if(isRange(row, col+1) && table[row][col+1] != -1) table[row][col+1] += 1; //동 : [row][col+1]
        if(isRange(row-1, col+1) && table[row-1][col+1] != -1) table[row-1][col+1] += 1; // 동북 : [row-1][col+1]
        if(isRange(row-1, col) && table[row-1][col] != -1) table[row-1][col] += 1; // 북 : [row-1][col]
        if(isRange(row-1, col-1) && table[row-1][col-1] != -1) table[row-1][col-1] += 1; // 북서 : [row-1][col-1]
        if(isRange(row, col-1) && table[row][col-1] != -1) table[row][col-1] += 1; // 서 : [row][col-1]
        if(isRange(row+1, col-1) && table[row+1][col-1] != -1) table[row+1][col-1] += 1; // 남서 : [row+1][col-1]
        if(isRange(row+1, col) && table[row+1][col] != -1) table[row+1][col] += 1; // 남 : [row+1][col]
        if(isRange(row+1, col+1) && table[row+1][col+1] != -1) table[row+1][col+1] += 1; // 동남 : [row+1][col+1]
    }
}

export function pushVal(row, col, number){
    let elem = cells[colNum * row + col];

    switch(number){
        case -2: // 깃발 - 사진
            elem.style.backgroundImage = "url('./images/flag.png')";
            break;
        case -1: // 지뢰 - 사진
            elem.style.backgroundImage = "url('./images/bomb.png')";
            break;
        case 0:
            elem.style.backgroundColor = clickColor;
            break;
        case 1:
            elem.style.backgroundImage = "url('./images/one.png')";
            elem.style.backgroundColor = clickColor;
            break;
        case 2:
            elem.style.backgroundImage = "url('./images/two.png')";
            elem.style.backgroundColor = clickColor;
            break;
        case 3:
            elem.style.backgroundImage = "url('./images/three.png')";
            elem.style.backgroundColor = clickColor;
            break;
        case 4:
            elem.style.backgroundImage = "url('./images/four.png')";
            elem.style.backgroundColor = clickColor;
            break;
        case 5:
            elem.style.backgroundImage = "url('./images/five.png')";
            elem.style.backgroundColor = clickColor;
            break;
        case 6:
            elem.style.backgroundImage = "url('./images/six.png')";
            elem.style.backgroundColor = clickColor;
            break;
        case 7:
            elem.style.backgroundImage = "url('./images/seven.png')";
            elem.style.backgroundColor = clickColor;
            break;
        case 8:
            elem.style.backgroundImage = "url('./images/eight.png')";
            elem.style.backgroundColor = clickColor;
            break;
    }
}


// 인접칸 중에 방문하지 않은 칸의 [행, 열] 전부 q에 push
function pushAround(i, j, q){
    if(isRange(i, j+1) && visit[i][j+1] == 0) q.push([i,j+1]); //동 : [row][col+1]
    if(isRange(i-1, j+1) && visit[i-1][j+1] == 0) q.push([i-1,j+1]); // 동북 : [row-1][col+1]
    if(isRange(i-1, j) && visit[i-1][j] == 0) q.push([i-1,j]); // 북 : [row-1][col]
    if(isRange(i-1, j-1) && visit[i-1][j-1] == 0) q.push([i-1,j-1]); // 북서 : [row-1][col-1]
    if(isRange(i, j-1) && visit[i][j-1] == 0) q.push([i,j-1]); // 서 : [row][col-1]
    if(isRange(i+1, j-1) && visit[i+1][j-1] == 0) q.push([i+1,j-1]); // 남서 : [row+1][col-1]
    if(isRange(i+1, j) && visit[i+1][j] == 0) q.push([i+1,j]); // 남 : [row+1][col]
    if(isRange(i+1, j+1) && visit[i+1][j+1] == 0) q.push([i+1,j+1]); // 동남 : [row+1][col+1]
}


// 자신과 근접한 위치에 존재하는 지뢰 개수 반환하는 함수
function myNum(row, col){
    let mynum = 0;
    if(isRange(row, col+1) && table[row][col+1] == -1) mynum++; //동 : [row][col+1]
    if(isRange(row-1, col+1) && table[row-1][col+1] == -1) mynum++; // 동북 : [row-1][col+1]
    if(isRange(row-1, col) && table[row-1][col] == -1) mynum++; // 북 : [row-1][col]
    if(isRange(row-1, col-1) && table[row-1][col-1] == -1) mynum++; // 북서 : [row-1][col-1]
    if(isRange(row, col-1) && table[row][col-1] == -1) mynum++; // 서 : [row][col-1]
    if(isRange(row+1, col-1) && table[row+1][col-1] == -1) mynum++; // 남서 : [row+1][col-1]
    if(isRange(row+1, col) && table[row+1][col] == -1) mynum++; // 남 : [row+1][col]
    if(isRange(row+1, col+1) && table[row+1][col+1] == -1) mynum++; // 동남 : [row+1][col+1]
    return mynum;
}


// table[row][col]이 범위 안에 있으면 참, 아니면 거짓 반환
function isRange(row, col){
    if(0 <= row && row < rowNum && col >= 0 && col < colNum) return true;
    return false;
}