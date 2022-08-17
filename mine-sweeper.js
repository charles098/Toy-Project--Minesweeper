import { 
    box, 
    img, 
} from './global-variables/global-variables.js';
import { setMine } from './utils/functions.js';
import * as EVENT from './utils/eventHandlers.js';

// 1. 지뢰 설치 및 데이터 반영
setMine();

// 2. 이벤트 추가
document.addEventListener('mousedown', EVENT.mouseDownHandler);
document.addEventListener('mouseup', EVENT.mouseUpHandler);
box.addEventListener('mouseover', EVENT.mouseOverHandler);
box.addEventListener('mouseout', EVENT.mouseOutHandler);
img.addEventListener('click', EVENT.init);