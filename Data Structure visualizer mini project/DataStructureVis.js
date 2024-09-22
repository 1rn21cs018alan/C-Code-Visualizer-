const representDiv = document.getElementsByClassName("Represent")[0];
const memoryDiv = document.getElementsByClassName("Memory")[0];

function maketable(outerNode, rows, columns) {
    outerNode.innerHTML = "";
    var table = document.createElement("table");
    outerNode.appendChild(table);
    for (var i = 0; i < rows; i++) {
        const row = table.insertRow();
        for (var j = 0; j < columns; j++) {
            var cell = row.insertCell();

            //cell.appendChild(innerNode);
        }
    }
    return outerNode;

}

function setCell(outerNode, InnerNode, rowIndex, colIndex) {
    const table = outerNode.querySelector("table");
    const row = table.rows[rowIndex];
    if (row) {
        var cell = row.cells[colIndex];
        if (cell) {
            cell.appendChild(InnerNode);
            return cell;
        }
    }
    return null;
}


function makeOuterRepresentNode() {
    const outerNode = document.createElement('div');
    outerNode.classList.add("outer-Represent");
    outerNode.innerHTML = "<table></table>";
    return outerNode;
}

function makeInnerRepresentNode() {
    const innerNode = document.createElement("div");
    innerNode.classList.add("inner-box");
    return innerNode;
}

function makeOuterMemoryNode() {
    const outerMemoryNode = document.createElement("div");
    outerMemoryNode.classList.add("outer-Memory");
    return outerMemoryNode;
}

function makeInnerMemoryNode() {
    const innerMemoryNode = document.createElement("div");
    innerMemoryNode.classList.add("inner-Memory-box");
    return innerMemoryNode;
}

const outerRepresentNode = makeOuterRepresentNode();
outerRepresentNode.style.top = "90px";
outerRepresentNode.style.left = "100px";
maketable(outerRepresentNode, 1, 2);

const outerRepresentNode2 = makeOuterRepresentNode();
outerRepresentNode2.style.top = "120px";
outerRepresentNode2.style.left = "80px";
maketable(outerRepresentNode2, 1, 2);

const innerRepresentNode1 = makeInnerRepresentNode();
const innerRepresentNode2 = makeInnerRepresentNode();
const innerRepresentNode3 = makeInnerRepresentNode();
const innerRepresentNode4 = makeInnerRepresentNode();

setCell(outerRepresentNode, innerRepresentNode1, 0, 0);
setCell(outerRepresentNode, innerRepresentNode2, 0, 1);
setCell(outerRepresentNode2, innerRepresentNode3, 0, 0);
setCell(outerRepresentNode2, innerRepresentNode4, 0, 1);

const outerMemoryNode = makeOuterMemoryNode();
outerMemoryNode.style.top = "30px";
outerMemoryNode.style.left = "60px";

const innerMemoryNode1 = makeInnerMemoryNode();
const innerMemoryNode2 = makeInnerMemoryNode();

outerMemoryNode.appendChild(innerMemoryNode1);
outerMemoryNode.appendChild(innerMemoryNode2);

representDiv.appendChild(outerRepresentNode);
representDiv.appendChild(outerRepresentNode2);
memoryDiv.appendChild(outerMemoryNode);

const sleepTimeSlider = document.getElementById("sleepTimeSlider");
const ExecValue = document.getElementById("ExecutionSpeedValue");

sleepTimeSlider.addEventListener("input", function () {
    let speed = Math.pow(10, (this.value / 333) - 1);
    sleepTime = Math.round(1000 / speed);
    if (speed < 10) {
        ExecValue.innerHTML = speed.toFixed(1) + 'x';
    } else {
        ExecValue.innerHTML = Math.round(speed) + 'x';
    }
    // Calculate the percentage of the slider's value relative to the max value
    let percentage = (this.value / this.max) * 100;

    let color = `linear-gradient(90deg, red ${percentage}%, white ${percentage}%)`;
    sleepTimeSlider.style.background = color;
});
let PauseButton=document.querySelector(".pause-button");

function Pauseexecution(){
    if(PAUSE_EXEC==true){
        PAUSE_EXEC=false;
        PauseButton.value="Pause";
    }else{
        PAUSE_EXEC=true;    
        PauseButton.value="Resume";
    }
}
