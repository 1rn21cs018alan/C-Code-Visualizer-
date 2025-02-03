const lineNumbersContainer = document.getElementById("lineNumbers");
function createEditorLine(text) {
  let t = document.createElement("span");
  t.classList.add("editor_line");
  t.contentEditable = "true";
  t.textContent = text;
  if (text.includes("\n")) {
    throw new Error("NewLine Not allowed");
  }
  return t;
}

function addLineToEditor(text) {
  let editor = document.getElementById("Cin");

  let line = createEditorLine(text); // This creates the line with proper tab spaces
  editor.appendChild(line); // Add the created line to the editor
  updateLineNumbers();
}

function getCinLine(linenumber) {
  let Editor = document.getElementById("Cin");
  let LineElem = Editor.children[linenumber - 1];
  // console.log(LineElem.innerHTML);
  if (!LineElem) {
    return null;
  }
  return LineElem.innerText;
}

function getCinProgram() {
  let editor = document.getElementById("Cin");
  let totalLines = editor.children.length;
  let programText = "";
  for (let i = 1; i <= totalLines; i++) {
    let LineTxt = getCinLine(i);
    if (LineTxt !== null) {
      programText += LineTxt + "\n";
    }
  }

  return programText;
}

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
    } // Add start and end elements if they are not already included
  }

  return elements;
}

function prependTabToSelectedLines() {
  let selection = window.getSelection();
  if (!selection.rangeCount) return;

  let range = selection.getRangeAt(0);
  let editorLines = document.querySelectorAll(".editor_line");

  editorLines.forEach(function (line) {
    // Check if the line intersects the selection range
    if (range.intersectsNode(line)) {
      // Check if line is valid before using classList.contains
      if (
        line &&
        line.classList &&
        line.classList.contains("editor_line") &&
        line.contentEditable === "true"
      ) {
        // Prepend tab space to the line's innerHTML
        line.textContent = "\t" + line.textContent;
      }
    }
  });
}

function singleLineShiftTab() {
  let selection = window.getSelection();
  if (selection.rangeCount > 0) {
    let range = selection.getRangeAt(0);
    let startContainer = range.startContainer;
    if (startContainer.nodeType === Node.TEXT_NODE) {
      startContainer = startContainer.parentNode;
    }
    if (
      startContainer.classList.contains("editor_line") &&
      startContainer.contentEditable === "true"
    ) {
      let lineTxt = startContainer.textContent;
      if (lineTxt.startsWith("\t")) {
        startContainer.textContent = lineTxt.replace(/^\t/, "");
      } else if (lineTxt.startsWith("    ")) {
        startContainer.textContent = lineTxt.replace(/^ {4}/, "");
      }
    }
  }
}

function multiLineShiftTab() {
  let selectedElements = getSelectedElements();
  selectedElements.forEach(function (element) {
    if (
      element.classList &&
      element.classList.contains("editor_line") &&
      element.contentEditable === "true"
    ) {
      let lineText = element.textContent;
      if (lineText.startsWith("\t")) {
        element.textContent = lineText.replace(/^\t/, "");
      } else if (lineText.startsWith("    ")) {
        element.textContent = lineText
          .replace(/^ {1}/, "")
          .replace(/^ {1}/, "")
          .replace(/^ {1}/, "")
          .replace(/^ {1}/, "");
      }
    }
  });
}

function singleLineComment(lineElement) {
  if (
    lineElement &&
    lineElement.classList.contains("editor_line") &&
    lineElement.contentEditable === "true"
  ) {
    let lineText = lineElement.textContent.trim();
    if (lineText.startsWith("//")) {
      lineElement.textContent = lineText.slice(2);
      lineElement.classList.remove("commented");
    } else {
      lineElement.textContent = "//" + lineText;
      lineElement.classList.add("commented");
    }
  }
}

