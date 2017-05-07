var x = 0;
var y = 0;
var lastX;
var lastY;
function draw(x,y,w,r,g,b,a){
        var gradient = ctx.createRadialGradient(x, y, 0, x, y, w);
        gradient.addColorStop(0, 'rgba('+r+', '+g+', '+b+', '+a+')');
        gradient.addColorStop(1, 'rgba('+r+', '+g+', '+b+', 0)');

        ctx.beginPath();
        ctx.arc(x, y, w, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
};
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var w = 10;
var radius = w/2;
var going = false;
$('canvas').mousedown(function(e){
    going = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    draw(lastX, lastY,w,100,100,100, 0.5);
});
$('canvas').mouseup(function(){
    going = false;
});
$('canvas').mousemove(function(e){
    if(going == true){
        x = e.offsetX;
        y = e.offsetY;

        // the distance the mouse has moved since last mousemove event
        var dis = Math.sqrt(Math.pow(lastX-x, 2)+Math.pow(lastY-y, 2));

        // for each pixel distance, draw a circle on the line connecting the two points
        // to get a continous line.
        for (i=0;i<dis;i+=1) {
            var s = i/dis;
            draw(lastX*s + x*(1-s), lastY*s + y*(1-s),w,100,100,100, 0.5);
        }
        lastX = x;
        lastY = y;
    };
});
