async function interpret(text,cur_scope=1) {
    let lines = text.split("\n")
    datatypeExp = "((" + DataTypes[0] + ")"
    for (let i = 1; i < DataTypes.length; i++) {
        datatypeExp += "|(" + DataTypes[i] + ")"
    }
    datatypeExp += ")"
    const variableExp = "[a-zA-Z_][a-zA-Z0-9_]*"

    // datatypeExp="d"
    // variableExp="v"

    regex_of_function = new RegExp("^\\s*" + datatypeExp + " +" + variableExp + "\\(( *(" + datatypeExp + " +" + variableExp + " *, *)*( *" + datatypeExp + " +" + variableExp + ") *)?" + "\\)\\{ *$")
    regex_var_decl = new RegExp("^\\s*" + datatypeExp + " +(" + variableExp + " *(=[\\S\\s]+)? *, *)*" + variableExp + "(=[\\S\\s]+)?;")
    const regex_assign = new RegExp("^\\s*" + variableExp + " *=[\\S\\s]+;")
    const regex_return = new RegExp("^\\s*return *( [\\S\\s]*)?;")
    let function_start_pointer = 0
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim()
        if (line === "int main(){") {
            function_start_pointer = i + 1
            break
        }
    }
    scope = cur_scope
    for (let i = function_start_pointer; i < lines.length - 2; i++) {
        await sleep();
        let line = lines[i].trim()
        if (regex_var_decl.test(line)) {
            let type_data = line.match(datatypeExp)
            let var_names = line.slice(type_data['index'] + type_data[0].length, -1).split(",")
            console.log(var_names)
            for (let j = 0; j < var_names.length; j++) {
                // varnames[j].match(variableExp)
                let var_name = var_names[j].split("=")[0].trim()
                let var_data = 0
                if (var_names[j].split("=")[1]) {
                    var_data = var_names[j].split("=")[1]
                    if (type_data[0] == "int") {
                        if (var_data.match(/^(-)?[0-9]+$/)) {
                            var_data = parseInt(var_data)
                        }
                        else {
                            CrashNotif({ "error word": "int mismatch" })
                            return
                        }
                    }
                    else if (type_data[0] == "float") {
                        if (var_data.match(/^(-)?[0-9]+(.[0-9]+)?$/)) {
                            var_data = parseFloat(var_data)
                        }
                        else {
                            CrashNotif({ "error word": "float mismatch" })
                            return
                        }
                    }
                    else if (type_data[0] == "char") {
                        if (var_data.match(/^'\S'$/)) {
                            var_data = var_data[1]
                        }
                        else {
                            CrashNotif({ "error word": "char mismatch" })
                            return
                        }

                    } else {
                        console.log(type_data[0])
                        console.log("Can only initialize int,float or char variables during declaration")
                        return;
                    }
                }
                else if (type_data != "int" && type_data != "float") {
                    if (type_data == 'char') {
                        var_data = '\0'
                    }
                    else {
                        var_data = NULL
                    }
                }
                for (let k = 0; k < Variables.length; k++) {
                    if (Variables[k]['name'] == var_name && (Variables[k]['scope'] == scope || Variables[k]['scope'] == 0)) {
                        CrashNotif({ "error word": "Variable of same name already exists" })
                        return
                        //crashed
                    }
                }

                console.log("made var")
                Variables.push({ 'addr': 0, 'name': var_name, 'value': var_data, 'type': type_data[0], 'scope': scope, 'div': makeNode(0, var_name + ":" + var_data) })
            }
        }
        else if (regex_assign.test(line)) {
            let var_name = line.split("=")[0]
            let var_data = line.split("=")[1].slice(0, -1)
            let match = undefined
            for (let j = 0; j < Variables.length; j++) {
                if (Variables[j]['name'] == var_name && (Variables[j]['scope'] == scope || Variables[j][scope] == 0))//scope 0=malloced values
                {
                    match = j
                    break
                }
            }
            if (match === undefined) {
                CrashNotif({ "error word": "No such Variable" })
                return;
                //crashed program
            }
            else {
                let type_data = Variables[match]['type']
                let temp = evaluate(var_data)
                if (type_data == temp['type']) {
                    Variables[match]['value'] = temp['value']
                    Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']
                }
                else if (type_data == "int") {
                    // Variables[match]['value'] = TypeCastInt(temp['value'])
                    Variables[match]['value'] = TypeCastInt(temp)
                    if (Variables[match]['value'] === undefined) {
                        return
                    }
                    Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']
                }
                else if (type_data == "float") {
                    // Variables[match]['value'] = TypeCastFloat(temp['value'])
                    Variables[match]['value'] = TypeCastFloat(temp)
                    if (Variables[match]['value'] === undefined) {
                        return
                    }
                    Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']

                }
                else if (type_data == "char") {
                    // Variables[match]['value'] = TypeCastChar(temp['value'])
                    Variables[match]['value'] = TypeCastChar(temp)
                    if (Variables[match]['value'] === undefined) {
                        return
                    }
                    Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']

                } else {
                    CrashNotif({ "error word": "Type mismatch" })
                    return undefined
                }
            }

        }
    }
    // console.log(lines)
}
function evaluate(expression) {
    let result = undefined
    /*
        parse mode values
        0=Not Started reading value
        1=reading integer/float
        2=reading float
        4=reading a character   //obsolete
        5=reading a string      //obsolete
        6=reading either a variable or function
        7=reading a variable
        8=reading a function's parameters
        9=read identifier, checking if it is a function
        10= finished reading an element 
    */
    let parse_mode = 0;
    let temp = undefined
    let operator = undefined
    let negativeFlag = false
    let postfix_stack = []
    let operation_stack = ['#']
    let F = function (s) {
        switch (s) {
            case '+':
            case '-': return 2;
            case '*':
            case '%':
            case '/': return 4;
            // case '$':
            // case '^': return 5;
            case '#': return -1;
            case '(': return 0;
            default: return 8;
        }
    }
    let G = function (s) {
        switch (s) {
            case '+':
            case '-': return 1;
            case '*':
            case '%':
            case '/': return 3;
            // case '$':
            // case '^': return 6;
            case ')': return 0;
            case '(': return 9;
            default: return 7;
        }
    }
    let conv = function (elem) {
        debugger;
        while (F(operation_stack.slice(-1)[0]) > G(elem)) {
            console.log(F(operation_stack.slice(-1)[0]))
            console.log(G(elem))
            let temp3 = operation_stack.pop()
            let op1 = undefined, op2 = undefined, temp_res = { 'value': 0, 'type': "float" }
            switch (temp3) {
                case '+':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    // temp_res['value'] = TypeCastFloat(op1['value']) + TypeCastFloat(op2['value'])
                    temp_res['value'] = TypeCastFloat(op1) + TypeCastFloat(op2)
                    postfix_stack.push(temp_res)
                    break
                case '-':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    // temp_res['value'] = TypeCastFloat(op1['value']) - TypeCastFloat(op2['value'])
                    temp_res['value'] = TypeCastFloat(op1) - TypeCastFloat(op2)
                    postfix_stack.push(temp_res)
                    break
                case '*':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    // temp_res['value'] = TypeCastFloat(op1['value']) * TypeCastFloat(op2['value'])
                    temp_res['value'] = TypeCastFloat(op1) * TypeCastFloat(op2)
                    postfix_stack.push(temp_res)
                    break
                case '/':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    // temp_res['value'] = TypeCastFloat(op1['value']) / TypeCastFloat(op2['value'])
                    temp_res['value'] = TypeCastFloat(op1) / TypeCastFloat(op2)
                    postfix_stack.push(temp_res)
                    break
                case '%':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    // temp_res['value'] = TypeCastFloat(op1['value']) % TypeCastFloat(op2['value'])
                    temp_res['value'] = TypeCastFloat(op1) % TypeCastFloat(op2)
                    postfix_stack.push(temp_res)
                    break
                default:
                    postfix_stack.push(temp3)
                    // console.log(postfix_stack)
            }
        }
        if (F(operation_stack.slice(-1)[0]) != G(elem)) {
            operation_stack.push(elem);
        }
        else {
            operation_stack.pop()
        }
    }
    let exp_end = function () {
        while (operation_stack.length > 1) {
            let temp3 = operation_stack.pop()
            let op1 = undefined, op2 = undefined, temp_res = { 'value': 0, 'type': "float" }
            switch (temp3) {
                case '+':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    temp_res['value'] = op1['value'] + op2['value']
                    postfix_stack.push(temp_res)
                    break
                case '-':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    temp_res['value'] = op1['value'] - op2['value']
                    postfix_stack.push(temp_res)
                    break
                case '*':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    temp_res['value'] = op1['value'] * op2['value']
                    postfix_stack.push(temp_res)
                    break
                case '/':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    temp_res['value'] = op1['value'] / op2['value']
                    postfix_stack.push(temp_res)
                    break
                case '%':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    temp_res['value'] = op1['value'] % op2['value']
                    postfix_stack.push(temp_res)
                    break
                default:
                    postfix_stack.push(temp3)
            }
        }
        // console.log(Pf)
    }
    for (let i = 0; i <= expression.length; i++) {
        let c = expression[i]
        if(i==expression.length){
            c=" "
            // i--
        }
        debugger;
        switch (parse_mode) {
            case 0:
                if (c == '-') {
                    if (postfix_stack.length == 1) {
                        negativeFlag = true
                    }
                    else if (operator === undefined) {
                        operator = '-'
                        negativeFlag = false
                        parse_mode=10
                    }
                    else {
                        negativeFlag = true
                    }
                }
                else if (c == '+') {
                    if (operator === undefined) {
                        operator = '+'
                        parse_mode=10
                        // negativeFlag = false
                    }
                }
                else if (c == '*') {
                    if (operator === undefined) {
                        operator = '*'
                        parse_mode=10
                        // negativeFlag = false
                    }
                }
                else if (c == '/') {
                    if (operator === undefined) {
                        operator = '/'
                        parse_mode=10
                        // negativeFlag = false
                    }
                }
                else if (c == '%') {
                    if (operator === undefined) {
                        operator = '%'
                        parse_mode=10
                        // negativeFlag = false
                    }
                }
                else if(c==')' || c=='('){
                    conv(c)
                }
                else if (/^[0-9]$/.test(c)) {
                    parse_mode = 1
                    temp = c+""
                    // if (negativeFlag) {
                    //     temp = -c
                    // }
                }
                else if (/^[_a-zA-Z]$/.test(c)) {
                    temp = c
                    parse_mode = 6
                }
                else if (c == '\'') {

                    if (expression[i + 1] == '\\') {
                        if (expression[i + 2] == "n") {
                            temp = { 'value': "\n", 'type': "char" }
                        }
                        else if (expression[i + 2] == "t") {
                            temp = { 'value': "\t", 'type': "char" }
                        }
                        else if (expression[i + 2] == "0") {
                            temp = { 'value': "\0", 'type': "char" }
                        }
                        else {
                            CrashNotif({ "error word": "unsupported escape sequence" })
                            return
                        }
                        i += 3
                    }
                    else {
                        temp = { 'value': expression[i + 1], "type": "char" }
                        i += 2
                    }
                    parse_mode = 10
                }
                // else if (c=='\"'){
                //     for(let j=i+1;;j++){
                //         if (expression[j]=='\\'){
                //             j++
                //         }
                //         else if (expression[j]!="\""){
                //             temp={'value':0,"type":string}
                //         }
                //     }
                // }
                
                else if(/^[ \t]$/.test(c)){
                    continue
                }
                else {
                    CrashNotif({ "error word": "invalid element starting character for expression parsing" })
                    return;
                }
                break;
            case 1:
                if(/^[0-9]$/.test(c)){
                    temp=temp+""+c
                }
                else if(c=='.'){
                    parse_mode=2
                    temp=temp+"."
                }
                else{
                    i--;
                    temp={'value':Number(temp),'type':'float'}
                    parse_mode=10
                }
                break;
            case 2:
                if(/^[0-9]$/.test(c)){
                    temp=temp+""+c
                }
                else{
                    i--
                    temp={'value':Number(temp),'type':'float'}
                    parse_mode=10
                }
                break;
            case 3://obsolete
                
                break;
            case 4://obsolete

                break;
            case 5://obsolete

                break;
            case 6://variable or function
                if (/^[_0-9a-zA-Z]$/.test(c)) {
                    temp = temp+""+c
                    parse_mode = 6
                }
                else if(/^[ \t]$/.test(c)){
                    i--
                    parse_mode=9
                    break;
                }
                else if(c=="("){
                    parse_mode=8
                }
                else{
                    i--
                    parse_mode=7
                }
                break;
            case 7:// variable
                for(let j=0;j<Variables.length;j++){
                    if (temp==Variables[j]['name'] && scope==Variables[j]["scope"]){
                        temp={"value":Variables[j]['value'],'type':Variables[j]['type']}
                        
                        break;
                    }
                }
                if (temp['value']===undefined){
                    CrashNotif({'error word':'Variable not Found'})
                    return
                }
                i--
                parse_mode=10
                break;
            case 8:// function parameter

                break;
            case 9://check if identifier is a function
                if(/^[ \t]$/.test(c) && i!=expression.length){
                    break;
                }
                else if(c=="("){
                    parse_mode=8
                }
                else{
                    i--
                    parse_mode=7
                }
                break;
            case 10:// finished reading
                debugger;
                console.log(temp)
                if (operator===undefined && temp!==undefined){
                    if (negativeFlag){
                        temp['value']=-temp['value']
                    }
                    negativeFlag=false
                    debugger;
                    conv(temp)
                    temp=undefined
                }
                else if (temp===undefined){
                    conv(operator)
                    operator=undefined
                }
                debugger
                parse_mode=0;
                i--;
                break
            default:
                break;
        }
    }
    console.log(postfix_stack)
    exp_end()
    result=postfix_stack[0]
    return result
}
function getWord(line,StartIndex){
    let readmode=0
    let Wordstart=StartIndex,Wordend=StartIndex
    for(let i=StartIndex;i<line.length;i++){
        if(readmode==0){
            if(/^[ \t]$/.test(line[i])){
                Wordstart++
                continue
            }
            else if(/^[a-zA-Z_]$/.test(line[i])){
                readmode=1
            }
        }
        else if(readmode==1){
            if(/^[0-9a-zA-Z_]$/.test(line[i])){
                Wordend=i
            }
            else{
                readmode=2
                Wordend=i
                break;
            }
        }
    }
    if (readmode==2){
        return line.slice(Wordstart,Wordend)
    }
    else if(readmode==1){
        Wordend++
        return line.slice(Wordstart,Wordend)
    }
    else{
        return undefined
    }
}
function CrashNotif(extra_detail) {
    console.log("crashed")
    console.log(extra_detail['error word'])
}
function TypeCastInt(value) {
    if (value['type'] == "float") {
        if (value['value'] >= 0)
            return Math.floor(value['value'])
        else
            return Math.ceil(value['value'])
    }
    else if (value['type'] == "int") {
        return value['value']
    }
    else if (value['type'] == "char") {
        return value['value'].charCodeAt();
    }
    else {
        CrashNotif({ "error word": "int mismatch" })
        return undefined
    }
}
function TypeCastFloat(value) {
    if (value['type'] == "float") {
        return value['value']
    }
    else if (value['type'] == "int") {
        return value['value']
    }
    else if (value['type'] == "char") {
        return value['value'].charCodeAt();
    }
    else {
        CrashNotif({ "error word": "float mismatch" })
        return undefined
    }
}
function TypeCastChar(value) {
    if (value['type'] == "float") {
        // return String.fromCharCode(TypeCastInt(value['value']) % 256)
        return String.fromCharCode(TypeCastInt(value) % 256)
    }
    else if (value['type'] == "int") {
        return String.fromCharCode((value['value']) % 256)
    }
    else if (value['type'] == "char") {
        return value['value'];
    }
    else {
        CrashNotif({ "error word": "char mismatch" })
        return undefined
    }
}
function regexQuote(s) { return s.replace(/[\[\]^$*+?{}.|\\]/g, "\\$&") }
function compile() {
    let nodes = document.getElementsByClassName("Node")
    for (let i = nodes.length - 1; i >= 0; i--) {
        nodes[i].parentElement.removeChild(nodes[i])
    }
    Variables = []
    let Cin = document.getElementById("Cin")
    let val = Cin.value
    // console.log(val)
    // main_function_outline=/^int main\(\){\n.*\treturn 0;\n}$/
    // main_function_outline=/^int main\(\){(.|\n)*\treturn 0;\n}$/
    // main_function_outline=/(int|(.|\n)*\nint) main\(\){(.|\n)*\treturn 0;\n}$/
    main_function_outline = /^(.*\n)*int main\(\){(.|\n)*\treturn 0;\n}$/
    if (main_function_outline.test(val)) {
        Cin_text = val
        // console.log(check_syntax(val))
        interpret(val)
    }
    else {
        Cin.value = Cin_text
    }
    // let output=document.getElementById("Cout")
    // output.innerHTML=val
}
function check_syntax(text) { // balanced bracket checks only
    brackets_stack = []
    for (let i = 0; i < text.length; i++) {
        if (text[i] == "{" || text[i] == "(" || text[i] == '[') {
            brackets_stack.push(text[i])
        }
        else if (text[i] == "\"") {
            brackets_stack.push("\"")
            i++;
            while (i < text.length) {
                if (text[i] != '\"') {
                    brackets_stack.pop()
                    break
                }
                else if (text[i] == '\\') {
                    i++
                }
                i++
            }
            if (brackets_stack[brackets_stack.length - 1] == "\"") {
                return false
            }
        }
        else if (text[i] == '\'') {
            if (text[i + 2]) {
                if (text[i + 2] == "\'") {
                    i += 2
                }
                else if (text[i + 1] == '\\' && text[i + 3] == '\'') {
                    i += 3
                }
                else {
                    return false
                }
            }
            else {
                return false
            }
        }
        else if (text[i] == ')') {
            if (brackets_stack[brackets_stack.length - 1] == '(') {
                brackets_stack.pop()
            }
            else {
                return false
            }
        }
        else if (text[i] == '}') {
            if (brackets_stack[brackets_stack.length - 1] == '{') {
                brackets_stack.pop()
            }
            else {
                return false
            }
        }
        else if (text[i] == ']') {
            if (brackets_stack[brackets_stack.length - 1] == '[') {
                brackets_stack.pop()
            }
            else {
                return false
            }
        }
    }

    return brackets_stack.length == 0
}
const stacks_struct = "\nstruct _Stack{\n\tint * arr;\n\tint size,top;\n};\ntypedef struct _Stack * Stack;\n\nStack getStack(int size){\n\tStack x;\n\tx=(Stack)malloc(sizeof(struct _stack));\n\tif(x==NULL){\n\t\t// Memory error\n\t\texit(0);\n\t}\n\tx->top=-1;\n\tx->size=size;\n\tx->arr=(int *)malloc(sizeof(int)*size);\n\treturn x;\n}\n\n"
const queue_struct = ""
const SLL_struct = ""
const DLL_struct = ""
const TreeNode_Struct = ""
var functions = {}
var Cin_text = "int main(){\n\treturn 0;\n}"
var Variables = []
var call_stack = []
var DataTypes = ["int", "float", "char"]
var scope=0
const NULL = 0
var sleepTime=3000
function handleKey(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        this.focus();
        // console.log(typeof(this.value))
        tab_index = this.selectionStart
        this.value = this.value.slice(0, tab_index) + '\t' + this.value.slice(tab_index)
        this.selectionStart = tab_index + 1
        this.selectionEnd = tab_index + 1
    }
    main_function_outline = /^(.*\n)*int main\(\){(.|\n)*\treturn 0;\n}$/
    sel_index = this.selectionStart
    setTimeout(() => {
        if (!main_function_outline.test(this.value)) {
            // e.preventDefault();
            this.value = Cin_text
            this.selectionStart = sel_index
            this.selectionEnd = sel_index
            // return false
        }
        else {
            Cin_text = this.value
        }
    }, 0)
}
const sleep = function(ms){
    if (ms===undefined){
        ms=sleepTime
    }
    return new Promise(r => setTimeout(r, ms));
}
setTimeout(() => {
    // document.getElementById("Cin").value=stacks_struct+document.getElementById("Cin").value;
    document.getElementById("Cin").addEventListener('keydown', handleKey, true);
}, 100);


