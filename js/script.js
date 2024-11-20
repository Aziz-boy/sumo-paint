// GLOBAL VARIABLES
const canvas = document.querySelector('canvas'),
	toolBtns = document.querySelectorAll('.tool'),
	fillColor = document.querySelector('#fill-color'),
	sizeSlider = document.querySelector('#size-slider'),
	colorBtns = document.querySelectorAll('.colors .option'),
	colorPicker = document.querySelector('#color-picker'),
	clearCanvasBtn = document.querySelector('.clear-canvas'),
	saveImageBtn = document.querySelector('.save-img');

// VARIABLE WITH DEFAULT VALUE
let ctx = canvas.getContext('2d'),
	isDrawing = false,
	brushWidth = 5,
	selectedTool = 'brush',
	selectedColor = '#000',
	prevMouseX,
	prevMouseY,
	snapshot;

// SET CANVAS BACKGROUND
const setCanvasBackground = () => {
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = selectedColor;
};

// SET CANVAS WIDTH AND HEIGHT
window.addEventListener('load', () => {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	setCanvasBackground();
});

// HELPER FUNCTION TO GET COORDINATES
const getCoordinates = e => {
	if (e.touches) {
		// Touch event
		const touch = e.touches[0] || e.changedTouches[0]; // Use `changedTouches` for `touchend`
		const rect = canvas.getBoundingClientRect();
		return {
			x: touch.clientX - rect.left,
			y: touch.clientY - rect.top,
		};
	} else {
		// Mouse event
		return { x: e.offsetX, y: e.offsetY };
	}
};

// START DRAWING
const startDraw = e => {
	e.preventDefault(); // Prevent scrolling on touch
	isDrawing = true;
	const { x, y } = getCoordinates(e);
	prevMouseX = x;
	prevMouseY = y;
	ctx.beginPath();
	ctx.lineWidth = brushWidth;
	ctx.strokeStyle = selectedColor;
	ctx.fillStyle = selectedColor;
	snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// DRAW RECTANGLE
const drawRectangle = e => {
	const { x, y } = getCoordinates(e);
	fillColor.checked
		? ctx.fillRect(x, y, prevMouseX - x, prevMouseY - y)
		: ctx.strokeRect(x, y, prevMouseX - x, prevMouseY - y);
};

// DRAW CIRCLE
const drawCircle = e => {
	const { x, y } = getCoordinates(e);
	ctx.beginPath();
	const radius = Math.sqrt(Math.pow(prevMouseX - x, 2) + Math.pow(prevMouseY - y, 2));
	ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
	fillColor.checked ? ctx.fill() : ctx.stroke();
};

// DRAW TRIANGLE
const drawTriangle = e => {
	const { x, y } = getCoordinates(e);
	ctx.beginPath();
	ctx.moveTo(prevMouseX, prevMouseY);
	ctx.lineTo(x, y);
	ctx.lineTo(prevMouseX * 2 - x, y);
	ctx.closePath();
	fillColor.checked ? ctx.fill() : ctx.stroke();
};

// DRAWING
const drawing = e => {
	if (!isDrawing) return;
	const { x, y } = getCoordinates(e);
	ctx.putImageData(snapshot, 0, 0);

	switch (selectedTool) {
		case 'brush':
			ctx.lineTo(x, y);
			ctx.stroke();
			break;
		case 'rectangle':
			drawRectangle(e);
			break;
		case 'circle':
			drawCircle(e);
			break;
		case 'triangle':
			drawTriangle(e);
			break;
		case 'eraser':
			ctx.strokeStyle = '#fff';
			ctx.lineTo(x, y);
			ctx.stroke();
			break;
		default:
			break;
	}
};

// TOOLS BTN AND SET TO VARIABLES SELECTED TOOL
toolBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		document.querySelector('.options .active').classList.remove('active');
		btn.classList.add('active');
		selectedTool = btn.id;
	});
});

// CHANGE BRUSH WIDTH
sizeSlider.addEventListener('change', () => (brushWidth = sizeSlider.value));

// SET COLOR TO SHAPES
colorBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		document.querySelector('.options .selected').classList.remove('selected');
		btn.classList.add('selected');
		const bgColor = window.getComputedStyle(btn).getPropertyValue('background-color');
		selectedColor = bgColor;
	});
});

// SET COLOR FROM COLOR PICKER
colorPicker.addEventListener('change', () => {
	colorPicker.parentElement.style.background = colorPicker.value;
	colorPicker.parentElement.click();
});

// CLEAR CANVAS BUTTON
clearCanvasBtn.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	setCanvasBackground();
});

// SAVE CANVAS AS IMAGE
saveImageBtn.addEventListener('click', () => {
	const link = document.createElement('a');
	link.download = `Sumo-paint${Date.now()}.jpg`;
	link.href = canvas.toDataURL();
	link.click();
});

// STOP DRAWING
const stopDraw = e => {
	e.preventDefault();
	isDrawing = false;
};

// EVENT LISTENERS FOR MOUSE EVENTS
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', stopDraw);

// EVENT LISTENERS FOR TOUCH EVENTS
canvas.addEventListener('touchstart', startDraw);
canvas.addEventListener('touchmove', drawing);
canvas.addEventListener('touchend', stopDraw);
