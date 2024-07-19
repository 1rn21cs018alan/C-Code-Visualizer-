const representDiv=document.getElementsByClassName("Represent")[0];
const memoryDiv=document.getElementsByClassName("Memory")[0];
function maketable(outerNode,rows,columns){
     outerNode.innerHTML="";
     var table=document.createElement("table");
     outerNode.appendChild(table);
     for(var i=0;i<rows;i++){
        const row=table.insertRow();
        for(var j=0;j<columns;j++){
            var cell=row.insertCell();

            //cell.appendChild(innerNode);
        }
     }
     return outerNode;

}

function setCell(outerNode,InnerNode,rowIndex,colIndex){
    const table=outerNode.querySelector("table");
    const row=table.rows[rowIndex];
    if(row){
        var cell=row.cells[colIndex];
        if(cell){
            cell.appendChild(InnerNode);
            return cell;
        }
    }
     return null;
}

function makeOuterRepresentNode(){
    const outerNode=document.createElement('div');
    outerNode.classList.add("outer-Represent");
    outerNode.innerHTML="<table></table>";
    return outerNode;
}

function makeInnerRepresentNode(){
    const innerNode=document.createElement("div");
    innerNode.classList.add("inner-box");
    return innerNode;
}

function makeOuterMemoryNode(){
    const outerMemoryNode=document.createElement("div");
    outerMemoryNode.classList.add("outer-Memory");
    return outerMemoryNode;
}

function makeInnerMemoryNode(){
    const innerMemoryNode=document.createElement("div");
    innerMemoryNode.classList.add("inner-Memory-box");
    return innerMemoryNode;
}

const outerRepresentNode=makeOuterRepresentNode();
outerRepresentNode.style.top="90px";
outerRepresentNode.style.left="100px";

const innerRepresentNode1=makeInnerRepresentNode();
const innerRepresentNode2=makeInnerRepresentNode();

outerRepresentNode.appendChild(innerRepresentNode1);
outerRepresentNode.appendChild(innerRepresentNode2);

const outerMemoryNode=makeOuterMemoryNode();
outerMemoryNode.style.top="30px";
outerMemoryNode.style.left="60px";

const innerMemoryNode1=makeInnerMemoryNode();
const innerMemoryNode2=makeInnerMemoryNode();

outerMemoryNode.appendChild(innerMemoryNode1);
outerMemoryNode.appendChild(innerMemoryNode2);

representDiv.appendChild(outerRepresentNode);
memoryDiv.appendChild(outerMemoryNode);
