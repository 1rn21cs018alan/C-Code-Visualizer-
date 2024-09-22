function createEditorLine(text) {
    let t = document.createElement("span");
    t.classList.add("editor_line");
    t.contentEditable = "true";
    t.textContent = text;

    if (text.includes("\n")) {
        throw new Error("NewLine Not allowed");
    }

    t.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            event.preventDefault();

            // let tabSpan = document.createElement("span");
            // tabSpan.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
            // tabSpan.classList.add("tab_space");

            // console.log(this);
            // console.log(this.getSelection());
            let selection = window.getSelection();
            // console.log(this.selectionStart);
            let range = selection.getRangeAt(0);
            // range.insertNode(tabSpan);
            if(selection.rangeCount>0){
                let range=selection.getRangeAt(0);
                if(selection.rangeCount===1){
                    let cursor_pos=range.startOffset;
                    this.innerHTML=this.innerHTML.slice(0,cursor_pos)+"\t"+this.innerHTML.slice(cursor_pos);
                    // let newRange=range.cloneRange();
                    range.setStart(this.firstChild,cursor_pos+1);
                    range.setEnd(this.firstChild,cursor_pos+1);
                }
            }

            //Modified Harsh code 
        //     if (selection.rangeCount > 0) {
        //         let range = selection.getRangeAt(0);
        //         let cursorPos = range.startOffset;
        
        //         // Insert the tab span at the cursor position
        //         range.insertNode(tabSpan);
                
        //         // Move cursor to the correct position after the tab
        //         range.setStartAfter(tabSpan);
        //         range.setEndAfter(tabSpan);
        //     }
        //     // range.setStartAfter(tabSpan);
        //     // range.setEndAfter(tabSpan);
        //     // selection.removeAllRanges();
        //     // selection.addRange(range);

        // }

        // if (event.key === "Backspace") {
        //     let selection = window.getSelection();
        //     let range = selection.getRangeAt(0);

        //     // // Check if the caret is just after a tab space
        //     // if (range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
        //     //     let prevSibling = range.startContainer.parentNode.previousElementSibling;
        //     //     console.log(prevSibling);

        //     //     // If the previous sibling is a tab space span
        //     //     if (prevSibling && prevSibling.classList.contains("tab_space")) {
        //     //         event.preventDefault(); // Prevent default backspace behavior
        //     //         parentNode.removeChild(prevSibling);  // Remove the entire tab space
        //     //     }
        //     // }
        //     // // If caret is placed just after an empty span element
        //     // else if (range.startContainer.nodeType === Node.ELEMENT_NODE && range.startOffset === 1) {
        //     //     let prevSibling = range.startContainer.previousElementSibling;
        //     //     console.log(prevSibling);

        //     //     // If the previous sibling is a tab space span
        //     //     if (prevSibling && prevSibling.classList.contains("tab_space")) {
        //     //         event.preventDefault(); // Prevent default backspace behavior
        //     //         parentNode.removeChild(prevSibling); // Remove the tab space
        //     //     }
        //     // }

        //     // const startContainer = range.startContainer;

        //     // // Ensure the selection is at the start of a text node  
        //     // if (startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
        //     //     let parentSpan = startContainer.parentNode;
        //     //     //let firstSpan=parentSpan.firstElementChild;
        //     //     console.log(firstSpan);

        //     //     // Check if the parent is a <span> and contains four &nbsp;  
        //     //     if (parentSpan.tagName === 'SPAN' && parentSpan.innerHTML === '&nbsp;&nbsp;&nbsp;&nbsp;') {
        //     //         // Prevent the default backspace action  
        //     //         event.preventDefault();

        //     //         // Remove the span from the DOM  
        //     //         const parent = parentSpan.parentNode;
        //     //         parent.removeChild(parentSpan);
        //     //     }
        //     // }

        //     // const startContainer1 = range.startContainer;

        //     // // Ensure the selection is at the start of a text node  
        //     // if (startContainer1.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
        //     //     let parentSpan = startContainer.parentNode;
        //     //     console.log("Selected: ", startContainer1, " Parent: ", parentSpan); 

        //     //     // Check if the previous sibling is the tab span  
        //     //     if (parentSpan.previousElementSibling &&
        //     //         parentSpan.previousElementSibling.classList.contains('tab_space')) {
        //     //         // Prevent the default backspace action  
        //     //         event.preventDefault();
        //     //         // Remove the tab span from the DOM  
        //     //         const tabSpan = parentSpan.previousElementSibling;
        //     //         tabSpan.parentNode.removeChild(tabSpan);
        //     //     }
        //     // }

        //     // let startContainer = range.startContainer;
        //     // let startOffset = range.startOffset;

        //     // // Ensure selection is at the start of a text node  
        //     // if (startContainer.nodeType === Node.TEXT_NODE && startOffset === 0) {
        //     //     let firstSpan = startContainer.parentElement.firstElementChild;

        //     //     // Check if the parent is a <span> and contains exactly four &nbsp;  
        //     //     if (firstSpan.tagName === 'SPAN' && firstSpan.innerHTML === '&nbsp;&nbsp;&nbsp;&nbsp;' && firstSpan.classList.contains("tab_space")) {
        //     //         // Prevent the default backspace action  
        //     //         event.preventDefault();

        //     //         // Remove the span from the DOM  
        //     //         let parent = firstSpan.parentElement;
        //     //         parent.removeChild(firstSpan);

        //     //         // Set the cursor position back to the text node before the span, if needed  
        //     //         let newRange = document.createRange();
        //     //         newRange.setStart(startContainer, 0); // Place it at the start of the text node  
        //     //         newRange.collapse(true);
        //     //         selection.removeAllRanges();
        //     //         selection.addRange(newRange);
        //     //     }
        //     // }

        //     // let prevSibling = range.startContainer.previousElementSibling;

        //     // if (prevSibling && prevSibling.classList.contains("tab_space")) {
        //     //     event.preventDefault(); // Prevent the default backspace behavior

        //     //     // Remove the entire tab space element
        //     //     prevSibling.remove();

        //     //     // Adjust the caret position to the start of the current node
        //     //     range.setStart(range.startContainer, 0);
        //     //     range.setEnd(range.startContainer, 0);
        //     //     selection.removeAllRanges();
        //     //     selection.addRange(range);
        //     // }


        //     //Backspace event code - Preferred one 

        //     // Check if caret is placed after a tab span (Element Node check)
        //     let startContainer = range.startContainer;

        //     // Check if caret is inside the tab space
        //     if (startContainer.nodeType === Node.TEXT_NODE && startContainer.parentNode.classList.contains("tab_space")) {
        //         event.preventDefault(); // Prevent default behavior
        //         startContainer.parentNode.remove(); // Remove the whole tab space
        //     }
        //     // Check if caret is just after the tab space
        //     else if (startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
        //         let parentSpan = startContainer.parentNode;
        //         let prevElement = parentSpan.firstElementChild;

        //         if (prevElement && prevElement.classList.contains("tab_space")) {
        //             event.preventDefault(); // Prevent default backspace behavior
        //             prevElement.remove(); // Remove the whole tab space
        //         }
        //     }
        //     // Check if caret is directly inside an element node (span)
        //     else if (startContainer.nodeType === Node.ELEMENT_NODE) {
        //         let prevElement = startContainer.firstElementChild;

        //         // If the previous sibling is a tab space, delete it
        //         if (prevElement && prevElement.classList.contains("tab_space")) {
        //             event.preventDefault(); // Prevent the default backspace behavior
        //             prevElement.remove(); // Remove the entire tab space span
        //         }
        //         // If caret is directly inside a tab space, delete it immediately
        //         else if (startContainer.firstChild && startContainer.firstChild.classList.contains("tab_space")) {
        //             event.preventDefault(); // Prevent default backspace behavior
        //             startContainer.firstChild.remove(); // Remove the tab space span
        //         }
        //     }
        }

        
    });
    return t;

}
/*
function createEditorLine(text) {
    let t = document.createElement("span");
    t.classList.add("editor_line");
    t.contentEditable = "true";

    // Split text into content and tab spaces if applicable
    let matchTab = text.match(/^\t+/); // Match leading tabs
    let textWithoutTabs = text.replace(/^\t+/, ''); // Remove leading tabs for text content

    // Add leading tab spaces if any
    if (matchTab) {
        let tabCount = matchTab[0].length;
        for (let i = 0; i < tabCount; i++) {
            let tabSpan = document.createElement("span");
            tabSpan.classList.add("tab_space");
            tabSpan.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
            t.appendChild(tabSpan);
        }
    }

    // Add the actual text content after the tab spaces
    let textNode = document.createTextNode(textWithoutTabs);
    t.appendChild(textNode);

    // Handle 'keydown' event for inserting tab spaces
    t.addEventListener("keydown", function (event) {
        let selection = window.getSelection();
        let range = selection.getRangeAt(0);
        let startContainer = range.startContainer;

        // Inserting tab space on Tab key
        if (event.key === "Tab") {
            event.preventDefault();

            // Create the tab space span
            let tabSpan = document.createElement("span");
            tabSpan.classList.add("tab_space");
            tabSpan.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";

            // If the cursor is inside a text node, split the text at the cursor position
            if (startContainer.nodeType === Node.TEXT_NODE) {
                let cursorPos = range.startOffset;
                let textNode = startContainer;
                let beforeText = textNode.nodeValue.slice(0, cursorPos);
                let afterText = textNode.nodeValue.slice(cursorPos);

                // Update the text node
                textNode.nodeValue = beforeText;

                // Insert the tab span and remaining text
                t.insertBefore(tabSpan, textNode.nextSibling);
                let afterTextNode = document.createTextNode(afterText);
                t.insertBefore(afterTextNode, tabSpan.nextSibling);

                // Set cursor after the tab space
                range.setStart(afterTextNode, 0);
                range.setEnd(afterTextNode, 0);
            }
        }

        // Handle backspace to delete tab spaces
        if (event.key === "Backspace") {
            // Check if caret is placed after a tab span (Element Node check)
            let startContainer = range.startContainer;

            // Check if caret is inside the tab space
            if (startContainer.nodeType === Node.TEXT_NODE && startContainer.parentNode.classList.contains("tab_space")) {
                event.preventDefault(); // Prevent default behavior
                startContainer.parentNode.remove(); // Remove the whole tab space
            }
            // Check if caret is just after the tab space
            else if (startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
                let parentSpan = startContainer.parentNode;
                let prevElement = parentSpan.firstElementChild;

                if (prevElement && prevElement.classList.contains("tab_space")) {
                    event.preventDefault(); // Prevent default backspace behavior
                    prevElement.remove(); // Remove the whole tab space
                }
            }
            // Check if caret is directly inside an element node (span)
            else if (startContainer.nodeType === Node.ELEMENT_NODE) {
                let prevElement = startContainer.firstElementChild;

                // If the previous sibling is a tab space, delete it
                if (prevElement && prevElement.classList.contains("tab_space")) {
                    event.preventDefault(); // Prevent the default backspace behavior
                    prevElement.remove(); // Remove the entire tab space span
                }
                // If caret is directly inside a tab space, delete it immediately
                else if (startContainer.firstChild && startContainer.firstChild.classList.contains("tab_space")) {
                    event.preventDefault(); // Prevent default backspace behavior
                    startContainer.firstChild.remove(); // Remove the tab space span
                }
            }
        }
    });

    return t;
}
*/
// Ensure proper separation of lines:
function addLineToEditor(text) {
    let editor = document.getElementById("Cin");

    let line = createEditorLine(text);  // This creates the line with proper tab spaces
    editor.appendChild(line);           // Add the created line to the editor
}

