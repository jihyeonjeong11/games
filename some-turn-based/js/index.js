// ts-nocheck
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
function drawGame() {
    if (ctx === null)
        return;
    var sec = Math.floor(Date.now() / 1000);
    ctx.fillStyle = "#ff0000";
    //ctx.fillText("FPS: " + framesLastSecond, 10, 20);
    requestAnimationFrame(drawGame);
}
window.onload = function () {
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";
};
