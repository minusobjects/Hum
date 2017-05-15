
const canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.width = 1000;
canvasEl.height = 600;
canvasEl.onselectstart = function(){ return false; };

const ctx = canvasEl.getContext('2d');

const bar = document.getElementById("bar");

let setInt;
let current_x = 0;

let currentImg;

const colorInfoButton = document.getElementById('colorInfoButton');
colorInfoButton.addEventListener('click', colorTimeline, false);

const stopIntervalButton = document.getElementById('stopIntervalButton');
stopIntervalButton.addEventListener('click', stopInterval, false);

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', pauseInterval, false);

function colorTimeline(){
  let aud1Dur = soundObj['red'].duration();
  let aud2Dur = soundObj['green'].duration();
  let aud3Dur = soundObj['blue'].duration();

  let shortestDur = Math.min(aud1Dur, aud2Dur, aud3Dur);
  let millies = (shortestDur / canvasEl.width) * 1000;

  setInt = window.setInterval(()=>{moveHead()}, millies);
    bar.style.display = `block`;
    function moveHead(){
        current_x++;
        getColorInfo(current_x);
        bar.style.marginLeft = `${current_x}px`;
        if(current_x >= canvasEl.width){
          stopInterval();
        }
    }
    setPauseButton();
    playAll();
}


function sumMaxOne(colorSum,max){
  if(colorSum/max >= 1){
    colorSum = 1;
  } else {
    colorSum = colorSum/max;
  }
  return colorSum;
}

function getColorInfo(x_coord){
  let pixelInfo;
  let redSum = 0;
  let greenSum = 0;
  let blueSum = 0;
  let alphaSum;
  let max = canvasEl.height * 255;
  let halfMax = max / 2;

  pixelInfo = ctx.getImageData(x_coord+2,0,1,canvasEl.height);

  for (let i = 0; i < pixelInfo.data.length; i = i + 4) {
    redSum = redSum + pixelInfo.data[i];
    greenSum = greenSum + pixelInfo.data[i+1];
    blueSum = blueSum + pixelInfo.data[i+2];
  }

  redSum = sumMaxOne(redSum,halfMax);
  greenSum = sumMaxOne(greenSum,halfMax);
  blueSum = sumMaxOne(blueSum,halfMax);

  assignVolume(redSum,greenSum,blueSum);
  showLevels(redSum,greenSum,blueSum);
}

function assignVolume(redSum,greenSum,blueSum){
  soundObj['red'].volume(redSum);
  soundObj['green'].volume(greenSum);
  soundObj['blue'].volume(blueSum);
}

function showLevels(redSum,greenSum,blueSum){
  document.getElementById("redVolCircle").setAttribute(`fill`, `rgba(255,0,0,${redSum})`);
  document.getElementById("greenVolCircle").setAttribute(`fill`, `rgba(0,255,0,${greenSum})`);
  document.getElementById("blueVolCircle").setAttribute(`fill`, `rgba(0,0,255,${blueSum})`);
}


let errorMessage = '';

function setErrors(){
  document.getElementById('errors').innerHTML = errorMessage;
}



const imageLoader = document.getElementById('imageLoader');
imageLoader.onclick = function(){this.value = null;};
imageLoader.addEventListener('change', handleImage, false);

let currentImgName;

function handleImage(e){
  errorMessage = ''
  let filename = e.target.files[0].name
  let ext = filename.substr(filename.lastIndexOf('.')+1);
  if(ext.toLowerCase() !== 'png' && ext.toLowerCase() !== 'jpg' && ext.toLowerCase() !== 'jpeg'){
    errorMessage = 'Image file must be PNG or JPG.';
    setErrors();
    return null;
  }

    let reader = new FileReader();
    reader.onload = function(event){
      let img = new Image();
      img.onload = function(){
        currentImg = img;
        setImageName()
        setErrors();
        redraw();
      }
      img.src = event.target.result;
    }
    currentImgName = filename;
    reader.readAsDataURL(e.target.files[0]);
}

const colorButtons = document.getElementsByClassName('colorButton');
Array.prototype.forEach.call(colorButtons, (button) =>{
  button.addEventListener('click', changeColor, false);
});

const currentColorButton = document.getElementById("currentColorButton");
function changeColor(e){
  curColor = eval(e.currentTarget.id);
  currentColorButton.setAttribute(`style`, `color:${curColor};`);
}

const instruxButton = document.getElementById('instruxButton');
instruxButton.addEventListener('click', loadInstrux, false);

function loadInstrux(){
  document.getElementById("instrux").classList.add('instruxLoad');
}

const instrux = document.getElementById('instrux');
instrux.addEventListener('click', unloadInstrux, false);

function unloadInstrux(){
  $("#instrux").removeClass('instruxLoad');
}

$(canvasEl).mousedown(function(e){
  let mouseX = e.pageX - this.offsetLeft + 35;
  let mouseY = e.pageY - this.offsetTop + 35;

  paint = true;
  addClick(mouseX, mouseY);
  redraw();
});

$(canvasEl).mousemove(function(e){
  let mouseX = e.pageX - this.offsetLeft + 35;
  let mouseY = e.pageY - this.offsetTop + 35;

  if(paint){
    addClick(mouseX, mouseY, true);
    redraw();
  }
});

$('#canvas').mouseup(function(e){
  paint = false;
});

$('#canvas').mouseleave(function(e){
  paint = false;
});

let clickX = new Array();
let clickY = new Array();
let clickDrag = new Array();
let paint;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(curColor);
}