// window.onload = function() {  
//     let editor = document.getElementById("Cin");  
    
//     // Add a keydown event listener to the editor  
//     editor.addEventListener("keydown", function(event) {  
//         if (event.key === "Enter") {  
//             event.preventDefault(); // Prevent default action (e.g., submitting a form)  
            
//             // Add a new empty line to the editor  
//             addLineToEditor("Hello");   
//         }  
//     });  
// };  

// Sample usage
// addLineToEditor("int i=0;");
// addLineToEditor("\ti++;");
// addLineToEditor("\ti+=2;");



// document.getElementById("Cin").addEventListener("keydown", function(event) {
//     if (event.key === "Enter") {
//         event.preventDefault(); // Prevent default Enter behavior
//         let newLine = createEditorLine("");
//         this.appendChild(newLine);
//         newLine.focus(); // Focus the newly added line
//     }
// });


// document.getElementById("Cin").addEventListener("click", function (event) {



//     if (event.target.tagName === "SPAN" && event.target.contentEditable === "false") {
//         let clickedSpan = event.target;


//         let newLine = createEditorLine("");


//         clickedSpan.insertAdjacentElement('afterend', newLine);


//         newLine.focus();


//         clickedSpan.contentEditable = "false";
//     }

// });

// document.getElementById("Cin").addEventListener("keydown", function(event) {
//     // Check if the pressed key is "Enter"
//     if (event.key === "Enter") {
//         event.preventDefault(); // Prevent the default Enter behavior (like adding a new line in contenteditable)

