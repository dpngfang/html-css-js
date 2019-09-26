var game=[];
var size=10;
var boomnum=2;
var leastboom=boomnum;
var beginTime = Date.now()
var gamejudge=0;
var timer;
for (var i =0;i<size;i++) {
    game.push(Array(size).fill(0));
}

function randmap () {
    var count = 0;
    var x;
    var y;
    while (count < boomnum)
    {
        x = parseInt(Math.random() * size);
        y = parseInt(Math.random() * size);
        /*alert(x);
        alert(y);*/
        if(game[x][y]<=8)
        {
            game[x][y]=100;
            count++;
        }
    }
}

function countnum(x,y) {
    var round=[
        [x-1,y-1],
        [x-1,y],
        [x-1,y+1],
        [x,y-1],
        [x,y+1],
        [x+1,y-1],
        [x+1,y],
        [x+1,y+1],
    ];
    var count=0;
    for(var i =0;i<round.length;i++){
        var a=round[i][0];
        var b=round[i][1];
        try{
            count+=(game[a][b]>8);
        }catch(e){}
    }
    return count
}

function resetmap() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (game[i][j] >8) {
                continue
            }
            game[i][j] = countnum(i, j);
        }
    }
}

var blocks=[];
for (var i =0;i<size;i++) {
    blocks.push(Array(size).fill(0));
}
/*var blocks = Array(size).fill(0);
for (var i = 0; i < blocks.length; i++) {
    blocks[i] = Array(size).fill(0)
}*/

var gamedom=document.getElementById("game");
var time=document.getElementById("time");
var all=document.getElementById("all");
var boomdom=document.getElementById("boom");

document.getElementById('restart').addEventListener('click',function(){
    restartgame()
});
document.getElementById('button').addEventListener('click',function(){
    var ssize=document.getElementById("size").value;
    var nnum=document.getElementById("num").value;
    if(ssize)  size=Number(ssize);
    if(nnum)   boomnum=Number(nnum);
    restartgame()
});
time.style.color="lightskyblue";
time.innerHTML = "所用时间";

function getcolor(x,y) {
    var block=blocks[x][y].block;
    switch (game[x][y]) {
        case 1:
            block.style.color='blue';
            break;
        case 2:
            block.style.color='orange';
            break;
        case 3:
            block.style.color='red';
            break;
        case 4:
            block.style.color='lawngreen';
            break;
        case 5:
            block.style.color='palevioletred';
            break;
        case 6:
            block.style.color='yellow';
            break;
    }
}

function changeelement() {
    for (var i =0;i<blocks.length;i++){
        for (var j=0;j<blocks.length;j++) {
            var state=blocks[i][j].state;
            var block=blocks[i][j].block;
            switch(state){
                case 0:
                    if(gamejudge!=2) {
                        block.classList.remove('danger');
                    }
                    break;
                case 1:
                    block.classList.remove('danger');
                    block.classList.remove('cover');
                    block.innerHTML = game[i][j] || '';
                    getcolor(i,j);
                    break;
                case 2:
                    block.classList.add('danger');
                    break;
                default:
                    break;
            }
        }
    }

}

function search(x,y) {
    blocks[x][y].state = 1;
    var round = [
        [x - 1, y - 1],
        [x - 1, y],
        [x - 1, y + 1],
        [x, y - 1],
        [x, y + 1],
        [x + 1, y - 1],
        [x + 1, y],
        [x + 1, y + 1]
    ];
    for (var k=0;k<round.length;k++){
        var a=round[k][0];
        var b=round[k][1];
        try{
            if(game[a][b]===0&&blocks[a][b].state===0){
                search(a,b);
            }else{
                blocks[a][b].state=1;
            }
        }catch (e) {}
    }
}

