
// var requestAnimationFrame = window.requestAnimationFrame ||
//                             window.mozRequestAnimationFrame ||
//                             window.webkitRequestAnimationFrame ||
//                             window.msRequestAnimationFrame;

const canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.height = window.innerHeight / 2;
canvasEl.width = window.innerWidth / 2;

const ctx = canvasEl.getContext('2d');

let soundObj = {};

let setInt;

const colorInfoButton = document.getElementById('colorInfoButton');
// colorInfoButton.addEventListener('click', getColorInfo, false);
colorInfoButton.addEventListener('click', colorTimeline, false);

function colorTimeline(){
  let x = 0;
  let audio1Duration = soundObj['audio1'].duration();
  // setting for audio1 for now - should be set to shortest duration.
  let millies = (audio1Duration / canvasEl.width) * 1000;

  // don't forget to clear!
  setInt = window.setInterval(()=>{moveHead()}, millies);
    function moveHead(){
        x++;
        ctx.fillStyle = 'orange';
        ctx.fillRect(x, 0, 3, 5);
        getColorInfo(x);
    }
}

let redData = [];
let greenData = [];
let blueData = [];
let alphaData = [];
let pixelInfo;
let redSum;
let greenSum;
let blueSum;
let alphaSum;

function getColorInfo(x_coord){
  pixelInfo = ctx.getImageData(x_coord,0,1,canvasEl.height);
  redData.length = [];
  greenData.length = [];
  blueData.length = [];
  alphaData.length = [];

  for (let i = 0; i < pixelInfo.data.length; i = i + 4) {
    redData.push(pixelInfo.data[i]);
  }

  for (let i = 1; i < pixelInfo.data.length; i = i + 4) {
    greenData.push(pixelInfo.data[i]);
  }

  for (let i = 2; i < pixelInfo.data.length; i = i + 4) {
    blueData.push(pixelInfo.data[i]);
  }

  for (let i = 3; i < pixelInfo.data.length; i = i + 4) {
    alphaData.push(pixelInfo.data[i]);
  }

  redSum = redData.reduce((acc, val) => {
    return acc + val;
  }, 0);
  greenSum = greenData.reduce((acc, val) => {
    return acc + val;
  }, 0);
  blueSum = blueData.reduce((acc, val) => {
    return acc + val;
  }, 0);
  alphaSum = alphaData.reduce((acc, val) => {
    return acc + val;
  }, 0);

  let max = canvasEl.height * 255;

  // set these for others too of course
  soundObj['audio1'].volume(redSum/max);

  // console.log(redSum);
  // console.log(greenSum);
  // console.log(blueSum);
  // console.log(alphaSum);
}

const stopIntervalButton = document.getElementById('stopIntervalButton');
stopIntervalButton.addEventListener('click', stopInterval, false);

function stopInterval(){
  window.clearInterval(setInt);
}

const volumeNumber = document.getElementById('volumeNumber');
volumeNumber.addEventListener('change', changeVolume, false);

function changeVolume(e){
  // right now just changes the first file
  // could get this to work for any of the three
  console.log('You changed the volume!');
  soundObj['audio1'].volume(e.target.value);
}

const audioLoaders = document.getElementsByClassName('audioLoader');
Array.prototype.forEach.call(audioLoaders, (loader) =>{
  loader.addEventListener('change', handleAudio, false);
});

const playButton = document.getElementById('playButton');
playButton.addEventListener('click', playAll, false);

const stopButton = document.getElementById('stopButton');
stopButton.addEventListener('click', stopAll, false);

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', pauseAll, false);

function playAll(){
  console.log('you clicked PLAY');
  soundObj['audio1'].play();
  soundObj['audio2'].play();
  soundObj['audio3'].play();
}

function stopAll(){
  console.log('you clicked STOP');
  soundObj['audio1'].stop();
  soundObj['audio2'].stop();
  soundObj['audio3'].stop();
}

function pauseAll(){
  console.log('you clicked PAUSE');
  soundObj['audio1'].pause();
  soundObj['audio2'].pause();
  soundObj['audio3'].pause();
}

function handleAudio(e){

    let audioId = e.currentTarget.id;

    let reader = new FileReader();
    reader.onload = function(event){
      howl = new Howl({
        preload: true,
        volume: 0.5,
        src: [event.target.result],
        onload: function() {
          console.log('Loaded!');
        },
        onplay: function() {
          console.log('Playing!');
        },
        onend: function() {
          console.log('Finished!');
        }
      });
      soundObj[audioId] = howl;
    }
    reader.readAsDataURL(e.target.files[0]);
}

const imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e){
    let reader = new FileReader();
    reader.onload = function(event){
        let img = new Image();
        img.onload = function(){
            canvasEl.width = img.width / 2;
            canvasEl.height = img.height / 2;
            ctx.drawImage(img,0,0,img.width / 2,img.height / 2);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

// start square in top left
ctx.fillStyle = 'orange';
// ctx.strokeStyle = 'blue';
ctx.fillRect(0, 0, 3, 3);