//         // Get the current active or focused element inside Cin
//         let activeElement = document.activeElement;
//         console.log("Active element: ", activeElement);

//         // Check if the active element is a non-editable span
//         if (activeElement.tagName === "SPAN" && activeElement.contentEditable === "false") {
//             console.log("Active element is a non-editable span: ", activeElement);
//             let clickedSpan = activeElement;

//             // Create a new editable line (span)
//             let newLine = createEditorLine("");

//             // Insert the new editable span after the active (non-editable) span
//             clickedSpan.insertAdjacentElement('afterend', newLine);

//             // Focus the newly added line for editing
//             newLine.focus();

//             clickedSpan.contentEditable = "false";
//         }
//     }
// });

// function getCinLine(linenumber){
//     let Editor=document.getElementById("Cin");

//     let LineElem=Editor.children[linenumber-1];
//     if(!LineElem){
//         return null;
//     }

//     let result="";
//     LineElem.childNodes.forEach(function(node){
//         if(node.nodeType===Node.TEXT_NODE){
//             result+=node.textContent;
//         }
//         else if((node.nodeType===Node.ELEMENT_NODE) && (node.classList.contains("tab_space")) || (node.classList.contains("tab"))){
//             result+="\t";
//             result+=node.textContent.trim();

//         }
//     });
//     return result.trim();
// }
function getCinLine(linenumber) {
    let Editor = document.getElementById("Cin");
    let LineElem = Editor.children[linenumber - 1];
    console.log(LineElem.innerHTML);
    if (!LineElem) {
        return null;
    }
    return LineElem.innerHTML
    let result = "";

    // function processNode(node) {
    //     if (node.nodeType === Node.TEXT_NODE) {
    //         result += node.textContent;
    //     } else if (node.nodeType === Node.ELEMENT_NODE) {
    //         if (node.classList.contains("tab_space") || node.classList.contains("tab")) {
    //             result += "\t";  
    //             node.childNodes.forEach(childNode => {
    //                 processNode(childNode);  
    //             });
    //         }
    //     }
    // }

    
    // LineElem.childNodes.forEach(function(node) {
    //     processNode(node);
    // });

    // return result.trim();  
}


