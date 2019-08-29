let W; // 可视区域的宽度
let H; // 可视区域的高度
let MT; // 渲染小球距离左边缘的距离
let ML; // 渲染小球距离上边缘的距离
let R; // 小球的半径
let currentTimeSeconds = 0; // 当前时间距离1970年的秒数
let endTime = new Date(); // 倒计时一天
endTime.setTime(endTime.getTime() + 24 * 60 * 60 * 1000)
let balls = []; // 渲染的小球
// 渲染小球的颜色数组
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  W = canvas.width = document.body.clientWidth;
  H = canvas.height = document.body.clientHeight;
  MT = parseInt(W / 5)
  ML = parseInt(H / 10)
  R = Math.round(W * 4 / 5 / 108)-1; // 14 * 6 + 8 * 2 + 8 = 108
  currentTimeSeconds = getCurrentTimeSeconds()

  console.log(W,H,MT,ML,R,currentTimeSeconds)

  setInterval(() => {
    render(ctx);
    update();
  }, 50);
};

function getCurrentTimeSeconds(){
  const seconds = Math.round((endTime.getTime() - new Date().getTime()) / 1000)
  return seconds
}

function render(ctx){
  ctx.clearRect(0,0,W, H);

  const hour = parseInt(currentTimeSeconds / 3600)
  const mintue = parseInt((currentTimeSeconds - hour * 3600) / 60)
  const second =  currentTimeSeconds % 60
  
  // console.log(`${hour}:${mintue}:${second}`)

  renderDigit(ML,MT,parseInt(hour / 10),ctx)
  renderDigit(ML+15*(R + 1),MT,parseInt(hour % 10),ctx)
  renderDigit(ML+30*(R + 1),MT,10,ctx)


  renderDigit(ML+39*(R + 1),MT,parseInt(mintue / 10),ctx)
  renderDigit(ML+54*(R + 1),MT,parseInt(mintue % 10),ctx)
  renderDigit(ML+69*(R + 1),MT,10,ctx)

  renderDigit(ML+78*(R + 1),MT,parseInt(second / 10),ctx)
  renderDigit(ML+93*(R + 1),MT,parseInt(second % 10),ctx)

  balls.forEach(item=>{
    ctx.fillStyle = item.color

    ctx.beginPath()
    ctx.arc(item.x,item.y,R,0,2*Math.PI)
    ctx.closePath()
    ctx.fill()
  })
}

function renderDigit(x, y, num, ctx) {
  ctx.fillStyle = 'rgb(0,102,153)';

  for (let i = 0; i < digit[num].length; i++) {
    for (let j = 0; j < digit[num][i].length; j++) {
      if (digit[num][i][j] === 1) {
        ctx.beginPath()
        ctx.arc(
          x + (R + 1) + 2 * j * (R + 1),
          y + (R + 1) + 2 * i * (R + 1),
          R,
          0,
          2 * Math.PI
        );
        ctx.closePath()

        ctx.fill();
      }
    }
  }
}

function update(){
  const nextCurrentTimeSeconds = getCurrentTimeSeconds()
  const nextHour = parseInt(nextCurrentTimeSeconds / 3600)
  const nextMintue = parseInt((nextCurrentTimeSeconds - nextHour * 3600) / 60)
  const nextSecond =  nextCurrentTimeSeconds % 60

  const hour = parseInt(currentTimeSeconds / 3600)
  const mintue = parseInt((currentTimeSeconds - hour * 3600) / 60)
  const second =  currentTimeSeconds % 60

  if(second !== nextSecond){
    if(parseInt(nextHour / 10) !==  parseInt(hour / 10)){
      addBall(ML,MT,parseInt(hour % 10))
    }
    if(parseInt(nextHour % 10) !==  parseInt(hour % 10)){
      addBall(ML+15*(R + 1),MT,parseInt(hour % 10))
    }
    if(parseInt(nextMintue / 10) !==  parseInt(mintue / 10)){
      addBall(ML+39*(R + 1),MT,parseInt(mintue % 10))
    }
    if(parseInt(nextMintue % 10) !==  parseInt(mintue % 10)){
      addBall(ML+54*(R + 1),MT,parseInt(mintue % 10))
    }
    if(parseInt(nextSecond % 10) !==  parseInt(second % 10)){
      addBall(ML+78*(R + 1),MT,parseInt(second % 10))
    }
    if(parseInt(nextSecond % 10) !==  parseInt(second % 10)){
      addBall(ML+93*(R + 1),MT,parseInt(second % 10))
    }

    currentTimeSeconds = nextCurrentTimeSeconds
  }

  updateBalls()
  console.log('balls.length===',balls.length)
}

function addBall(x,y,num){
  for (let i = 0; i < digit[num].length; i++) {
    for (let j = 0; j < digit[num][i].length; j++) {
      if (digit[num][i][j] === 1) {
        const ball = {
          x: x + (R + 1) + 2 * j * (R + 1),
          y: y + (R + 1) + 2 * i * (R + 1),
          g: 1.5 + Math.random(),
          vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
          vy: -4,
          color: colors[Math.floor(Math.random()*colors.length)]
        }
        balls.push(ball)
      }
    }
  }
}

function updateBalls() {
  balls.forEach(item=>{
    item.x += item.vx;
    item.y += item.vy;
    item.vy += item.g

    // 碰撞检测(下边缘)
    if(item.y > H -R){
      item.y = H -R;
      item.vy = -item.vy * 0.75;
    }
  })

   // 优化性能(回收超出左右边缘的小球)
   let _index = 0;
   balls.forEach((item,index)=>{
    if(item.x > -R && item.x < W + R){
      balls[_index++] = balls[index]
    }
   })
   
   while(balls.length > Math.min(300,_index)){
     balls.pop()
   }
}
