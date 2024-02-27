// const matrix = [
//   [0, 2, 2, 0],
//   [0, 0, 2, 2],
//   [2, 4, 4, 2],
//   [2, 4, 4, 4]
// ];
const WIDTH = 4; HEIGHT = 4;
const CELL_SIZE = 80;
const MARGIN = Math.floor(CELL_SIZE / 10);
const MOVE_ANIMATION_TIME = 300;
const container = document.querySelector('.container');

let matrix = new Array();
Array.prototype.print = function () { 
  console.log(this.map((item) => item.join(' ')).join('\n'));
}

window.onload = function () { 
  init();
  updateView();
  // 初始生成两个数字
  createOneNum();
  createOneNum();

  // 重新渲染游戏视图
  updateView();
  // console.log(matrix);
}

// 初始化
function init() { 
  container.style.width = `${(CELL_SIZE + MARGIN) * WIDTH + MARGIN}px`;
  container.style.height = `${(CELL_SIZE + MARGIN) * HEIGHT + MARGIN}px`;
  // 初始化数组
  for (let i = 0; i < HEIGHT; i++) {
    matrix[i] = new Array();
    for (let j = 0; j < WIDTH; j++) {
      matrix[i][j] = 0;
      // 初始化给定背景方块
      container.innerHTML += `<div class="default-cell" id="default-${i}-${j}"></div>`;
      const defaultCell = document.querySelector(`#default-${i}-${j}`);
      defaultCell.style.width = `${CELL_SIZE}px`;
      defaultCell.style.height = `${CELL_SIZE}px`;
      defaultCell.style.top = `${getPosTop(i, j)}px`;
      defaultCell.style.left = `${getPosLeft(i, j)}px`;
    }
  }
}

function getPosTop(i, j) { 
  return i * (CELL_SIZE + MARGIN) + MARGIN;
}
function getPosLeft(i, j) { 
  return j * (CELL_SIZE + MARGIN) + MARGIN;
}

// 生成随机数
function createOneNum() { 
  let i, j;
  while (true) {
    i = Math.floor(Math.random() * HEIGHT);
    j = Math.floor(Math.random() * WIDTH);
    if (matrix[i][j] === 0) { 
      matrix[i][j] = Math.random() > 0.5 ? 2 : 4;
      // 显示数字动画
      const cell = document.querySelector(`#cell-${i}-${j}`);
      cell.style.anima
      cell.innerHTML = matrix[i][j];
      cell.style.backgroundColor = getColorByNum(matrix[i][j]);
      cell.style.width = `${CELL_SIZE}px`;
      cell.style.height = `${CELL_SIZE}px`;
      cell.style.top = `${getPosTop(i, j)}px`;
      cell.style.left = `${getPosLeft(i, j)}px`;
      cell.style.fontSize = `${CELL_SIZE / 2.5}px`;
      cell.style.lineHeight = `${CELL_SIZE}px`;
      break;
    }
  }
}

function getColorByNum(num) {
  switch (num) {
    case 2: return '#eee4da';
    case 4: return '#ede0c8';
    case 8: return '#f2b179';
    case 16: return '#f59563';
    case 32: return '#f67c5f';
    case 64: return '#f65e3b';
    case 128: return '#edcf72';
    case 256: return '#edcc61';
    case 512: return '#9c0';
    case 1024: return '#33b5e5';
    case 2048: return '#09c';
    case 4096: return '#a6c';
  }
}

// 重新渲染游戏视图
function updateView() { 
  for (let i = 0; i < HEIGHT; i++) { 
    for (let j = 0; j < WIDTH; j++) { 
      document.querySelectorAll(`#cell-${i}-${j}`).forEach((item) => { 
        item.remove();
      });
      container.innerHTML += `<div class="cell" id="cell-${i}-${j}"></div>`;
      const cell = document.querySelector(`#cell-${i}-${j}`);
      if (matrix[i][j] === 0) {
        cell.style.width = `0px`;
        cell.style.height = `0px`;
        cell.style.top = `${getPosTop(i, j) + CELL_SIZE / 2}px`;
        cell.style.left = `${getPosLeft(i, j) + CELL_SIZE / 2}px`;
      } else { 
        cell.style.width = `${CELL_SIZE}px`;
        cell.style.height = `${CELL_SIZE}px`;
        cell.style.top = `${getPosTop(i, j)}px`;
        cell.style.left = `${getPosLeft(i, j)}px`;
        cell.style.fontSize = `${CELL_SIZE / 2.5}px`;
        cell.style.lineHeight = `${CELL_SIZE}px`;
        cell.innerHTML = matrix[i][j];
        cell.style.backgroundColor = getColorByNum(matrix[i][j]);
      }
    }
  }
}

