const representDiv=document.getElementsByClassName("Represent")[0];
const memoryDiv=document.getElementsByClassName("Memory")[0];

function makeOuterRepresentNode(){
    const outerNode=document.createElement('div');
    outerNode.classList.add("outer-Represent");
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