const colorRed = "rgba(255,0,0,.5)";
const colorYellow = "rgba(255,255,0,.5)";
const colorGreen = "rgba(0,255,0,.5)";
const colorCyan = "rgba(0,255,255,.5)";
const colorBlue = "rgba(0,0,255,.5)";
const colorPurple = "rgba(255,0,255,.5)";
const colorWhite = "rgba(255,255,255,.5)";
const colorBlack = "rgba(0,0,0,.5)";

let curColor = colorRed;
document.getElementById("currentColorButton").setAttribute(`style`, `color:${curColor};`);
let clickColor = new Array();

const clearImgButton = document.getElementById('clearImgButton');
clearImgButton.addEventListener('click', clearImg);

const clearPaintButton = document.getElementById('clearPaintButton');
clearPaintButton.addEventListener('click', clearPaint);

function clearImg(){
  currentImg = undefined;
  currentImgName = '(none)';
  setImageName();
  sampleImgSelect = [false, false, false, false];
  setSampleImgNumber();
  redraw();
}

function clearPaint(){
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
  clickColor = new Array();
  curColor = colorRed;
  redraw();
}

function redraw(){
  if(currentImg){
    ctx.drawImage(currentImg,0,0,1000,600);
  } else {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  ctx.lineJoin = "round";
  ctx.lineWidth = 70;

  for(let i=0; i < clickX.length; i++) {
    ctx.beginPath();
    if(clickDrag[i] && i){
      ctx.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       ctx.moveTo(clickX[i]-1, clickY[i]);
     }
     ctx.lineTo(clickX[i], clickY[i]);
     ctx.closePath();
     ctx.strokeStyle = clickColor[i];
     ctx.stroke();
  }
}

let sampleImgSelect = [false, false, false, false, false];
let sampleAudSelect = [false, false, false, false];

loadDefaultImage = function(){
    const sampleRGB1 = document.getElementById("Hum_RGB_1");
    const sampleRGB2 = document.getElementById("Hum_RGB_2");
    const sampleRGB3 = document.getElementById("Hum_RGB_3");
    const sampleRGB4 = document.getElementById("Hum_RGB_4");
    const sampleRGB5 = document.getElementById("Hum_RGB_5");

    let pickedImg;
    let rand = Math.floor((Math.random() * 5) + 1);
    switch (rand){
      case 1:
        pickedImg = sampleRGB1;
        currentImgName = 'Hum_RGB_1.png';
        sampleImgSelect[0] = true;
        break;
      case 2:
        pickedImg = sampleRGB2;
        currentImgName = 'Hum_RGB_2.png';
        sampleImgSelect[1] = true;
        break;
      case 3:
        pickedImg = sampleRGB3;
        currentImgName = 'Hum_RGB_3.png';
        sampleImgSelect[2] = true;
        break;
      case 4:
        pickedImg = sampleRGB4;
        currentImgName = 'Hum_RGB_4.png';
        sampleImgSelect[3] = true;
        break;
      case 5:
        pickedImg = sampleRGB5;
        currentImgName = 'Hum_RGB_5.png';
        sampleImgSelect[4] = true;
        break;
      default:
        pickedImg = sampleRGB1;
        currentImgName = 'Hum_RGB_1.png';
        sampleImgSelect[0] = true;
        break;
    }
    pickedImg.onload = function(){
      currentImg = pickedImg;
      setImageName();
      setSampleImgNumber();
      redraw();
    }
}

const sampleImgNumbers = document.getElementsByClassName('sampleImgNumber');

function readySampleImgNumbers(){
  Array.prototype.forEach.call(sampleImgNumbers, (imgNumber) => {
    imgNumber.addEventListener('click', (e) => {
      sampleImgSelect = [false, false, false, false];
      currentImg = eval(e.currentTarget.id);
      let n = parseInt(e.currentTarget.attributes.data.value);
      sampleImgSelect[n] = true;
      currentImgName = currentImg.src.split(/(\\|\/)/g).pop();
      setSampleImgNumber();
      setImageName();
      redraw();
    });
  });
}

function setSampleImgNumber(){
  Array.prototype.forEach.call(sampleImgNumbers, (imgNumber) =>{
    let n = parseInt(imgNumber.attributes.data.value);
    if(sampleImgSelect[n] === true){
      imgNumber.setAttribute(`style`, `color:white;`);
    } else {
      imgNumber.setAttribute(`style`, `color:default;`);
    }
  });
}

const sampleAudNumbers = document.getElementsByClassName('sampleAudNumber');

function readySampleAudNumbers(){
  Array.prototype.forEach.call(sampleAudNumbers, (audNumber) => {
    audNumber.addEventListener('click', (e) => {
      stopInterval();
      sampleAudSelect = [false, false, false, false];
      let n = parseInt(e.currentTarget.attributes.data.value);
      loadSampleHowls(n);
      sampleAudSelect[n] = true;
      setSampleAudNumber();
    });
  });
}

function setSampleAudNumber(){
  Array.prototype.forEach.call(sampleAudNumbers, (audNumber) =>{
    let n = parseInt(audNumber.attributes.data.value);
    if(sampleAudSelect[n] === true){
      audNumber.setAttribute(`style`, `color:white;`);
    } else {
      audNumber.setAttribute(`style`, `color:default;`);
    }
  });
}

function setImageName(){
  document.getElementById("imageName").innerHTML = currentImgName;
}


// requires server
// loadDefaultImage();

window.onload = function(){
  readySampleImgNumbers();
  readySampleAudNumbers();
  loadSampleHowls(0);
  setHints();
  document.getElementById("loadingAnim").setAttribute(`style`, `display:none;`);
  setTimeout(loadInstrux, 500);
}
