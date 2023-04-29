console.log('holaaaaa');
const mainCanvas = document.getElementById('main-canvas');
const context = mainCanvas.getContext('2d');

let initialX;
let initialY;

let drawColor = '#000'
let lineWidth = 10

let undo = [context.getImageData(0,0, mainCanvas.width, mainCanvas.height)]
let redo = []

const updateCircleState = () => {
    circle.style.height = lineWidth + 'px'
    circle.style.width = lineWidth + 'px'
    circle.style.top = lastY - circle.offsetHeight / 2 + 'px'
    circle.style.left = lastX - circle.offsetHeight / 2 + 'px'
    circle.style.backgroundColor = drawColor
}

const draw = function (x, y) {
    context.lineWidth = lineWidth;
    context.strokeStyle = drawColor;
    context.willReadFrequently = true
    context.lineCap = "round";
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(initialX, initialY);
    context.lineTo(x, y);
    context.stroke();
    initialX = x;
    initialY = y;
};
const mouseDown = function (evt) {
    if(evt.which !== 1) return

    initialX = evt.offsetX;
    initialY = evt.offsetY;
    draw(initialX, initialY);
    mainCanvas.addEventListener('mousemove', mouseMoving);
};
const mouseMoving = function (evt) {
    draw(evt.offsetX, evt.offsetY);
};

const undoAction = () => {
    if(undo.length === 1) return

    redo.push(undo.at(-1))
    undo.pop()
    context.putImageData(undo.at(-1), 0, 0)
}

const redoAction = () => {
    if(redo.length == 0) return

    context.putImageData(redo.at(-1), 0, 0)
    undo.push(redo.at(-1))
    redo.pop()
}

const reset = () => {
    context.putImageData(undo[0], 0, 0)
}

let lastY;
let lastX
const circle = document.getElementById('circle')
const cursorCircle = e => {
    lastY = e.pageY
    lastX = e.pageX
    updateCircleState()
    circle.style.display = 'block'
}

document.addEventListener('click', () => {
    updateCircleState()
})

mainCanvas.addEventListener('click', () => {
    undo.push(context.getImageData(0,0, mainCanvas.width, mainCanvas.height))
    redo = []
})

mainCanvas.addEventListener("mousedown", mouseDown);
mainCanvas.addEventListener('mouseup', e => {
    mainCanvas.removeEventListener('mousemove', mouseMoving)
})
mainCanvas.addEventListener('mouseleave', e => {
    mainCanvas.removeEventListener('mousedown', mouseDown)
    mainCanvas.removeEventListener('mousemove', mouseMoving)
})

mainCanvas.addEventListener('mouseenter', () => {
    mainCanvas.addEventListener('mousedown', mouseDown)
})

document.addEventListener('mousemove', e => {
    cursorCircle(e)
    if(e.target.id == 'main-canvas') circle.style.display = 'block'
    else circle.style.display = 'none'
})

const colors = document.getElementsByClassName('color')
const widthInterface = document.getElementById('width')
const selectColor = e => {
    drawColor = e.currentTarget.style.backgroundColor
}

for(let color of colors) {
    color.addEventListener('click', selectColor)
}

const lineWidthHandler = increase => {
    if(!increase && lineWidth > 1){
        lineWidth -= 3
        if(lineWidth <= 0) lineWidth = 1
    } 
    else if (increase && lineWidth < 500){
        lineWidth += 3
        if(lineWidth >= 500) lineWidth = 500
    }
    widthInterface.innerHTML = `<b>Size:</b> <span class="gray-text">${lineWidth}</span>`
    updateCircleState()
}

document.addEventListener('keypress', e => {
    if(e.ctrlKey && e.code === 'KeyZ') undoAction()
    
    if(e.ctrlKey && e.code === 'KeyY') redoAction()
    console.log(e.key)
    if(e.key == '+') lineWidthHandler(true)
    if(e.key == '-') lineWidthHandler(false)
})