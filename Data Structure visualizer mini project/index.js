async function interpret(function_start_pointer, scope = 1) {
    let datatypeExp = "((" + DataTypes[0] + ")"
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
    // let function_start_pointer = 0
    // for (let i = 0; i < Program.length; i++) {
    //     let line = Program[i].trim()
    //     if (line === "int main(){") {
    //         function_start_pointer = i + 1
    //         break
    //     }
    // }
    // scope = cur_scope
    for (let i = function_start_pointer; i < Program.length - 1; i++) {
        let line = Program[i].trim()
        if (line === "") {
            continue;
        }
        await sleep();
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
                // version 1
                // for (let k = 0; k < Variables.length; k++) {
                //     if (Variables[k]['name'] == var_name && (Variables[k]['scope'] == scope || Variables[k]['scope'] == 0)) {
                //         CrashNotif({ "error word": "Variable of same name already exists" })
                //         return
                //         //crashed
                //     }
                // }
                
                // version 2
                if(getVariableIndex(var_name,scope)!==undefined){
                    CrashNotif({ "error word": "Variable of same name already exists" })
                    return
                    //crashed
                }
                console.log("made var")
                Variables.push({ 'addr': 0, 'name': var_name, 'value': var_data, 'type': type_data[0], 'scope': scope, 'div': makeNode(0, var_name + ":" + var_data) })
            }
        }
        else if (regex_assign.test(line)) {
            let var_name = line.split("=")[0]
            let var_data = line.slice(var_name.length + 1, -1)
            var_name = var_name.trim()
            //verision 1
            // let match = undefined
            // for (let j = 0; j < Variables.length; j++) {
            //     if (Variables[j]['name'] == var_name && (Variables[j]['scope'] == scope || Variables[j]['scope'] == 0))//scope 0=malloced values
            //     {
            //         match = j
            //         break
            //     }
            // }
            let match=getVariableIndex(var_name,scope)
            if (match === undefined) {
                CrashNotif({ "error word": "No such Variable" })
                return;
                //crashed program
            }
            else {
                let type_data = Variables[match]['type']
                let temp = evaluate(var_data, scope)
                if (type_data == temp['type']) {
                    Variables[match]['value'] = temp['value']
                    //render element
                    Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']
                }
                else if (type_data == "int") {
                    // Variables[match]['value'] = TypeCastInt(temp['value'])
                    Variables[match]['value'] = TypeCastInt(temp)
                    if (Variables[match]['value'] === undefined) {
                        return
                    }
                    //render element
                    Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']
                }
                else if (type_data == "float") {
                    // Variables[match]['value'] = TypeCastFloat(temp['value'])
                    Variables[match]['value'] = TypeCastFloat(temp)
                    if (Variables[match]['value'] === undefined) {
                        return
                    }
                    //render element
                    Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']

                }
                else if (type_data == "char") {
                    // Variables[match]['value'] = TypeCastChar(temp['value'])
                    Variables[match]['value'] = TypeCastChar(temp)
                    if (Variables[match]['value'] === undefined) {
                        return
                    }
                    //render element
                    Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']

                } else {
                    CrashNotif({ "error word": "Type mismatch" })
                    return undefined
                }
            }

        }
        else if (regex_of_function.test(line)) {

        }
        else {
            // console.log(line)
            let word = getWord(line, 0)
            console.log(word)
            if (word === undefined) {
                debugger
                if(line.trim()=='}'){
                    let temp=Branch_stack[Branch_stack.length-1]
                    if(temp['keyword']=='if' && temp['inner_scope']==scope){
                        scope-=1
                        i=temp['end']-1
                        Branch_stack.pop()
                    }
                }
            } else if (word['word'] == "if") {
                console.log("if condition detected")
                //get expression in if
                if(/^\s*if\s*\(.*\)\s*\{\s*$/.test(line)){
                    console.log("valid if")
                }
                let exp = line.slice(word['end']).split('{', 1)[0]
                // console.log(exp)
                let pass=evaluate(exp,scope)
                console.log(pass)
                let if_code=getContainer(i,Program[i].indexOf("{"))
                console.log(if_code)
                let if_ladder={"keyword":"if","else":undefined,"end":if_code["end"][0]+1,"inner_scope":scope+1}
                if (Program[if_ladder["end"]].includes("else")){
                    let j=if_ladder["end"]
                    if_ladder["else"]=j
                    while(Program[j].includes("else if")){
                        let elif_code=getContainer(j,Program[j].indexOf("{"))
                        j=elif_code["end"][0]+1
                    }
                    if(Program[j].includes("else")){
                        let else_code=getContainer(j,Program[j].indexOf("{"))
                        if_ladder["end"]=else_code["end"][0]+1
                    }
                }
                Branch_stack.push(if_ladder)
                if (pass['value']==0){ //did not enter if condition
                    console.log("failed")
                    if(if_ladder["else"]===undefined){
                        i=if_ladder["end"]-1
                        Branch_stack.pop()
                    }
                    else{
                        i=if_ladder["else"]-1
                    }
                }
                else{//entered if condition
                    scope+=1
                    console.log("passed")
                }
                
            } else if (word['word'] == "else"){
                let temp=Branch_stack[Branch_stack.length-1]
                if (temp===undefined){
                    CrashNotif({"error word":"No if condition detected"})
                    return
                }
                
                if (temp["keyword"]!="if"){
                    CrashNotif({"error word":"No if condition detected"})
                    return
                }

                if(temp["inner_scope"]==scope+1){
                    if (Program[i].includes("if")){
                        let code=getContainer(i,Program[i].indexOf("{"))
                        temp['else']=undefined
                        if (Program[code['end'][0]+1].includes("else")){
                            temp['else']=code['end'][0]+1
                        }
                        let exp=Program[i].slice(Program[i].indexOf('('),code['start'][1])
                        // console.log(exp)
                        let pass=evaluate(exp,scope)
                        console.log(pass)
                        if (pass['value']==0){ //did not enter if condition
                            console.log("failed")
                            if(temp["else"]===undefined){
                                i=temp["end"]-1
                                Branch_stack.pop()
                            }
                            else{
                                i=temp["else"]-1
                            }
                        }
                        else{//entered if condition
                            scope+=1
                            console.log("passed")
                        }
                        
                    }
                    else{
                        temp['else']=undefined
                        scope+=1
                    }
                }
                else{
                    CrashNotif({"error word":"No if condition deteted"})
                    return
                }
                
            }
            else{
                debugger;
            }
        }
    }
    // console.log(Program)
}
function evaluate(expression, scope) {
    let result = undefined
    /*
        parse mode values
        0=Not Started reading value
        1=reading integer/float
        2=reading float
        3=reading 2-character operators
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
            case '||': return 2;
            case '&&': return 4;
            case '==':
            case '!=': return 6;
            case '>':
            case '<':
            case '>=':
            case '<=': return 8;
            case '+':
            case '-': return 10;
            case '*':
            case '%':
            case '/': return 12;
            case '!': return 14;
            case '#': return -1;
            case '[':
            case '(': return 0;
            default: return 16;
        }
    }
    let G = function (s) {
        switch (s) {
            case '||': return 1;
            case '&&': return 3;
            case '==':
            case '!=': return 5;
            case '>':
            case '<':
            case '>=':
            case '<=': return 7;
            case '+':
            case '-': return 9;
            case '*':
            case '%':
            case '/': return 11;
            case '!': return 13;
            case ']':
            case ')': return 0;
            case '[':
            case '(': return 17;
            default: return 15;
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
                    if (op1 === undefined) {
                        temp_res['value'] = TypeCastFloat(op2)
                    }
                    else if (typeof (op1) == 'object') {
                        temp_res['value'] = TypeCastFloat(op1) + TypeCastFloat(op2)
                    } else {
                        postfix_stack.push(op1)
                        temp_res['value'] = TypeCastFloat(op2)
                    }
                    postfix_stack.push(temp_res)
                    break
                case '-':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1 === undefined) {
                        temp_res['value'] = - TypeCastFloat(op2)
                    }
                    else if (typeof (op1) == 'object') {
                        temp_res['value'] = TypeCastFloat(op1) - TypeCastFloat(op2)
                    } else {
                        postfix_stack.push(op1)
                        temp_res['value'] = - TypeCastFloat(op2)
                    }
                    postfix_stack.push(temp_res)
                    break
                case '*':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    temp_res['value'] = TypeCastFloat(op1) * TypeCastFloat(op2)
                    postfix_stack.push(temp_res)
                    break
                case '/':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    temp_res['value'] = TypeCastFloat(op1) / TypeCastFloat(op2)
                    postfix_stack.push(temp_res)
                    break
                case '%':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    temp_res['value'] = TypeCastFloat(op1) % TypeCastFloat(op2)
                    postfix_stack.push(temp_res)
                    break
                case '||':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] != 0 || op2['value'] != 0) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '&&':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] != 0 && op2['value'] != 0) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '==':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] == op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '!=':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] != op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '>':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] > op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '<':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] < op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '>=':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] >= op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '<=':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] <= op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '!':
                    op1 = postfix_stack.pop()
                    if (op1['value'] == 0) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
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
        debugger
        while (operation_stack.length > 1) {
            let temp3 = operation_stack.pop()
            let op1 = undefined, op2 = undefined, temp_res = { 'value': 0, 'type': "float" }
            switch (temp3) {
                case '+':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1 === undefined) {
                        temp_res['value'] = TypeCastFloat(op2)
                    }
                    else if (typeof (op1) == 'object') {
                        temp_res['value'] = TypeCastFloat(op1) + TypeCastFloat(op2)
                    } else {
                        postfix_stack.push(op1)
                        temp_res['value'] = TypeCastFloat(op2)
                    }
                    postfix_stack.push(temp_res)
                    break
                case '-':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1 === undefined) {
                        temp_res['value'] = - TypeCastFloat(op2)
                    }
                    else if (typeof (op1) == 'object') {
                        temp_res['value'] = TypeCastFloat(op1) - TypeCastFloat(op2)
                    } else {
                        postfix_stack.push(op1)
                        temp_res['value'] = - TypeCastFloat(op2)
                    }
                    postfix_stack.push(temp_res)
                    break
                case '*':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    temp_res['value'] = TypeCastFloat(op1) * TypeCastFloat(op2)
                    postfix_stack.push(temp_res)
                    break
                case '/':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    temp_res['value'] = TypeCastFloat(op1) / TypeCastFloat(op2)
                    postfix_stack.push(temp_res)
                    break
                case '%':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    temp_res['value'] = TypeCastFloat(op1) % TypeCastFloat(op2)
                    postfix_stack.push(temp_res)
                    break
                case '||':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] != 0 || op2['value'] != 0) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '&&':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] != 0 && op2['value'] != 0) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '==':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] == op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '!=':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] != op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '>':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] > op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '<':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] < op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '>=':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] >= op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '<=':
                    op2 = postfix_stack.pop()
                    op1 = postfix_stack.pop()
                    if (op1['value'] <= op2['value']) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                case '!':
                    op1 = postfix_stack.pop()
                    if (op1['value'] == 0) {
                        temp_res['value'] = 1
                    }
                    else {
                        temp_res['value'] = 0
                    }
                    postfix_stack.push(temp_res)
                    break;
                default:
                    postfix_stack.push(temp3)
            }
        }
        // console.log(Pf)
    }
    for (let i = 0; i <= expression.length; i++) {
        let c = expression[i]
        if (i == expression.length) {
            c = " "
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
                        parse_mode = 10
                    }
                    else {
                        negativeFlag = true
                    }
                }
                else if (c == '+') {
                    if (operator === undefined) {
                        operator = '+'
                        parse_mode = 10
                        // negativeFlag = false
                    }
                }
                else if (c == '*') {
                    if (operator === undefined) {
                        operator = '*'
                        parse_mode = 10
                        // negativeFlag = false
                    }
                }
                else if (c == '/') {
                    if (operator === undefined) {
                        operator = '/'
                        parse_mode = 10
                        // negativeFlag = false
                    }
                }
                else if (c == '%') {
                    if (operator === undefined) {
                        operator = '%'
                        parse_mode = 10
                    }
                }
                else if (c == '>') {
                    if (operator === undefined) {
                        operator = c
                        parse_mode = 3
                    }
                }
                else if (c == '<') {
                    if (operator === undefined) {
                        operator = c
                        parse_mode = 3
                    }
                }
                else if (c == '|') {
                    if (operator === undefined) {
                        operator = c
                        parse_mode = 3
                    }
                }
                else if (c == '&') {
                    if (operator === undefined) {
                        operator = c
                        parse_mode = 3
                    }
                }
                else if (c == '=') {
                    if (operator === undefined) {
                        operator = c
                        parse_mode = 3
                    }
                }
                else if (c == '!') {
                    if (operator === undefined) {
                        operator = c
                        parse_mode = 3
                    }
                }
                else if (c == ')' || c == '(') {
                    conv(c)
                }
                else if (/^[0-9]$/.test(c)) {
                    parse_mode = 1
                    temp = c + ""
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

                else if (/^[ \t]$/.test(c)) {
                    continue
                }
                else {
                    CrashNotif({ "error word": "invalid element starting character for expression parsing" })
                    return;
                }
                break;
            case 1:
                if (/^[0-9]$/.test(c)) {
                    temp = temp + "" + c
                }
                else if (c == '.') {
                    parse_mode = 2
                    temp = temp + "."
                }
                else {
                    i--;
                    temp = { 'value': Number(temp), 'type': 'float' }
                    parse_mode = 10
                }
                break;
            case 2:
                if (/^[0-9]$/.test(c)) {
                    temp = temp + "" + c
                }
                else {
                    i--
                    temp = { 'value': Number(temp), 'type': 'float' }
                    parse_mode = 10
                }
                break;
            case 3:// identify operator
                if (operator == '>') {
                    if (c == "=") {
                        operator = '>='
                    }
                    else {
                        i--;
                    }
                }
                else if (operator == '<') {
                    if (c == "=") {
                        operator = '<='
                    }
                    else {
                        i--;
                    }
                }
                else if (operator == '|') {
                    if (c == "|") {
                        operator = '||'
                    }
                    else {
                        CrashNotif({ 'error word': "Bit wise operations not supported" })
                        i--;
                        return
                    }
                }
                else if (operator == '&') {
                    if (c == "&") {
                        operator = '&&'
                    }
                    else {
                        CrashNotif({ 'error word': "Bit wise operations not supported" })
                        i--;
                        return
                    }
                }
                else if (operator == '=') {
                    if (c == "=") {
                        operator = '=='
                    }
                    else {
                        CrashNotif({ 'error word': "inline assignment not supported" })
                        i--;
                        return
                    }
                }
                else if (operator == '!') {
                    if (c == "=") {
                        operator = '!='
                    }
                    else {
                        i--;
                    }
                }
                parse_mode = 10
                break;
            case 4://obsolete

                break;
            case 5://obsolete

                break;
            case 6://variable or function
                if (/^[_0-9a-zA-Z]$/.test(c)) {
                    temp = temp + "" + c
                    parse_mode = 6
                }
                else if (/^[ \t]$/.test(c)) {
                    i--
                    parse_mode = 9
                    break;
                }
                else if (c == "(") {
                    parse_mode = 8
                }
                else {
                    i--
                    parse_mode = 7
                }
                break;
            case 7:// variable
            // version 1
                // for (let j = 0; j < Variables.length; j++) {
                //     if (temp == Variables[j]['name'] && scope == Variables[j]["scope"]) {
                //         temp = { "value": Variables[j]['value'], 'type': Variables[j]['type'] }

                //         break;
                //     }
                // }

                //version 2
                let match=getVariableIndex(temp,scope)
                if(match===undefined) {
                    CrashNotif({ 'error word': 'Variable not Found' })
                    return
                }
                else{
                    temp = { "value": Variables[match]['value'], 'type': Variables[match]['type'] }
                }
                i--
                parse_mode = 10
                break;
            case 8:// function parameter

                break;
            case 9://check if identifier is a function
                if (/^[ \t]$/.test(c) && i != expression.length) {
                    break;
                }
                else if (c == "(") {
                    parse_mode = 8
                }
                else {
                    i--
                    parse_mode = 7
                }
                break;
            case 10:// finished reading
                debugger;
                console.log(temp)
                if (operator === undefined && temp !== undefined) {
                    if (negativeFlag) {
                        temp['value'] = -temp['value']
                    }
                    negativeFlag = false
                    debugger;
                    conv(temp)
                    temp = undefined
                }
                else if (temp === undefined) {
                    conv(operator)
                    operator = undefined
                }
                debugger
                parse_mode = 0;
                i--;
                break
            default:
                break;
        }
    }
    console.log(postfix_stack)
    exp_end()
    result = postfix_stack[0]
    return result
}
function getWord(line, StartIndex) {
    let readmode = 0
    let Wordstart = StartIndex, Wordend = StartIndex
    for (let i = StartIndex; i < line.length; i++) {
        if (readmode == 0) {
            if (/^[ \t]$/.test(line[i])) {
                Wordstart++
                continue
            }
            else if (/^[a-zA-Z_]$/.test(line[i])) {
                readmode = 1
            }
        }
        else if (readmode == 1) {
            if (/^[0-9a-zA-Z_]$/.test(line[i])) {
                Wordend = i
            }
            else {
                readmode = 2
                Wordend = i
                break;
            }
        }
    }
    if (readmode == 2) {
        return { "word": line.slice(Wordstart, Wordend), "end": Wordend }
    }
    else if (readmode == 1) {
        Wordend++
        return { "word": line.slice(Wordstart, Wordend), "end": Wordend }
    }
    else {
        return undefined
    }
}
function getContainer(StartLine, StartIndex) {
    let brackets_stack = []
    let in_string = false
    let line = Program[StartLine]
    for (let j = StartIndex; j < line.length; j++) {
        if (line[j] === '{') {
            if (!in_string) {
                brackets_stack.push([StartLine, j])
            }
        }
        else if (line[j] === '}') {
            if (!in_string) {
                if (brackets_stack.length == 1) {
                    return { 'start': brackets_stack[0], 'end': [StartLine, j] }
                }
                brackets_stack.pop()
            }
        }
        else if (/^\S$/.test(line[j])) {
            if (brackets_stack.length == 0) {
                return undefined
            }
            else if (in_string === true && line[j] == "\\") {
                j++
            }
            else if (line[j] == '"') {
                in_string = !in_string
            }
        }
    }
    for (let i = StartLine + 1; i < Program.length; i++) {
        let line = Program[i]
        for (let j = 0; j < line.length; j++) {
            if (line[j] === '{') {
                if (!in_string) {
                    brackets_stack.push([i, j])
                }
            }
            else if (line[j] === '}') {
                if (!in_string) {
                    if (brackets_stack.length == 1) {
                        return { 'start': brackets_stack[0], 'end': [i, j] }
                    }
                    brackets_stack.pop()
                }
            }
            else if (in_string === true && line[j] == "\\") {
                j++
            }
            else if (line[j] == '"') {
                in_string = !in_string
            }
        }
    }

    // not yet implemented

}
function getVariableIndex(VariableName,scope){
    let function_scope=0
    for(let j=0;j<Branch_stack.length;j++){
        if (Branch_stack[j]['keyword']=="function"){
            function_scope=Branch_stack[j]['scope']
        }
    }
    for (let j = 0; j < Variables.length; j++) {
        if (Variables[j]['name'] == VariableName )//scope 0=malloced values
        {
            if((Variables[j]['scope'] <= scope && Variables[j]['scope'] >=function_scope )|| Variables[j]['scope'] == 0){
                return j
            }
        }
    }
    return undefined
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
    let Cin = document.getElementById("Cin")
    let val = Cin.value
    Variables=[]
    Branch_stack = [{"keyword":"function","scope":1}]
    functions={}
    // console.log(val)
    // main_function_outline=/^int main\(\){\n.*\treturn 0;\n}$/
    // main_function_outline=/^int main\(\){(.|\n)*\treturn 0;\n}$/
    // main_function_outline=/(int|(.|\n)*\nint) main\(\){(.|\n)*\treturn 0;\n}$/
    main_function_outline = /^(.*\n)*int main\(\){(.|\n)*\treturn 0;\n}$/
    if (main_function_outline.test(val)) {
        if (check_syntax(val)) {
            Cin_text = val
            Program = val.split("\n")
            let datatypeExp = "((" + DataTypes[0] + ")"
            for (let i = 1; i < DataTypes.length; i++) {
                datatypeExp += "|(" + DataTypes[i] + ")"
            }
            datatypeExp += ")"
            const variableExp = "[a-zA-Z_][a-zA-Z0-9_]*"
            regex_of_function = new RegExp("^\\s*" + datatypeExp + " +" + variableExp + "\\(( *(" + datatypeExp + " +" + variableExp + " *, *)*( *" + datatypeExp + " +" + variableExp + ") *)?" + "\\)\\{ *$")

            let function_start_pointer = 0
            for (let i = 0; i < Program.length; i++) {
                let line = Program[i].trim()
                if (line === "int main(){") {
                    function_start_pointer = i + 1
                    break
                }
                else if (regex_of_function.test(line)) {

                }
            }
            interpret(function_start_pointer, 1)
        }
    }
    else {
        Cin.value = Cin_text
    }
    // let output=document.getElementById("Cout")
    // output.innerHTML=val
}
function check_syntax(text) { // balanced bracket checks only
    let brackets_stack = []
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
var Branch_stack = [{"keyword":"function","scope":1}]
var DataTypes = ["int", "float", "char"]
var Program = []
// var scope=0
const NULL = 0
var sleepTime = 1000
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
const sleep = function (ms) {
    if (ms === undefined) {
        ms = sleepTime
    }
    return new Promise(r => setTimeout(r, ms));
}
setTimeout(() => {
    // document.getElementById("Cin").value=stacks_struct+document.getElementById("Cin").value;
    document.getElementById("Cin").addEventListener('keydown', handleKey, true);
}, 100);


