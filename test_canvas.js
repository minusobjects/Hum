// const Game = require('./lib/game.js')

const canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.height = window.innerHeight / 2;
canvasEl.width = window.innerWidth / 2;

if (canvasEl.getContext) {
    var ctx = canvasEl.getContext('2d');

    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'blue';

    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);

  }


  // <label>Image File:</label><br/>
  // <input type="file" id="imageLoader" name="imageLoader"/>
  // <canvas id="imageCanvas"></canvas>


  // var imageLoader = document.getElementById('imageLoader');
  //     imageLoader.addEventListener('change', handleImage, false);
  // var canvas = document.getElementById('imageCanvas');
  // var ctx = canvas.getContext('2d');
  //
  //
  // function handleImage(e){
  //     var reader = new FileReader();
  //     reader.onload = function(event){
  //         var img = new Image();
  //         img.onload = function(){
  //             canvas.width = img.width;
  //             canvas.height = img.height;
  //             ctx.drawImage(img,0,0);
  //         }
  //         img.src = event.target.result;
  //     }
  //     reader.readAsDataURL(e.target.files[0]);
  // }
