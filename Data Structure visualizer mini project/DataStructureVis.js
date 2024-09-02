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




// function tabulate(outerNode,InnerNode,row,column){
//     //Your need to add Innernode to OuterNode at specific row and column
//     // if innernode===undefined, then delete that cell if it exists
//     // after deletion, if entire row/column is empty, then delete that row/column
//     // if on adding, row doesnot exists or column doesnot exists, add a column
//     /*      eg:      adding to(3,3) on a 2x2 table, 
//                 3,3 is higher row and column, so add row and column
//                 you have to first increase number of rows to 3
//                 then increase number of column to 3 in all rows
//                 then set (3,3)
//     */
//      a=outerNode.innerHTML;
//      const rows=a.rows[i];
//      if(!rows){
//         rows=a.insertRow(row);
//      }
//      for(var i=0;i<a.rows.length;i++){
//          const cell=rows.insertCell(column);
//          cell.appendChild(InnerNode);
//          if(InnerNode===undefined){
//                 rows.deleteCell(cell);
//          }
//      }

// } 


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
maketable(outerRepresentNode, 1, 2);

const outerRepresentNode2 = makeOuterRepresentNode();
outerRepresentNode2.style.top = "120px";
outerRepresentNode2.style.left = "80px";
maketable(outerRepresentNode2, 1, 2); 

const innerRepresentNode1=makeInnerRepresentNode();
const innerRepresentNode2=makeInnerRepresentNode();
const innerRepresentNode3 = makeInnerRepresentNode();
const innerRepresentNode4 = makeInnerRepresentNode();

setCell(outerRepresentNode, innerRepresentNode1, 0, 0);
setCell(outerRepresentNode, innerRepresentNode2, 0, 1);
setCell(outerRepresentNode2, innerRepresentNode3, 0, 0);
setCell(outerRepresentNode2, innerRepresentNode4, 0, 1);

// outerRepresentNode.appendChild(innerRepresentNode1);
// outerRepresentNode.appendChild(innerRepresentNode2);
//tabulate(outerRepresentNode,innerRepresentNode1,0,0);
//tabulate(outerRepresentNode,innerRepresentNode2,1,0);

const outerMemoryNode=makeOuterMemoryNode();
outerMemoryNode.style.top="30px";
outerMemoryNode.style.left="60px";

const innerMemoryNode1=makeInnerMemoryNode();
const innerMemoryNode2=makeInnerMemoryNode();

outerMemoryNode.appendChild(innerMemoryNode1);
outerMemoryNode.appendChild(innerMemoryNode2);

representDiv.appendChild(outerRepresentNode);
representDiv.appendChild(outerRepresentNode2);
memoryDiv.appendChild(outerMemoryNode);

// Function to draw an arrow between two elements
// function drawArrow(fromElement, toElement, svgElement) {
//     const fromRect = fromElement.getBoundingClientRect();
//     const toRect = toElement.getBoundingClientRect();

//     const startX = fromRect.right;
//     const startY = fromRect.top + fromRect.height / 6;
//     const endX = toRect.left;
//     const endY = toRect.top + toRect.height / 6;

//     const arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     arrow.setAttribute("x1", startX);
//     arrow.setAttribute("y1", startY);
//     arrow.setAttribute("x2", endX);
//     arrow.setAttribute("y2", endY);
//     arrow.setAttribute("stroke", "black");
//     arrow.setAttribute("stroke-width", "2");
//     arrow.setAttribute("marker-end", "url(#arrowhead)");

//     svgElement.appendChild(arrow);
// }

// // Add a marker for the arrowhead
// const svgElement = document.getElementById("arrow-svg");
// const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
// marker.setAttribute("id", "arrowhead");
// marker.setAttribute("markerWidth", "10");
// marker.setAttribute("markerHeight", "7");
// marker.setAttribute("refX", "10");
// marker.setAttribute("refY", "3.5");
// marker.setAttribute("orient", "auto");

// const arrowheadPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
// arrowheadPath.setAttribute("d", "M0,0 L10,3.5 L0,7 Z");
// arrowheadPath.setAttribute("fill", "black");

// marker.appendChild(arrowheadPath);
// svgElement.appendChild(marker);

// // Example usage: draw an arrow from the second inner-box of the first outer-Represent to the first inner-box of the second outer-Represent
// const fromElement = innerRepresentNode2;
// const toElement = innerRepresentNode3;
// drawArrow(fromElement, toElement, svgElement);