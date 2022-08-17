// get level from querystring
export function getLevel() {
    const queryString = new URLSearchParams(location.search);
    const level = queryString.get('level');
    return level;
}

// change element size by options
export function changeElementSize(table, container, menu, options) {
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
export function makeTableFromLevel(table, options) {
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