// move(matrix, 'up');
// matrix.print();
function move(matrix, direction) { 
  const rows = matrix.length;
  const cols = matrix[0].length;

  const posChange = new Array();
  for (let i = 0; i < rows; i++) { 
    posChange[i] = new Array();
    for (let j = 0; j < cols; j++) { 
      posChange[i][j] = new Array();
      posChange[i][j] = [i, j];
    }
  }

  // 判断下标是否越界
  function _inRange(i, j) { 
    return matrix[i] && matrix[i][j] !== undefined;
  }

  // 方向函数处理对象
  const next = {
    up: (i, j) => [i + 1, j],
    down: (i, j) => [i - 1, j],
    left: (i, j) => [i, j + 1],
    right: (i, j) => [i, j - 1]
  };

  // 获取当前方向上下一个非零元素的坐标和值
  function _getNextNonZeroValue(i, j) { 
    let [nextI, nextJ] = next[direction](i, j);
    while (_inRange(nextI, nextJ)) {
      const nextValue = matrix[nextI][nextJ];
      if (nextValue) {
        return [nextI, nextJ, nextValue];
      } else { 
        [nextI, nextJ] = next[direction](nextI, nextJ);
      }
    }
  }

  // console.log(_getNextNonZeroValue(0, 0));
  
  // 计算合并的元素值
  function _cal(i, j) { 
    if (!_inRange(i, j)) { 
      return;
    }
    // 计算当前位置的值
    const result = _getNextNonZeroValue(i, j);
    // 当前行列无值
    if (!result) { 
      return;
    }
    const [nextI, nextJ, nextValue] = result;
    if (matrix[i][j] === 0) {
      matrix[i][j] = nextValue;
      matrix[nextI][nextJ] = 0;
      posChange[nextI][nextJ] = [i, j];
      _cal(i, j);
    } else if (matrix[i][j] === nextValue) { 
      matrix[i][j] += nextValue;
      matrix[nextI][nextJ] = 0;
      posChange[nextI][nextJ] = [i, j];
    }


    // 递归计算下一个元素的值
    _cal(...next[direction](i, j));
  }

  if (direction === 'up') { 
    for (let j = 0; j < cols; j++) { 
      _cal(0, j);
    }
  } else if (direction === 'down') { 
    for (let j = 0; j < cols; j++) { 
      _cal(rows - 1, j);
    }
  } else if (direction === 'left') { 
    for (let i = 0; i < rows; i++) { 
      _cal(i, 0);
    }
  } else { 
    for (let i = 0; i < rows; i++) { 
      _cal(i, cols - 1);
    }
  }
  return posChange;
}

function moveAnimation(posChange, direction) { 
  for (let i = 0; i < HEIGHT; i++) { 
    for (let j = 0; j < WIDTH; j++) { 
      const cell = document.querySelector(`#cell-${i}-${j}`);
      // cell.style.transform = `translataX(${-CELL_SIZE * (posChange[i][j][0] - i)}px})`;
      // cell.style.transform = `translataY(${-CELL_SIZE * (posChange[i][j][1] - j)}px})`;
      cell.style.top = `${getPosTop(posChange[i][j][0], posChange[i][j][1])}px`;
      cell.style.left = `${getPosLeft(posChange[i][j][0], posChange[i][j][1])}px`;
    }
  }
  // console.log(posChange);
  setTimeout(() => { 
    updateView();
  }, MOVE_ANIMATION_TIME);
  setTimeout(() => { 
    createOneNum();
  }, MOVE_ANIMATION_TIME);
}

window.onkeydown = function (e) { 
  switch (e.keyCode) {
    case 37:  moveAnimation(move(matrix, 'left'), 'left'); return;
    case 38:  moveAnimation(move(matrix, 'up'), 'up'); return;
    case 39: moveAnimation(move(matrix, 'right'), 'right'); return;
    case 40:  moveAnimation(move(matrix, 'down'), 'down'); return;
  }
}

const restart = function () { 
  container.innerHTML = '';
  matrix = [];
  init();
  updateView();
  // 初始生成两个数字
  createOneNum();
  createOneNum();

  // 重新渲染游戏视图
  updateView();
}

document.querySelector('.restart').addEventListener('click', restart);
window.addEventListener('keyup', (e) => { 
  if (e.keyCode === 82)
    restart();
});
