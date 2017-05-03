
const canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.height = window.innerHeight / 2;
canvasEl.width = window.innerWidth / 2;

var ctx = canvasEl.getContext('2d');

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);



function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
      var sound = new Howl({
        preload: true,
        autoplay: true,
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
      // debugger
      sound.play();
    }
    reader.readAsDataURL(e.target.files[0]);
}


if (canvasEl.getContext) {

    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'blue';

    ctx.fillRect(25, 25, 100, 100);
    ctx.clearRect(45, 45, 60, 60);
    ctx.strokeRect(50, 50, 50, 50);

  }
