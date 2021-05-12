const cells = document.querySelectorAll('td');
const box = document.querySelector('table');

let rowNum = 6; // 박스 행 수
let colNum = 6; // 박스 열 수
let mineNum = 6; // 지뢰 개수
let mousedown = false; // 마우스 클릭 감지

// 6x6 빈 행렬, 방문 배열 생성
const table = Array.from(Array(rowNum), () => Array(colNum).fill(0));
const visit = Array.from(Array(rowNum), () => Array(colNum).fill(0)); // 0: non-visit, 1: visit, 2: flag

// 1. 지뢰 설치 및 데이터 반영
setMine();
load();

// 2. 마우스 누르는 이벤트 추가
// 깃발: 무반응. visit == 2
// 빈칸: 빈칸만 hover. visit == 0
// 빈칸 아님: 자기 테두리에 빈칸 아닌 칸들 hover. visit == 1
box.addEventListener('mousedown', mouseDownHandler);
box.addEventListener('mouseover', mouseOverHandler);

// 3. 마우스 누른 상태에서 떼는 이벤트 추가
// 깃발 or 빈칸 아님: 무반응. visit == 2 || visit == 1
// 빈칸: 지뢰면 게임 끝, 지뢰 아니면 값 표시.
//    ㄴ 지뢰: table == -1
//    ㄴ 지뢰 아님: table != -1 && visit == 0
document.addEventListener('mouseup', mouseUpHandler);
box.addEventListener('mouseout', mouseOutHandler);

// 4. 우클릭 이벤트 추가
// 깃발 없으면 놓고, 있으면 없앤다. 빈칸이 아니면 무반응
// 깃발이 없다: visit == 0
// 깃발이 있다: visit == 2
// 빈칸이 아니다: visit == 1

// 5. 게임 완료
// visit에 0이 하나도 없으면 win. 빈칸 남았어도 나머지 빈칸에 깃발 채우면 된다.

function mouseOverHandler(e){
    let row = e.target.dataRow;
    let col = e.target.dataCol;
    if(mousedown && e.target.tagName == 'TD'){
        // 방문 안한 경우 그 칸만 색 변화
        if(visit[row][col] == 0) e.target.style.backgroundColor = 'green';
        
        // 방문한 경우 주변에 방문하지 않은 칸 모두 색 변화
        if(visit[row][col] == 1){
            paintAround(row, col, 'on');
        }
    }
}

function mouseOutHandler(e){
    let row = e.target.dataRow;
    let col = e.target.dataCol;
    if(mousedown && e.target.tagName == 'TD'){
        if(visit[row][col] == 0) e.target.style.backgroundColor = '#CBC1B7';
        
        // 방문한 경우 주변에 방문하지 않은 칸 모두 색 변화
        if(visit[row][col] == 1){
            paintAround(row, col, 'off');
        }
    }
}

// 깃발: 무반응. visit == 2
// 빈칸: 빈칸만 hover. visit == 0
// 빈칸 아님: 자기 테두리에 빈칸 아닌 칸들 hover. visit == 1
function mouseDownHandler(e){
    let row = e.target.dataRow;
    let col = e.target.dataCol;
    mousedown = true;

    if(e.button == 0 || e.button == 2){
        console.log('누름');
        // 빈칸: 빈칸만 hover. visit == 0
        // 빈칸 아님: 자기 테두리에 빈칸 아닌 칸들 hover. visit == 1
        if(visit[row][col] == 0){
            e.target.style.backgroundColor = 'green';
        }
        if(visit[row][col] == 1 && e.button != 2){
            paintAround(row, col, 'on');
        }
    }
}

function mouseUpHandler(e){
    let row = e.target.dataRow;
    let col = e.target.dataCol;
    mousedown = false;
    
    if(e.target.tagName == 'TD'){
        // 클릭으로 인한 색 변경 취소
        if(e.target.style.backgroundColor == 'green'){
            e.target.style.backgroundColor = '#CBC1B7';
        }

        if(e.button == 2){
            console.log('우 뗌');
            if(visit[row][col] == 2){
                // 깃발 있으면 없앰
                visit[row][col] = 0;
                e.target.style.backgroundColor = '#CBC1B7';
                
                if(table[row][col] == -1){
                    // 지뢰가 맞으면 주변 숫자 초기화 - 1씩 더해줘야함
                    updateAround(row, col, '+');
                }
            }
            else if(visit[row][col] == 0){
                // 깃발 없으면 삽입
                visit[row][col] = 2;
                e.target.style.backgroundColor = '#E6C659';

                if(table[row][col] == -1){
                    // 지뢰가 맞으면 주변 숫자 초기화 - 1씩 빼줘야함
                    updateAround(row, col,'-');
                }
            }
        }
        if(e.button == 0){
            console.log('좌 뗌');
            paintAround(row, col, 'off');

            if(visit[row][col] == 0){
                visit[row][col] = 1; // 방문처리
                if(table[row][col] == -1){
                    // 지뢰 밟아서 게임끝
                    e.target.style.backgroundColor = 'red';
                    setTimeout(() => alert('Game over'), 10);
                    // gameOver 함수 호출 -- 만들어야 함
                }
                if(table[row][col] > 0){
                    // 값이 0이 아니면 그 칸만 색칠
                    e.target.style.backgroundColor = '#E58366';
                }
                if(table[row][col] == 0){
                    // 값이 0이면 bfs로 탐색해서 가능한 칸 모두 색칠
                    // findAll(row, col) 구현
                    e.target.style.backgroundColor = '#E58366';
                    findAll(row, col);
                }
            }
            else if(visit[row][col] == 1){
                // 방문한 경우 - 인접한 칸 검사해서 가능한거 다 표시. 깃발 칸은 값을 0으로 본다
                // findAll(row, col) 구현
                findAll(row, col);
            }
        }
    }
}