function clickjudge(){
    all.style.width=gamedom.style.width=gamedom.style.height=size*40+"px";
    boomdom.style.color="slateblue"
    boomdom.innerHTML="剩余炸弹数："+leastboom;
    for (var i=0;i<game.length;i++) {
        for (var j = 0; j < game.length; j++) {
            var k=1;
            var block=document.createElement('div');
            block.classList.add('block');
            block.classList.add('cover');
            block.style.width=block.style.height=40+"px";
            block.style.lineHeight = 40 + 'px';
            (function(a,b){
                block.addEventListener('click',function(){
                    if(gamejudge===2) return;
                    if(gamejudge===0){
                        startgame();
                    }
                    blocks[a][b].state=1;
                    if(game[a][b]===0){
                        search(a,b);
                    }else if(game[a][b]>8){
                        gamejudge=2;
                        blocks[a][b].state=0;//防止block.innerHTML在changeelement中被case1改为game[i][j]
                        alert("踩到地雷，游戏失败！");
                        showallboom();
                    }
                    changeelement();
                    if(win()&&k){
                        k=0;
                        list();
                        alert("恭喜您取得胜利！");
                        gamejudge=2;
                    }

                });
                block.addEventListener('contextmenu',function(e){
                    if(gamejudge===2) return;
                    if (gamejudge === 0) {
                        startgame()
                    }
                    e.preventDefault();
                    if(blocks[a][b].state===0){
                        blocks[a][b].state=2;
                        if(game[a][b]>8){
                            leastboom--;
                            boomdom.innerHTML="剩余炸弹数："+leastboom;
                        }
                    }
                    else if(blocks[a][b].state===2){
                        blocks[a][b].state=0;
                        if(game[a][b]>8){
                            leastboom++;
                            boomdom.innerHTML="剩余炸弹数："+leastboom;
                        }
                    }
                    changeelement();
                    if (win()&&k) {
                        k=0;
                        list()
                        alert("恭喜您取得胜利！");

                        gamejudge = 2;
                    }
                })
            })(i,j);
            blocks[i][j] = {
                block: block,
                state: 0
            };
            gamedom.appendChild(block);
        }
    }
}

function restartgame(){
    clearInterval(timer);
    time.style.color="lightskyblue";
    time.innerHTML = "所用时间";
    leastboom = boomnum;
    game = [];
    for (var i = 0; i < size; i++) {
        game.push(Array(size).fill(0));
    }
    blocks=[];
    for (var i =0;i<size;i++) {
        blocks.push(Array(size).fill(0));
    }
    gamedom.innerHTML = '';
    gamejudge = 0;
    run();
}

function win() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (game[i][j] >8) {
                if (blocks[i][j].state !== 2) {
                    return false
                }
            } else {
                if (blocks[i][j].state !== 1) {
                    return false
                }
            }

        }
    }
    clearInterval(timer);
    return true ;
}

function showallboom() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (game[i][j] >8) {
                blocks[i][j].block.innerHTML = '💣'
                blocks[i][j].block.classList.add('danger')
            }
        }
    }
    clearInterval(timer);
}

function startgame(){
    gamejudge = 1;
    beginTime = Date.now();
    timer = setInterval(function(){
        time.style.color="lightskyblue";
        time.innerHTML = "所用时间： "+parseInt((Date.now() - beginTime) / 1000);

    },1000)
}

function list(){
    var table = document.getElementById("table");
    table.style.width = size * 40 + "px";
    var alla = document.getElementsByTagName("a");
    for (var i = 0; i < alla.length; i++) {
        alla[i].onclick = function (e) {
            var tr = this.parentNode.parentNode;
            e.preventDefault();
            if (confirm("确认删除该记录吗？")) {
                tr.parentNode.removeChild(tr);
            }
        }
    }
    if (win()) {
        var tr = document.createElement("tr");
        var timenum = parseInt((Date.now() - beginTime) / 1000);
        tr.innerHTML = "<td align='center'>" + timenum + "</td>" +
            "<td align='center'>" + boomnum + "</td>" +
            "<td><a href=''>Delete</a></td>";
        alert("恭喜您取得胜利！");
        var table = document.getElementById("table");
        var tbody = table.getElementsByTagName("tbody")[0];
        tbody.appendChild(tr);
        var a = tr.children[3];
        a.onclick = function (e) {
            var tr1 = this.parentNode;
            e.preventDefault();
            if (confirm("确认删除该记录吗？")) {
                tr1.parentNode.removeChild(tr1);
            }
        }
    }
}

function run() {
    randmap();
    resetmap();
    clickjudge();
}

run();