function multiLineComment() {
  let selection = window.getSelection();
  let range = selection.getRangeAt(0);
  let startContainer = range.startContainer;
  let endContainer = range.endContainer;
  if (startContainer.nodeType === Node.TEXT_NODE) {
    startContainer = startContainer.parentNode;
  }
  if (endContainer.nodeType === Node.TEXT_NODE) {
    endContainer = endContainer.parentNode;
  }
  let commonAncestor = range.commonAncestorContainer;
  let elements = [];
  const nodes = document.createTreeWalker(
    commonAncestor,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let currentNode;
  while ((currentNode = nodes.nextNode())) {
    if (
      range.intersectsNode(currentNode) &&
      currentNode.nodeType === Node.ELEMENT_NODE &&
      currentNode.contentEditable === "true"
    ) {
      elements.push(currentNode);
    }
  }
  elements.forEach((el) => {
    if (el && el.classList && el.classList.contains("commented")) {
      el.textContent = el.textContent.replace(/^\/\//, ""); // Uncomment
      el.classList.remove("commented");
    } else if (el) {
      el.textContent = "//" + el.textContent;
      el.classList.add("commented");
    }
  });
}

function prependSingleLineTab(lineElement) {
  let selection = document.getSelection();
  let range = selection.getRangeAt(0);
  if (selection.rangeCount === 1) {
    let cursor_pos = range.startOffset;
    let textBeforeCursor = lineElement.textContent.slice(0, cursor_pos);
    let textAfterCursor = lineElement.textContent.slice(cursor_pos);
    lineElement.textContent = textBeforeCursor + "\t" + textAfterCursor;
    range.setStart(lineElement.firstChild, cursor_pos + 1);
    range.setEnd(lineElement.firstChild, cursor_pos + 1);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
///
function containsNonEditable(container, range) {
  if (container.nodeType === Node.TEXT_NODE) {
    container = container.parentNode;
  }

  if (container.contentEditable === "false") {
    return true;
  }

  // Check all child nodes within the range
  let nodesInRange = document.createNodeIterator(
    container,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: function (node) {
        return range.intersectsNode(node)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  let currentNode;
  while ((currentNode = nodesInRange.nextNode())) {
    if (currentNode.contentEditable === "false") {
      return true;
    }
  }

  return false;
}

///
document.addEventListener("keydown", function (event) {
  setTimeout(updateLineNumbers, 100);
  let selection = window.getSelection();
  if (!selection.rangeCount) return;

  let range = selection.getRangeAt(0); // Get the selection range
  let startContainer = range.startContainer;
  let endContainer = range.endContainer;

  // Normalize to parent element if necessary
  if (startContainer.nodeType === Node.TEXT_NODE) {
    startContainer = startContainer.parentNode;
  }
  if (endContainer.nodeType === Node.TEXT_NODE) {
    endContainer = endContainer.parentNode;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    if (startContainer.classList.contains("editor_line")) {
      const currentLineText = startContainer.textContent.trim();
      let newLine = createEditorLine(" "); // Create a new empty editable line
      let tabspaces = 0;
      for (let i = 0; i < startContainer.innerText.length; i++) {
        if (startContainer.innerText[i] == " ") {
          tabspaces += 0.25
        }
        else if (startContainer.innerText[i] == '\t') {
          tabspaces = Math.ceil(tabspaces + 0.125);
        }
        else {
          break;
        }
      }
      tabspaces = Math.ceil(tabspaces);
      let tabspace = ""
      for (let i = 0; i < tabspaces; i++) {
        tabspace += '\t';
      }
      if (!containsNonEditable(range.commonAncestorContainer, range)) {
        newLine.innerText=startContainer.innerText.slice(selection.anchorOffset)
        startContainer.innerText=startContainer.innerText.slice(0,selection.anchorOffset)
      }
      newLine.innerText=tabspace+newLine.innerText
      // Insert the new line after the current line
      startContainer.insertAdjacentElement("afterend", newLine);
      // Focus the new line for editing
      newLine.focus();
      // Move the cursor to the start of the new line
      range = document.createRange();
      
      range.setStart(newLine.firstChild, tabspaces);
      range.setEnd(newLine.firstChild, tabspaces);
      // range.selectNodeContents(newLine);
      // range.collapse(!currentLineText.endsWith("{"));
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      // Update line numbers after adding a new line
      updateLineNumbers();
    }
  } else if (event.key === "Backspace") {
    // Prevent default behavior only if the line should be deleted
    if (
      startContainer.classList.contains("editor_line") &&
      startContainer.contentEditable === "true" &&
      startContainer.textContent.trim() === ""
    ) {
      event.preventDefault(); // Prevent the default backspace behavior
      deleteLine(startContainer); // Call deleteLine with the current line element
    }
  } else if (event.ctrlKey && event.key === "/") {
    event.preventDefault(); // Prevent the default browser behavior

    // Check if the selection spans multiple lines
    if (startContainer !== endContainer) {
      multiLineComment();
    } else {
      singleLineComment(startContainer);
    }
  }
  // Handle Shift+Tab and Tab key events
  else if (event.key === "Tab") {
    event.preventDefault(); // Prevent default browser tabbing behavior

    if (event.shiftKey) {
      // Handle Shift + Tab
      if (startContainer !== endContainer) {
        // Perform multi-line Shift-Tab
        multiLineShiftTab();
      } else {
        // Perform single-line Shift-Tab
        singleLineShiftTab();
      }
    } else {
      // Handle normal Tab (without Shift)
      if (startContainer != endContainer) {
        prependTabToSelectedLines(); //Multi-line tab space append
      } else {
        prependSingleLineTab(startContainer);
      }
    }
  } else {
    if (containsNonEditable(range.commonAncestorContainer, range)) {
      // console.log(event)
      let key = event.key;
      if (
        key == "Control" ||
        key == "Alt" ||
        key == "Shift" ||
        key == "Escape" ||
        key == "Insert" ||
        (key.length > 1 && key[0] == "F") ||
        key.indexOf("Arrow") != -1
      ) {
      } else {
        event.preventDefault(); // Prevent deletion
        alert("You cannot delete non-editable lines!");
      }
    }
    else if (!selection || selection.rangeCount === 0 || selection.toString() === "") {
      if (autoPrompt(startContainer, event.key)) {
        event.preventDefault();
      }
    }
  }
});
function updateLineNumbers() {
  const lines = document.querySelectorAll(".editor_line");
  lineNumbersContainer.innerHTML = ""; // Clear existing line numbers
  let max_width = 0;
  lines.forEach((line, index) => {
    const lineNumber = document.createElement("div");
    lineNumber.textContent = index + 1; // Line number starts from 1
    max_width = Math.max(max_width, (index + 1 + "").length);
    lineNumber.style.position = "absolute";
    lineNumber.style.top =
      line.offsetTop - document.querySelector("#Cin").scrollTop + "px";
    lineNumbersContainer.appendChild(lineNumber);
  });
  lineNumbersContainer.style.width = 16 + 12 * max_width + "px";
}

function deleteLine(lineElement) {
  if (!lineElement || lineElement.classList.contains("editor_line") === false) {
    return;
  }

  let editor = document.getElementById("Cin");
  if (
    lineElement.contentEditable === "true" &&
    lineElement.textContent.trim() === ""
  ) {
    editor.removeChild(lineElement);
    updateLineNumbers();
  } else {
    alert("Cannot delete non-empty or non-editable lines!");
  }
}

function pasteLine(e) {
  // console.log(e);
  let text = (e.clipboardData || window.clipboardData).getData("text/plain");
  if (text.indexOf("\n") == -1) {
    // debugger
    // let t=(e.clipboardData || window.clipboardData)
    // if(t.types.length!=1){
    //   t.clearData();
    //   t.setData('text/plain',text);
    // }
    // console.log(t.types)
    // console.log(e.clipboardData)
    setTimeout(() => {
      const plainText = e.target.innerText;
      e.target.textContent = plainText;
    }, 0);
  } else {
    e.preventDefault();
    let splits = text.split("\n");
    let last = e.target;
    let selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0); // Get the selection range
    let startContainer = range.startContainer;
    let endContainer = range.endContainer;

    // Normalize to parent element if necessary
    if (startContainer.nodeType === Node.TEXT_NODE) {
      startContainer = startContainer.parentNode;
    }
    if (endContainer.nodeType === Node.TEXT_NODE) {
      endContainer = endContainer.parentNode;
    }
    for (let i = 0; i < splits.length; i++) {
      if (startContainer.classList.contains("editor_line")) {
        let newLine = createEditorLine(splits[i] || " "); // Create a new empty editable line

        // Insert the new line after the current line
        last.insertAdjacentElement("afterend", newLine);

        // Focus the new line for editing
        newLine.focus();
        last = newLine;
        // Move the cursor to the start of the new line
      }
    }
    range = document.createRange();
    range.selectNodeContents(last);
    range.collapse(true); // Position cursor at the start of the line
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    updateLineNumbers();
  }
  return 34;
}

function autoPrompt(lineElem, character) {
  let text = lineElem.innerText
  let tokens = lineLexer(text);
  if (tokens.length == 1) {
    let tabspaces = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] == " ") {
        tabspaces += 0.25
      }
      else if (text[i] == '\t') {
        tabspaces = Math.ceil(tabspaces + 0.1);
        // if(Math.ceil(tabspaces)!=tabspaces){
        //   tabspaces=Math.ceil(tabspaces);
        // }
        // else{
        //   tabspaces++;
        // }
      }
      else {
        break;
      }
    }
    tabspaces = Math.ceil(tabspaces);
    let tabspace = ""
    for (let i = tabspaces; i > 0; i--) {
      tabspace += '\t';
    }
    if (tokens[0] == "if" && character == '(') {
      let line1 = tabspace + 'if ( ){';
      let line2 = tabspace + '\t';
      let line3 = tabspace + '}'
      lineElem.innerText = line1;
      let l2 = createEditorLine(line2), l3 = createEditorLine(line3);
      lineElem.insertAdjacentElement("afterend", l2);
      l2.insertAdjacentElement("afterend", l3);

      let range = document.createRange();
      range.setStart(lineElem.firstChild, line1.length - 3);
      range.setEnd(lineElem.firstChild, line1.length - 3);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      lineElem.focus();
      return true;
    }
    else if (tokens[0] == "for" && character == '(') {
      let line1 = tabspace + 'for ( ; ; ){';
      let line2 = tabspace + '\t';
      let line3 = tabspace + '}'
      lineElem.innerText = line1;
      let l2 = createEditorLine(line2), l3 = createEditorLine(line3);
      lineElem.insertAdjacentElement("afterend", l2);
      l2.insertAdjacentElement("afterend", l3);

      let range = document.createRange();
      range.setStart(lineElem.firstChild, line1.length - 7);
      range.setEnd(lineElem.firstChild, line1.length - 7);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      lineElem.focus();
      return true;
    }
    else if (tokens[0] == "while" && character == '(') {
      let line1 = tabspace + 'while ( ){';
      let line2 = tabspace + '\t';
      let line3 = tabspace + '}'
      lineElem.innerText = line1;
      let l2 = createEditorLine(line2), l3 = createEditorLine(line3);
      lineElem.insertAdjacentElement("afterend", l2);
      l2.insertAdjacentElement("afterend", l3);

      let range = document.createRange();
      range.setStart(lineElem.firstChild, line1.length - 3);
      range.setEnd(lineElem.firstChild, line1.length - 3);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      lineElem.focus();
      return true;
    }
    else if (tokens[0] == "do" && character == '{') {
      let line1 = tabspace + 'do{';
      let line2 = tabspace + '\t';
      let line3 = tabspace + '}while( );'
      lineElem.innerText = line1;
      let l2 = createEditorLine(line2), l3 = createEditorLine(line3);
      lineElem.insertAdjacentElement("afterend", l2);
      l2.insertAdjacentElement("afterend", l3);

      let range = document.createRange();
      range.setStart(l3.firstChild, line3.length - 3);
      range.setEnd(l3.firstChild, line3.length - 3);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      l3.focus();
      return true;
    }
    else if (tokens[0] == "else" && character == '{') {
      let line1 = tabspace + 'else{';
      let line2 = tabspace + '\t';
      let line3 = tabspace + '}'
      lineElem.innerText = line1;
      let l2 = createEditorLine(line2), l3 = createEditorLine(line3);
      lineElem.insertAdjacentElement("afterend", l2);
      l2.insertAdjacentElement("afterend", l3);

      let range = document.createRange();
      range.setStart(l2.firstChild, line2.length - 1);
      range.setEnd(l2.firstChild, line2.length - 1);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      l3.focus();
      return true;
    }
    else {
      return false;
      //for functions
    }
  }
}

updateLineNumbers();
document
  .querySelector("#Cin")
  .addEventListener("scroll", updateLineNumbers, false);
document.querySelector("#Cin").addEventListener("paste", pasteLine, false);