function getCinProgram(){
    let editor=document.getElementById("Cin");
    let totalLines=editor.children.length;
    let programText="";
    for(let i=1;i<=totalLines;i++){
        let LineTxt=getCinLine(i);
        if(LineTxt!==null){
            programText+=LineTxt+"\n";
        }
    }

    return programText;
}

// //Function to insert tab at selected text
// function insertTabAtSelectedText() {  
//     const selection = window.getSelection();  

//     if (selection.rangeCount > 0) {  
//         const range = selection.getRangeAt(0);  
//         const selectedText = range.toString();  

//         // Create a new text node with the tab space  
//         const tabSpace = '\t'; // This can also be '\u00A0\u00A0' for non-breaking spaces  
//         const newTextNode = document.createTextNode(tabSpace + selectedText);  

//         // Create a new range to replace the selected text  
//         //range.deleteContents(); // Remove the currently selected text  
//         range.insertNode(newTextNode); // Insert the new node with the tab space  

//         // Update the selection to the new text node  
//         selection.removeAllRanges();  
//         selection.addRange(range);  
//     } else {  
//         console.log("No text selected.");  
//     }  
// }  

// function getSelectedElements() {  
//     var selection = window.getSelection();  
//     var elements = [];  

//     if (selection.rangeCount > 0) {  
//         var range = selection.getRangeAt(0);  
//         var selectedNode = range.commonAncestorContainer;  

//         // If the selectedNode is a text node, go to its parent element  
//         if (selectedNode.nodeType === Node.TEXT_NODE) {  
//             selectedNode = selectedNode.parentNode;  
//         }  

//         // Iterate upward from the selected node to gather all ancestors  
//         // that are affected by the selection.  
//         const startContainer = range.startContainer;  
//         const endContainer = range.endContainer;  

//         if (startContainer.nodeType === Node.TEXT_NODE) {  
//             elements.push(startContainer.parentNode);  
//         }  

//         if (endContainer.nodeType === Node.TEXT_NODE && endContainer.parentNode !== startContainer.parentNode) {  
//             elements.push(endContainer.parentNode);  
//         }  

//         //Find common ancestor  
//         let ancestor = range.commonAncestorContainer;  
//         while (selectedNode && selectedNode !== document.body) {  
//         elements.push(selectedNode);  
//              selectedNode = selectedNode.parentNode;  
//          }  
//     }  

//     return [...new Set(elements)]; // to avoid duplicates  
// }  

// function getSelectedElements() {  
//     let selection = window.getSelection();  
//     let elements = [];  

//     if (selection.rangeCount > 0) {  
//         let range = selection.getRangeAt(0);  
//         let startContainer = range.startContainer;  
//         let endContainer = range.endContainer;  