function findAll(row, col){
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
                cells[rowNum * i + j].style.backgroundColor = '#E58366';
            }
        }
    }

    for(let elem of zero){
        paintAround(elem[0], elem[1], 'bfs');
    }
}


// 중복 없이 네 지점에 지뢰 설치 및 위치 정보 초기화
// 숫자는 근접한 위치에 존재하는 지뢰 개수를 의미한다
function setMine(){

    // 지뢰 초기화
    let tmp = []
    for(let i = 0; i < cells.length; i++){
        tmp.push(i);
    }
    let row, col, idx;
    for(let i = 0; i < mineNum; i++){ 
        idx = tmp.splice(Math.floor(Math.random() * tmp.length),1)[0]
        row = parseInt(idx / 6);
        col = idx % 6;
        table[row][col] = -1;
    }

    // 나머지 숫자 초기화 + cells에 id 추가
    for(let i = 0; i < rowNum; i++){
        for(let j = 0; j < colNum; j++){
            if(table[i][j] == 0) table[i][j] = myNum(i,j);
            cells[rowNum * i + j].dataRow = i;
            cells[rowNum * i + j].dataCol = j;
        }
    }
}


// 마우스 눌렀을때 주변칸 색칠
function paintAround(i, j, paint){
    let color;
    if(paint == 'on') color = 'green';
    if(paint == 'off') color = '#CBC1B7';
    if(paint == 'bfs') color = '#E58366';
    
    if(isRange(i, j+1) && visit[i][j+1] == 0){
        if(paint == 'bfs') visit[i][j+1] = 1;
        cells[rowNum * i + (j+1)].style.backgroundColor = color; //동 : [row][col+1]
    }
    if(isRange(i-1, j+1) && visit[i-1][j+1] == 0){
        if(paint == 'bfs') visit[i-1][j+1] = 1;
        cells[rowNum * (i-1) + (j+1)].style.backgroundColor = color; // 동북 : [row-1][col+1]
    }
    if(isRange(i-1, j) && visit[i-1][j] == 0){
        if(paint == 'bfs') visit[i-1][j] = 1;
        cells[rowNum * (i-1) + (j)].style.backgroundColor = color; // 북 : [row-1][col]
    }
    if(isRange(i-1, j-1) && visit[i-1][j-1] == 0){
        if(paint == 'bfs') visit[i-1][j-1] = 1;
        cells[rowNum * (i-1) + (j-1)].style.backgroundColor = color; // 북서 : [row-1][col-1]
    }
    if(isRange(i, j-1) && visit[i][j-1] == 0){
        if(paint == 'bfs') visit[i][j-1] = 1;
        cells[rowNum * i + (j-1)].style.backgroundColor = color; // 서 : [row][col-1]
    }
    if(isRange(i+1, j-1) && visit[i+1][j-1] == 0){
        if(paint == 'bfs') visit[i+1][j-1] = 1;
        cells[rowNum * (i+1) + (j-1)].style.backgroundColor = color; // 남서 : [row+1][col-1]
    }
    if(isRange(i+1, j) && visit[i+1][j] == 0){
        if(paint == 'bfs') visit[i+1][j] = 1;
        cells[rowNum * (i+1) + (j)].style.backgroundColor = color; // 남 : [row+1][col]
    }
    if(isRange(i+1, j+1) && visit[i+1][j+1] == 0){
        if(paint == 'bfs') visit[i+1][j+1] = 1;
        cells[rowNum * (i+1) + (j+1)].style.backgroundColor = color; // 동남 : [row+1][col+1]
    }
}


// 깃발에 따른 인접칸 번호 초기화
function updateAround(row, col, how){
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
    load();
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


// 데이터 반영
function load(){
    for(let i = 0; i < rowNum; i++){
        for(let j = 0; j < colNum; j++){
            cells[rowNum * i + j].textContent = table[i][j];
        }
    }
}