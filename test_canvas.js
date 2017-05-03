
const canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.height = window.innerHeight / 2;
canvasEl.width = window.innerWidth / 2;

var ctx = canvasEl.getContext('2d');

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvasEl.width = img.width / 2;
            canvasEl.height = img.height / 2;
            ctx.drawImage(img,0,0,img.width / 2,img.height / 2);
        }
        img.src = event.target.result;
    }
    // mp3 is read as type "audio/mp3"
    reader.readAsDataURL(e.target.files[0]);
}


if (canvasEl.getContext) {

    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'blue';

    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);

  }