//         // Normalize text nodes to their parent elements if needed  
//         if (startContainer.nodeType === Node.TEXT_NODE) {  
//             startContainer = startContainer.parentNode;  
//         }  
//         if (endContainer.nodeType === Node.TEXT_NODE) {  
//             endContainer = endContainer.parentNode;  
//         }  

//         // Get the common ancestor  
//         let commonAncestor = range.commonAncestorContainer;  

//         // Collect elements within the range  
//         const elementsInRange = [];  
//         const nodes = document.createTreeWalker(  
//             commonAncestor,  
//             NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,  
//             null,  
//             false  
//         );  

//         let currentNode;  
//         // Iterate through nodes in the tree walker  
//         while ((currentNode = nodes.nextNode())) {  
//             // Check if this node is within the bounds of the selection  
//             if (range.isPointInRange(currentNode, 0) || range.isPointInRange(currentNode, currentNode.childNodes.length)) {  
//                 elementsInRange.push(currentNode);  
//             }  
//         }  

//         // If any relevant elements were found, remove duplicates and push to the elements array  
//         for (const el of elementsInRange) {  
//             if (!elements.includes(el)) {  
//                 elements.push(el);  
//             }  
//         }  
//     }  

//     return elements; // return the array of unique elements  
// }



function getSelectedElements() {  
    let selection = window.getSelection();  
    let elements = [];  

    if (selection.rangeCount > 0) {  
        let range = selection.getRangeAt(0);  
        let startContainer = range.startContainer;  
        let endContainer = range.endContainer;  

        // Normalize text nodes to their parent elements if needed  
        if (startContainer.nodeType === Node.TEXT_NODE) {  
            startContainer = startContainer.parentNode;  
        }  
        if (endContainer.nodeType === Node.TEXT_NODE) {  
            endContainer = endContainer.parentNode;  
        }  

        // Get the common ancestor  
        let commonAncestor = range.commonAncestorContainer;  

        // Collect elements within the range  
         
        const nodes = document.createTreeWalker(  
            commonAncestor,  
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,  
            null,  
            false  
        );  

        let currentNode;  
        // Iterate through nodes in the tree walker  
        while ((currentNode = nodes.nextNode())) {  
            // Check if this node is within the bounds of the selection  
            if (range.intersectsNode(currentNode)) {  
                elements.push(currentNode);  
            }  
        }  

        // Include start and end containers if they are not already included  
        if (!elements.includes(startContainer)) {  
            elements.push(startContainer);  
        }  
        if (!elements.includes(endContainer)) {  
            elements.push(endContainer);  
        }  // Add start and end elements if they are not already included  

    }  

    return elements; 
} 

// // // Helper function to get unique elements from the array  
// // function getUniqueElements(array) {  
// //     return array.filter((element, index) => array.indexOf(element) === index);  
// // }  


// function prependTabToSelectedElements() {  
//     const selectedElements = getSelectedElements();  

//     // Add tab space to the text content of each relevant element  
//     selectedElements.forEach(element => {  
//         if (element.nodeType === Node.ELEMENT_NODE) {  
//             // Check text nodes only  
//             element.childNodes.forEach(child => {  
//                 if (child.nodeType === Node.TEXT_NODE) {  
//                     // Prepend tab space  
//                     child.nodeValue = '\t' + child.nodeValue;  
//                 }  
//             });  
//         }  
//     });  
// }  



function prependTabToSelectedLines() {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0);
    let editorLines = document.querySelectorAll('.editor_line');

    editorLines.forEach(function (line) {
        // Check if the line intersects the selection range
        if (range.intersectsNode(line)) {
            // Check if line is valid before using classList.contains
            if (line && line.classList && line.classList.contains('editor_line')) {
                // Prepend tab space to the line's innerHTML
                line.innerHTML = "\t" + line.innerHTML;
            }
        }
    });
}

// document.getElementById("Cin").addEventListener("keydown", function (event) {
//     if (event.key === "Tab") {
//         event.preventDefault(); // Prevent default tab behavior (browser focus shifting)

//         // Get the selected text range
//         let selection = window.getSelection();
//         let range = selection.getRangeAt(0); // Get the first range in the selection
        
//         // Ensure there is a valid range selection
//         if (!range.collapsed) {
//             prependTabToSelectedLines(range); // Call the function to handle tabbing for selected lines
//         }
//     }
// });
document.addEventListener('keydown', function(event) {  
    if (event.key === 'Tab') {  
        event.preventDefault(); // Prevent the default tab behavior  
        prependTabToSelectedLines();  
    }  
});

