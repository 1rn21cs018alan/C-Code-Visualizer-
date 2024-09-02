// async function interpret(function_start_pointer, scope = 1) {
//     // let datatypeExp = "((" + DataTypes[0] + ")"
//     // for (let i = 1; i < DataTypes.length; i++) {
//     //     datatypeExp += "|(" + DataTypes[i] + ")"
//     // }
//     // datatypeExp += ")"
//     const variableExp = "[a-zA-Z_][a-zA-Z0-9_]*"

//     // datatypeExp="d"
//     // variableExp="v"

//     regex_of_function = new RegExp("^\\s*" + datatypeExp + " +" + variableExp + "\\(( *(" + datatypeExp + " +" + variableExp + " *, *)*( *" + datatypeExp + " +" + variableExp + ") *)?" + "\\)\\{ *$")
//     regex_var_decl = new RegExp("^\\s*" + datatypeExp + " +(" + variableExp + " *(=[\\S\\s]+)? *, *)*" + variableExp + "( *=[\\S\\s]+)? *;")
//     const regex_assign = new RegExp("^\\s*" + variableExp + " *=[\\S\\s]+ *;")
//     const regex_return = new RegExp("^\\s*return *( [\\S\\s]*)? *;")
//     // let function_start_pointer = 0
//     // for (let i = 0; i < Program.length; i++) {
//     //     let line = Program[i].trim()
//     //     if (line === "int main(){") {
//     //         function_start_pointer = i + 1
//     //         break
//     //     }
//     // }
//     // scope = cur_scope
//     for (let i = function_start_pointer; i < Program.length - 1; i++) {
//         render_Variables()
//         render_Memory()
//         let line = Program[i].trim()
//         if (line === "") {
//             continue;
//         }
//         await sleep();
//         while (PAUSE_EXEC) {
//             await sleep(300);
//         }
//         if (regex_var_decl.test(line)) {
//             let type_data = line.match(datatypeExp)
//             let var_names = line.slice(type_data['index'] + type_data[0].length, -1).split(",")
//             console.log(var_names)
//             for (let j = 0; j < var_names.length; j++) {
//                 // varnames[j].match(variableExp)
//                 let var_name = var_names[j].split("=")[0].trim()
//                 let var_data = 0
//                 if (var_names[j].split("=")[1]) {
//                     // version without evaluation
//                     // var_data = var_names[j].split("=")[1].trim()
//                     // if (type_data[0] == "int") {
//                     //     if (var_data.match(/^(-)?[0-9]+$/)) {
//                     //         var_data = parseInt(var_data)
//                     //     }
//                     //     else {
//                     //         CrashNotif({ "error word": "int mismatch" })
//                     //         return
//                     //     }
//                     // }
//                     // else if (type_data[0] == "float") {
//                     //     if (var_data.match(/^(-)?[0-9]+(.[0-9]+)?$/)) {
//                     //         var_data = parseFloat(var_data)
//                     //     }
//                     //     else {
//                     //         CrashNotif({ "error word": "float mismatch" })
//                     //         return
//                     //     }
//                     // }
//                     // else if (type_data[0] == "char") {
//                     //     if (var_data.match(/^'\S'$/)) {
//                     //         var_data = var_data[1]
//                     //     }
//                     //     else {
//                     //         CrashNotif({ "error word": "char mismatch" })
//                     //         return
//                     //     }

//                     // } else {
//                     //     console.log(type_data[0])
//                     //     console.log("Can only initialize int,float or char variables during declaration")
//                     //     return;
//                     // }
//                     //version with evaluation
//                     var_data = evaluate(var_names[j].slice(var_names[j].indexOf('=') + 1), scope)
//                     if (type_data[0] == var_data['type']) {
//                         var_data = var_data['value']
//                     }
//                     else if (type_data[0] == 'int') {
//                         var_data = TypeCastInt(var_data)
//                     } else if (type_data[0] == 'float') {
//                         var_data = TypeCastFloat(var_data)
//                     } else if (type_data[0] == 'char') {
//                         var_data = TypeCastChar(var_data)
//                     } else {
//                         CrashNotif({ 'error word': 'wrong dtype initialization' })
//                         return;
//                     }
//                 }
//                 else if (type_data != "int" && type_data != "float") {
//                     if (type_data == 'char') {
//                         var_data = '\0'
//                     }
//                     else {
//                         var_data = NULL
//                     }
//                 }
//                 // version 1
//                 // for (let k = 0; k < Variables.length; k++) {
//                 //     if (Variables[k]['name'] == var_name && (Variables[k]['scope'] == scope || Variables[k]['scope'] == 0)) {
//                 //         CrashNotif({ "error word": "Variable of same name already exists" })
//                 //         return
//                 //         //crashed
//                 //     }
//                 // }

//                 // version 2
//                 if (getVariableIndex(var_name, scope) !== undefined) {
//                     CrashNotif({ "error word": "Variable of same name already exists" })
//                     return
//                     //crashed
//                 }
//                 // console.log("made var")
//                 Variables.push({ 'addr': 0, 'name': var_name, 'value': var_data, 'type': type_data[0], 'scope': scope, 'div': makeNode(0, var_name + ":" + var_data) })
//             }
//         }
//         else if (regex_assign.test(line)) {
//             let var_name = line.split("=")[0]
//             let var_data = line.slice(var_name.length + 1, -1)
//             var_name = var_name.trim()
//             //verision 1
//             // let match = undefined
//             // for (let j = 0; j < Variables.length; j++) {
//             //     if (Variables[j]['name'] == var_name && (Variables[j]['scope'] == scope || Variables[j]['scope'] == 0))//scope 0=malloced values
//             //     {
//             //         match = j
//             //         break
//             //     }
//             // }
//             let match = getVariableIndex(var_name, scope)
//             if (match === undefined) {
//                 CrashNotif({ "error word": "No such Variable" })
//                 return;
//                 //crashed program
//             }
//             else {
//                 let type_data = Variables[match]['type']
//                 let temp = evaluate(var_data, scope)
//                 if (type_data == temp['type']) {
//                     Variables[match]['value'] = temp['value']
//                     //render element
//                     Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']
//                 }
//                 else if (type_data == "int") {
//                     // Variables[match]['value'] = TypeCastInt(temp['value'])
//                     Variables[match]['value'] = TypeCastInt(temp)
//                     if (Variables[match]['value'] === undefined) {
//                         return
//                     }
//                     //render element
//                     Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']
//                 }
//                 else if (type_data == "float") {
//                     // Variables[match]['value'] = TypeCastFloat(temp['value'])
//                     Variables[match]['value'] = TypeCastFloat(temp)
//                     if (Variables[match]['value'] === undefined) {
//                         return
//                     }
//                     //render element
//                     Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']

//                 }
//                 else if (type_data == "char") {
//                     // Variables[match]['value'] = TypeCastChar(temp['value'])
//                     Variables[match]['value'] = TypeCastChar(temp)
//                     if (Variables[match]['value'] === undefined) {
//                         return
//                     }
//                     //render element
//                     Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']

//                 } else {
//                     CrashNotif({ "error word": "Type mismatch" })
//                     return undefined
//                 }
//             }

//         }
//         else if (regex_of_function.test(line)) {

//         }
//         else {
//             // console.log(line)
//             let word = getWord(line, 0)
//             console.log(word)
//             if (word === undefined) {
//                 debugger
//                 if (line.indexOf('}') !== -1) {
//                     let temp = Branch_stack[Branch_stack.length - 1]
//                     if (temp['keyword'] == 'if' && temp['inner_scope'] == scope) {
//                         scope -= 1
//                         i = temp['end'] - 1
//                         Branch_stack.pop()
//                         deallocateOutOfScopeVariables(scope)
//                     }
//                     else if (temp['keyword'] == 'for' && temp['inner_scope'] == scope) {
//                         deallocateOutOfScopeVariables(scope - 1)
//                         if (regex_assign.test(temp['update_exp'] + ";")) {
//                             let var_name = temp['update_exp'].split("=")[0]
//                             let temp2 = evaluate(temp['update_exp'].slice(var_name.length + 1), scope + 1)
//                             let match = getVariableIndex(var_name, scope - 1)

//                             let type_data = Variables[match]['type']
//                             if (type_data == temp2['type']) {
//                                 Variables[match]['value'] = temp2['value']
//                                 //render element
//                                 Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']
//                             }
//                             else if (type_data == "int") {
//                                 Variables[match]['value'] = TypeCastInt(temp2)
//                                 if (Variables[match]['value'] === undefined) {
//                                     return
//                                 }
//                                 //render element
//                                 Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']
//                             }
//                             else if (type_data == "float") {
//                                 Variables[match]['value'] = TypeCastFloat(temp2)
//                                 if (Variables[match]['value'] === undefined) {
//                                     return
//                                 }
//                                 //render element
//                                 Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']

//                             }
//                             else if (type_data == "char") {
//                                 Variables[match]['value'] = TypeCastChar(temp2)
//                                 if (Variables[match]['value'] === undefined) {
//                                     return
//                                 }
//                                 //render element
//                                 Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']

//                             } else {
//                                 CrashNotif({ "error word": "Type mismatch" })
//                                 return undefined
//                             }

//                         }
//                         let pass = evaluate(temp['test_exp'], scope - 1)
//                         if (pass === undefined) {
//                             deallocateOutOfScopeVariables(scope - 1)
//                             i = temp['start'] - 1
//                         }
//                         else if (pass['value'] == 0) {

//                             Branch_stack.pop()
//                             scope -= 2
//                             deallocateOutOfScopeVariables(scope)
//                             i = temp['end'] - 1
//                         }
//                         else {
//                             deallocateOutOfScopeVariables(scope - 1)
//                             i = temp['start'] - 1
//                         }
//                     }
//                 }
//             }
//             else if (word['word'] == "if") {
//                 // console.log("if condition detected")
//                 //get expression in if
//                 if (/^\s*if\s*\(.*\)\s*\{\s*$/.test(line)) {
//                     // console.log("valid if")
//                 }
//                 let exp = line.slice(word['end']).split('{', 1)[0]
//                 // console.log(exp)
//                 let pass = evaluate(exp, scope)
//                 // console.log(pass)
//                 let if_code = getContainer(i, Program[i].indexOf("{"))
//                 // console.log(if_code)
//                 let If_data = { "keyword": "if", "else": undefined, "end": if_code["end"][0] + 1, "inner_scope": scope + 1 }
//                 if (Program[If_data["end"]].includes("else")) {
//                     let j = If_data["end"]
//                     If_data["else"] = j
//                     while (Program[j].includes("else if")) {
//                         let elif_code = getContainer(j, Program[j].indexOf("{"))
//                         j = elif_code["end"][0] + 1
//                         If_data["end"] = j
//                     }
//                     if (Program[j].includes("else")) {
//                         let else_code = getContainer(j, Program[j].indexOf("{"))
//                         If_data["end"] = else_code["end"][0] + 1
//                     }
//                 }
//                 Branch_stack.push(If_data)
//                 if (pass['value'] == 0) { //did not enter if condition
//                     // console.log("failed")
//                     if (If_data["else"] === undefined) {
//                         i = If_data["end"] - 1
//                         Branch_stack.pop()
//                     }
//                     else {
//                         i = If_data["else"] - 1
//                     }
//                 }
//                 else {//entered if condition
//                     scope += 1
//                     // console.log("passed")
//                 }

//             }
//             else if (word['word'] == "else") {
//                 let temp = Branch_stack[Branch_stack.length - 1]
//                 if (temp === undefined) {
//                     CrashNotif({ "error word": "No if condition detected" })
//                     return
//                 }

//                 if (temp["keyword"] != "if") {
//                     CrashNotif({ "error word": "No if condition detected" })
//                     return
//                 }

//                 if (temp["inner_scope"] == scope + 1) {
//                     if (Program[i].includes("if")) {
//                         let code = getContainer(i, Program[i].indexOf("{"))
//                         temp['else'] = undefined
//                         if (Program[code['end'][0] + 1].includes("else")) {
//                             temp['else'] = code['end'][0] + 1
//                         }
//                         let exp = Program[i].slice(Program[i].indexOf('('), code['start'][1])
//                         // console.log(exp)
//                         let pass = evaluate(exp, scope)
//                         // console.log(pass)
//                         if (pass === undefined) {
//                             pass = { 'value': 1 }
//                         }
//                         if (pass['value'] == 0) { //did not enter if condition
//                             // console.log("failed")
//                             if (temp["else"] === undefined) {
//                                 i = temp["end"] - 1
//                                 Branch_stack.pop()
//                             }
//                             else {
//                                 i = temp["else"] - 1
//                             }
//                         }
//                         else {//entered if condition
//                             scope += 1
//                             // console.log("passed")
//                         }

//                     }
//                     else {
//                         temp['else'] = undefined
//                         scope += 1
//                     }
//                 }
//                 else {
//                     CrashNotif({ "error word": "No if condition deteted" })
//                     return
//                 }

//             }
//             else if (word['word'] == "for") {
//                 if (/^\s*for\s*\(.*;.*;.*\)\s*\{\s*$/.test(line)) {
//                     let init_exp = line.slice(line.indexOf('(') + 1, line.indexOf(';'))
//                     let test_exp = line.slice(line.indexOf(';') + 1, line.lastIndexOf(';'))
//                     let update_exp = line.slice(line.lastIndexOf(';') + 1, line.lastIndexOf(')'))
//                     let for_code = getContainer(i, Program[i].indexOf('{'))
//                     if (for_code == undefined) {
//                         CrashNotif({ "error word": "For loop syntax error" })
//                         return
//                     }
//                     let for_data = { "keyword": "for", "start": i + 1, "end": for_code['end'][0] + 1, "test_exp": test_exp, "update_exp": update_exp, "inner_scope": scope + 2 }
//                     Branch_stack.push(for_data)
//                     if (regex_var_decl.test(init_exp + ";")) {
//                         let temp = getWord(init_exp, 0)
//                         let var_type = temp['word']
//                         let declarations = init_exp.slice(temp['end']).split(",")
//                         for (let j = 0; j < declarations.length; j++) {
//                             let var_name = getWord(declarations[j], 0)['word']
//                             let var_data = evaluate(declarations[j].slice(declarations[j].split('=')[0].length + 1), scope + 1)
//                             if (var_type == "int") {
//                                 var_data = TypeCastInt(var_data)
//                                 Variables.push({ 'addr': 0, 'name': var_name, 'value': var_data, 'type': var_type, 'scope': scope + 1, 'div': makeNode(0, var_name + ":" + var_data) })
//                             }
//                             else if (var_type == "float") {
//                                 var_data = TypeCastFloat(var_data)
//                                 Variables.push({ 'addr': 0, 'name': var_name, 'value': var_data, 'type': var_type, 'scope': scope + 1, 'div': makeNode(0, var_name + ":" + var_data) })
//                             }
//                             else if (var_type == 'char') {
//                                 var_data = TypeCastChar(var_data)
//                                 Variables.push({ 'addr': 0, 'name': var_name, 'value': var_data, 'type': var_type, 'scope': scope + 1, 'div': makeNode(0, var_name + ":" + var_data) })
//                             }
//                         }
//                     }
//                     else {//not declaring
//                         let var_name = init_exp.split("=")[0]
//                         let temp = evaluate(init_exp.slice(var_name.length + 1), scope + 1)
//                         let match = getVariableIndex(var_name, scope + 1)

//                         let type_data = Variables[match]['type']
//                         if (type_data == temp['type']) {
//                             Variables[match]['value'] = temp['value']
//                             //render element
//                             Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']
//                         }
//                         else if (type_data == "int") {
//                             // Variables[match]['value'] = TypeCastInt(temp['value'])
//                             Variables[match]['value'] = TypeCastInt(temp)
//                             if (Variables[match]['value'] === undefined) {
//                                 return
//                             }
//                             //render element
//                             Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']
//                         }
//                         else if (type_data == "float") {
//                             // Variables[match]['value'] = TypeCastFloat(temp['value'])
//                             Variables[match]['value'] = TypeCastFloat(temp)
//                             if (Variables[match]['value'] === undefined) {
//                                 return
//                             }
//                             //render element
//                             Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']

//                         }
//                         else if (type_data == "char") {
//                             // Variables[match]['value'] = TypeCastChar(temp['value'])
//                             Variables[match]['value'] = TypeCastChar(temp)
//                             if (Variables[match]['value'] === undefined) {
//                                 return
//                             }
//                             //render element
//                             Variables[match]['div'].innerHTML = Variables[match]['addr'] + "|" + Variables[match]['name'] + ":" + Variables[match]['value']

//                         } else {
//                             CrashNotif({ "error word": "Type mismatch" })
//                             return undefined
//                         }

//                     }
//                     let pass = evaluate(test_exp, scope + 1)
//                     if (pass === undefined) {
//                         scope += 2
//                     }
//                     else if (pass['value'] == 0) {

//                         //exit before start
//                         Branch_stack.pop()
//                         deallocateOutOfScopeVariables(scope)
//                         i = for_code['end'][0]
//                     }
//                     else {
//                         //enter loop
//                         scope += 2
//                     }
//                 }
//                 else {
//                     CrashNotif({ 'error word': "for loop syntax is wrong" })
//                     return
//                 }
//             }
//             else if (word['word'] == "while") {
//                 let test_exp = line.slice(line.indexOf('('), line.lastIndexOf('{'))
//                 let loop_code = getContainer(i, Program[i].indexOf('{'))
//                 if (loop_code == undefined) {
//                     CrashNotif({ "error word": "While loop syntax error" })
//                     return
//                 }
//                 let for_data = { "keyword": "for", "start": i + 1, "end": loop_code['end'][0] + 1, "test_exp": test_exp, "update_exp": "1", "inner_scope": scope + 2 }
//                 Branch_stack.push(for_data)
//                 let pass = evaluate(test_exp, scope + 1)
//                 if (pass === undefined) {
//                     scope += 2
//                 }
//                 else if (pass['value'] == 0) {
//                     //exit before start
//                     Branch_stack.pop()
//                     deallocateOutOfScopeVariables(scope)
//                     i = loop_code['end'][0]
//                 }
//                 else {
//                     //enter loop
//                     scope += 2
//                 }
//             }
//             else if (word['word'] == "do") {
//                 let loop_code = getContainer(i, Program[i].indexOf('{'))
//                 if (loop_code == undefined) {
//                     CrashNotif({ "error word": "do while loop syntax error" })
//                     return
//                 }
//                 else if (!(/^\s*\}\s*while\s*\([\S\s]*\)\s*;\s*$/.test(Program[loop_code['end'][0]]))) {
//                     CrashNotif({ "error word": "do while loop syntax error" })
//                     return
//                 }
//                 line = Program[loop_code['end'][0]]
//                 let test_exp = line.slice(line.indexOf('('), line.lastIndexOf(';'))
//                 let for_data = { "keyword": "for", "start": i + 1, "end": loop_code['end'][0] + 1, "test_exp": test_exp, "update_exp": "1", "inner_scope": scope + 2 }
//                 Branch_stack.push(for_data)
//                 scope += 2
//             }
//             else if (word['word'] == 'break') {
//                 if (/^\s*break\s*;\s*$/.test(Program[i])) {
//                     for (let j = Branch_stack.length - 1; j >= 0; j--) {
//                         if (Branch_stack[j]['keyword'] == 'for') {
//                             i = Branch_stack[j]['end'] - 1
//                             scope = Branch_stack[j]['inner_scope'] - 2
//                             deallocateOutOfScopeVariables(scope)
//                             break;
//                         }
//                         else {
//                             Branch_stack.pop()
//                         }
//                     }
//                 }
//             }
//             else if (word['word'] == 'continue') {
//                 if (/^\s*continue\s*;\s*$/.test(Program[i])) {
//                     for (let j = Branch_stack.length - 1; j >= 0; j--) {
//                         if (Branch_stack[j]['keyword'] == 'for') {
//                             i = Branch_stack[j]['end'] - 2
//                             scope = Branch_stack[j]['inner_scope']
//                             break;
//                         }
//                         else {
//                             Branch_stack.pop()
//                         }
//                     }
//                 }
//             }
//             else {
//                 debugger;
//             }
//         }
//     }
//     // console.log(Program)
// }
async function interpret(function_start_pointer, scope = 1) {
    const variableExp = "[a-zA-Z_][a-zA-Z0-9_]*"
    regex_of_function = new RegExp("^\\s*" + datatypeExp + " +" + variableExp + "\\(( *(" + datatypeExp + " +" + variableExp + " *, *)*( *" + datatypeExp + " +" + variableExp + ") *)?" + "\\)\\{ *$")
    regex_var_decl = new RegExp("^\\s*" + datatypeExp + " +(" + variableExp + " *(=[\\S\\s]+)? *, *)*" + variableExp + "( *=[\\S\\s]+)? *;")
    const regex_assign = new RegExp("^\\s*" + variableExp + " *=[\\S\\s]+ *;")
    const regex_return = new RegExp("^\\s*return *( [\\S\\s]*)? *;")

    for (let i = function_start_pointer; i < Program.length - 1; i++) {
        render_Variables()
        render_Memory()
        debugger;
        let line = Program[i].trim()
        let tokens = lineLexer(line)
        if (line === "") {
            continue;
        }
        await sleep();
        while (PAUSE_EXEC) {
            await sleep(300);
        }
        if (is_var_declaration(tokens)['is_var']) {
            let var_type = is_var_declaration(tokens)['type']
            let var_names = [[]]
            if (tokens[is_var_declaration(tokens)['first variable'] + 1] == '[') {
                // console.log("detected Array")
                let array_dim = []
                let array_size_tokens = []
                let bracket_balance = 0
                let j = is_var_declaration(tokens)['first variable'] + 1
                let var_index = 0;
                for (; j < tokens.length; j++) {
                    if (tokens[j] == '[') {
                        bracket_balance += 1
                    }
                    else if (tokens[j] == ']') {
                        bracket_balance -= 1
                    }
                    if (bracket_balance == 0) {
                        if (tokens[j] == ']') {
                            let arr_dim_size = evaluate(array_size_tokens, scope)
                            array_dim.push(arr_dim_size)
                            array_size_tokens = []
                        } else {
                            //array declarations
                            var_index = createVariable(tokens[is_var_declaration(tokens)['first variable']], { 'dtype': var_type, 'dims': array_dim }, scope)
                            break;
                        }
                    }
                    else if (tokens[j] == '[' && bracket_balance == 1) {
                        continue
                    }
                    else {
                        array_size_tokens.push(tokens[j])
                    }
                }
                //code for array initialization 
                if (tokens[j] == '=') {
                    let assign_address = { 'addr': Variables[var_index]['addr'], 'type': var_type }
                    if (tokens[j + 1] == '{' && _top(tokens) == ';' && tokens[tokens.length - 2] == '}') {
                        j += 2;
                        let elem_count = array_dim.reduce((a, k, c) => a * k['value'], 1)
                        for (let k = 0; k < elem_count && j < tokens.length; k++, j++) {
                            let elem_tokens = []
                            while (tokens[j] != ',' && j < tokens.length) {
                                if (tokens[j] != '{' || tokens[j] != '}') {
                                    elem_tokens.push(tokens[j])
                                }
                                j++;
                            }
                            let elem = evaluate(elem_tokens, scope)
                            // console.log(elem,elem_tokens,tokens[j])
                            evaluate([assign_address, '=', elem], scope)
                            assign_address['addr'] += size_of(var_type)
                        }
                    }
                    else if (false) {
                        // handle strings later
                    }
                    else {
                        CrashNotif("Invalid Array Initialization")
                    }
                }
            }
            else {
                for (let j = is_var_declaration(tokens)['first variable']; j < tokens.length; j++) {
                    if (tokens[j] == ',') {
                        var_names.push([])
                    } else {
                        if (_top(var_names).length == 0 && tokens[j] != "[") {
                            createVariable(tokens[j], var_type, scope)
                        }
                        if (_top(var_names).length == 1) {
                            if (tokens[j] == '[') {
                                // let array_decl = var_names.pop()
                                // while (tokens[j] != ',') {
                                //     array_decl.push(token[j])
                                //     j++;
                                // }
                                // var_names.push([])
                                // //array declaration logic
                                // createVariable(array_decl[0], var_type + '*', scope)
                                CrashNotif("Array declaration must be done seperately")
                            }
                        }
                        _top(var_names).push(tokens[j])
                    }
                }
                for (let j = 0; j < var_names.length; j++) {
                    evaluate(var_names[j], scope)
                }
            }
        }
        else if (tokens[0] === '}') {
            let temp = Branch_stack[Branch_stack.length - 1]
            if (temp['keyword'] == 'if' && temp['inner_scope'] == scope) {
                scope -= 1
                i = temp['end'] - 1
                Branch_stack.pop()
                deallocateOutOfScopeVariables(scope)
            }
            else if (temp['keyword'] == 'for' && temp['inner_scope'] == scope) {
                deallocateOutOfScopeVariables(scope - 1)
                evaluate(temp['update_exp'], scope + 1)

                let pass = evaluate(temp['test_exp'], scope - 1)
                // console.log(pass)
                if (pass === undefined) {
                    deallocateOutOfScopeVariables(scope - 1)
                    i = temp['start'] - 1
                }
                else {
                    if (pass['value'] === undefined) {
                        pass = { 'value': getVariableData(pass) }
                    }
                    if (pass['value'] == 0) {

                        Branch_stack.pop()
                        scope -= 2
                        deallocateOutOfScopeVariables(scope)
                        i = temp['end'] - 1
                    }
                    else {
                        deallocateOutOfScopeVariables(scope - 1)
                        i = temp['start'] - 1
                    }
                }
            }
        }
        else if (tokens[0] == "if") {
            // console.log("if condition detected")
            //get expression in if
            if (/^\s*if\s*\(.*\)\s*\{\s*$/.test(line)) {
                // console.log("valid if")
            }
            let exp = line.slice(line.indexOf('(')).split('{', 1)[0]
            // console.log(exp)
            let pass = evaluate(exp, scope)
            // console.log(pass)
            let if_code = getContainer(i, Program[i].indexOf("{"))
            // console.log(if_code)
            let If_data = { "keyword": "if", "else": undefined, "end": if_code["end"][0] + 1, "inner_scope": scope + 1 }
            if (Program[If_data["end"]].includes("else")) {
                let j = If_data["end"]
                If_data["else"] = j
                while (Program[j].includes("else if")) {
                    let elif_code = getContainer(j, Program[j].indexOf("{"))
                    j = elif_code["end"][0] + 1
                    If_data["end"] = j
                }
                if (Program[j].includes("else")) {
                    let else_code = getContainer(j, Program[j].indexOf("{"))
                    If_data["end"] = else_code["end"][0] + 1
                }
            }
            Branch_stack.push(If_data)
            if (pass['value'] === undefined) {
                pass = { 'value': getVariableData(pass) }
            }
            if (pass['value'] == 0) { //did not enter if condition
                // console.log("failed")
                if (If_data["else"] === undefined) {
                    i = If_data["end"] - 1
                    Branch_stack.pop()
                }
                else {
                    i = If_data["else"] - 1
                }
            }
            else {//entered if condition
                scope += 1
                // console.log("passed")
            }

        }
        else if (tokens[0] == "else") {
            let temp = Branch_stack[Branch_stack.length - 1]
            if (temp === undefined) {
                CrashNotif({ "error word": "No if condition detected" })
                return
            }

            if (temp["keyword"] != "if") {
                CrashNotif({ "error word": "No if condition detected" })
                return
            }

            if (temp["inner_scope"] == scope + 1) {
                if (Program[i].includes("if")) {
                    let code = getContainer(i, Program[i].indexOf("{"))
                    temp['else'] = undefined
                    if (Program[code['end'][0] + 1].includes("else")) {
                        temp['else'] = code['end'][0] + 1
                    }
                    let exp = Program[i].slice(Program[i].indexOf('('), code['start'][1])
                    // console.log(exp)
                    let pass = evaluate(exp, scope)
                    // console.log(pass)
                    if (pass === undefined) {
                        pass = { 'value': 1 }
                    }
                    if (pass['value'] === undefined) {
                        pass = { 'value': getVariableData(pass) }
                    }
                    if (pass['value'] == 0) { //did not enter if condition
                        // console.log("failed")
                        if (temp["else"] === undefined) {
                            i = temp["end"] - 1
                            Branch_stack.pop()
                        }
                        else {
                            i = temp["else"] - 1
                        }
                    }
                    else {//entered if condition
                        scope += 1
                        // console.log("passed")
                    }

                }
                else {
                    temp['else'] = undefined
                    scope += 1
                }
            }
            else {
                CrashNotif({ "error word": "No if condition deteted" })
                return
            }

        }
        else if (tokens[0] == "for") {
            if (/^\s*for\s*\(.*;.*;.*\)\s*\{\s*$/.test(line)) {
                let init_exp = line.slice(line.indexOf('(') + 1, line.indexOf(';'))
                let test_exp = line.slice(line.indexOf(';') + 1, line.lastIndexOf(';'))
                let update_exp = line.slice(line.lastIndexOf(';') + 1, line.lastIndexOf(')'))
                let for_code = getContainer(i, Program[i].indexOf('{'))
                if (for_code == undefined) {
                    CrashNotif({ "error word": "For loop syntax error" })
                    return
                }
                let for_data = { "keyword": "for", "start": i + 1, "end": for_code['end'][0] + 1, "test_exp": test_exp, "update_exp": update_exp, "inner_scope": scope + 2 }
                Branch_stack.push(for_data)
                if (is_var_declaration(lineLexer(init_exp + ';'))['is_var']) {
                    let temp_tokens = lineLexer(init_exp + ';')
                    let var_type = is_var_declaration(temp_tokens)['type']
                    let var_names = [[]]
                    for (let j = is_var_declaration(temp_tokens)['first variable']; j < temp_tokens.length; j++) {
                        if (temp_tokens[j] == ',') {
                            var_names.push([])
                        } else {
                            if (_top(var_names).length == 0) {
                                createVariable(temp_tokens[j], var_type, scope + 1)
                            }
                            _top(var_names).push(temp_tokens[j])
                        }
                    }
                    for (let j = 0; j < var_names.length; j++) {
                        evaluate(var_names[j], scope + 1)
                    }
                }
                else {
                    evaluate(lineLexer(init_exp), scope + 1)
                }
                let pass = evaluate(test_exp, scope + 1)
                if (pass === undefined) {
                    scope += 2
                }
                else {
                    if (pass['value'] === undefined) {
                        pass = { 'value': getVariableData(pass) }
                    }
                    if (pass['value'] == 0) {

                        //exit before start
                        Branch_stack.pop()
                        deallocateOutOfScopeVariables(scope)
                        i = for_code['end'][0]
                    }
                    else {
                        //enter loop
                        scope += 2
                    }
                }
            }
            else {
                CrashNotif({ 'error word': "for loop syntax is wrong" })
                return
            }
        }
        else if (tokens[0] == "while") {
            let test_exp = line.slice(line.indexOf('('), line.lastIndexOf('{'))
            let loop_code = getContainer(i, Program[i].indexOf('{'))
            if (loop_code == undefined) {
                CrashNotif({ "error word": "While loop syntax error" })
                return
            }
            let for_data = { "keyword": "for", "start": i + 1, "end": loop_code['end'][0] + 1, "test_exp": test_exp, "update_exp": "1", "inner_scope": scope + 2 }
            Branch_stack.push(for_data)
            let pass = evaluate(test_exp, scope + 1)
            if (pass === undefined) {
                scope += 2
            }
            else {
                if (pass['value'] === undefined) {
                    pass = { 'value': getVariableData(pass) }
                }
                if (pass['value'] == 0) {
                    //exit before start
                    Branch_stack.pop()
                    deallocateOutOfScopeVariables(scope)
                    i = loop_code['end'][0]
                }
                else {
                    //enter loop
                    scope += 2
                }
            }
        }
        else if (tokens[0] == "do") {
            let loop_code = getContainer(i, Program[i].indexOf('{'))
            if (loop_code == undefined) {
                CrashNotif({ "error word": "do while loop syntax error" })
                return
            }
            else if (!(/^\s*\}\s*while\s*\([\S\s]*\)\s*;\s*$/.test(Program[loop_code['end'][0]]))) {
                CrashNotif({ "error word": "do while loop syntax error" })
                return
            }
            line = Program[loop_code['end'][0]]
            let test_exp = line.slice(line.indexOf('('), line.lastIndexOf(';'))
            let for_data = { "keyword": "for", "start": i + 1, "end": loop_code['end'][0] + 1, "test_exp": test_exp, "update_exp": "1", "inner_scope": scope + 2 }
            Branch_stack.push(for_data)
            scope += 2
        }
        else if (tokens[0] == 'break') {
            if (/^\s*break\s*;\s*$/.test(Program[i])) {
                for (let j = Branch_stack.length - 1; j >= 0; j--) {
                    if (Branch_stack[j]['keyword'] == 'for') {
                        i = Branch_stack[j]['end'] - 1
                        scope = Branch_stack[j]['inner_scope'] - 2
                        deallocateOutOfScopeVariables(scope)
                        break;
                    }
                    else {
                        Branch_stack.pop()
                    }
                }
            }
        }
        else if (tokens[0] == 'continue') {
            if (/^\s*continue\s*;\s*$/.test(Program[i])) {
                for (let j = Branch_stack.length - 1; j >= 0; j--) {
                    if (Branch_stack[j]['keyword'] == 'for') {
                        i = Branch_stack[j]['end'] - 2
                        scope = Branch_stack[j]['inner_scope']
                        break;
                    }
                    else {
                        Branch_stack.pop()
                    }
                }
            }
        }
        else if (tokens[0] == 'return') {
            debugger;
        }
        else {
            evaluate(tokens, scope)
        }
    }
}
function evaluate(tokens, scope) {
    if (scope === undefined) {
        CrashNotif({ "error word": 'Scope Not Given' })
        return
    }
    if (typeof (tokens) == 'string') {
        tokens = lineLexer(tokens)
    }
    let result = undefined
    /*
        parse mode values
        0=Not Started reading value
        1=reading either a variable or function
        2=reading a function's parameters
    */
    let parse_mode = 0;
    let temp = undefined
    let operator = undefined
    let negativeFlag = false
    let postfix_stack = []
    let operation_stack = ['#']
    function is_identifier(x) {
        if (x === undefined) return false
        return /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(x)
    }
    let F = function (s) {
        switch (s) {
            case '=':
            case '+=':
            case '-=':
            case '*=':
            case '/=':
            case '%=': return 1;
            case '||': return 2;
            case '&&': return 3;
            case '==':
            case '!=': return 4;
            case '>':
            case '<':
            case '>=':
            case '<=': return 5;
            case '+':
            case '-': return 6;
            case '*':
            case '%':
            case '/': return 7;
            case '&':
            case '*deref':
            case '++pre':
            case '+unary':
            case '--pre':
            case '-unary':
            case '(float)':
            case '(char)':
            case '(int)':
            case '(float*)':
            case '(char*)':
            case '(int*)':
            case '(float**)':
            case '(char**)':
            case '(int**)':
            case '!': return 8;
            case '#': return -1;
            case '++post':
            case '--post':
            case '->':
            case '.': return 10;
            case '[':
            case '(': return 11;
            case ']':
            case ')': return 0;
            default: return 9;
        }
    }
    let is_right_associative = function (s) {
        switch (s) {
            case '++pre':
            case '--pre':
            case '-unary':
            case '+unary':
            case '*deref':
            case '!':
            case '&':
            case '(float)':
            case '(char)':
            case '(int)':
            case '(float*)':
            case '(char*)':
            case '(int*)':
            case '(float**)':
            case '(char**)':
            case '(int**)':
            case '=':
            case '+=':
            case '-=':
            case '*=':
            case '/=':
            case '%=':
                return true;
            default: return false
        }
    }
    let conv = function (elem) {
        debugger;
        if (F(elem) == F("abc")) {
            postfix_stack.push(elem)
            return;
        }
        if (elem == '(' || elem == '[') {
            operation_stack.push(elem)
            return;
        }
        while ((F(_top(operation_stack)) > F(elem))) {
            let temp3 = operation_stack.pop()
            if (temp3 == '(' && elem == ')') {
                return;
            } else if (temp3 == '[' && elem == ']') {
                //pointer logic
                let temp = postfix_stack.pop();
                if (temp['type'] != 'int') {
                    CrashNotif("Index must be integer")
                    return
                }
                let index = temp['value']
                if (index === undefined) {
                    index = getVariableData(temp)
                }
                let temp2 = postfix_stack.pop();
                if (temp2['type'] !== undefined) {
                    if (temp2['type']['dtype'] !== undefined) {
                        //array with index
                        let elem_dim = [];
                        let elem_size = size_of(temp2['type']['dtype']);
                        let result = { 'addr': temp2['addr'], 'type': { 'dtype': temp2['type']['dtype'], 'dims': elem_dim } }
                        for (let i = 1; i < temp2['type']['dims'].length; i++) {
                            elem_size *= temp2['type']['dims'][i]['value']
                            elem_dim.push({ 'value': temp2['type']['dims'][i]['value'], 'type': 'int' })
                        }
                        result['addr'] += elem_size * index
                        if (elem_dim.length == 0) {
                            result['type'] = temp2['type']['dtype']
                        }
                        postfix_stack.push(result)
                    }
                    else if (temp2['type'].indexOf('*') !== -1) {
                        // pointer with index   
                        let elem_size = size_of(temp2['type'].slice(0, -1))
                        let final_pointer = getVariableData(temp2) + elem_size * index
                        console.log(final_pointer)
                        let accessed_variable = { 'addr': final_pointer, 'type': temp2['type'].slice(0, -1) }
                        postfix_stack.push(accessed_variable)
                    }
                    else {
                        CrashNotif("Index can only be given for pointer or array type")
                        return
                    }
                }

                return;
            } else if (temp3 == '(' || temp3 == '[') {
                operation_stack.push(temp3)
                operation_stack.push(elem)
                return;
            }
            postfix_push(temp3)
        }
        if (F(_top(operation_stack)) != F(elem)) {
            operation_stack.push(elem);
        }
        else {
            if (is_right_associative(elem)) {
                operation_stack.push(elem)
            }
            else {
                let temp3 = operation_stack.pop()
                postfix_push(temp3)
                operation_stack.push(elem)
            }
        }
    }
    let resolveTypes = function (type1, type2) {
        if (type1 == type2) {
            return type1
        }
        if (type1['dtype'] !== undefined && type2['dtype'] !== undefined) {
            if (type1['dtype'] == type2['dtype']) {
                if (type1['dims'].length == type2['dims'].length) {
                    let i = 0
                    for (; i < type1['dims'].length; i++) {
                        if (type1['dims'][i]['value'] != type2['dims'][i]['value']) {
                            break
                        }
                    }
                    if (i == type1['dims'].length) return JSON.parse(JSON.stringify(type1));
                }
            }
        }
        if ((type1 == "float" && (type2 == 'char' || type2 == 'int')) ||
            (type2 == "float" && (type1 == 'char' || type1 == 'int'))) {
            return "float"
        }
        if ((type1 == 'int' && type2 == 'char') ||
            (type2 == 'int' && type1 == 'char')) {
            return 'int'
        }
        if (type1 == 'float' || type2 == 'float') {
            CrashNotif({ "error word": "Incompatible types" })
        }
        if (type1 == 'int' || type1 == 'char') {
            return type2;
        }
        else if (type2 == 'int' || type2 == 'char') {
            return type1
        }
        if ((type1 == 'int' || type1 == 'char') && (_top(type2) == '*' || type2['dtype'] !== undefined)) {
            return type2
        } else if ((type2 == 'int' || type2 == 'char') && (_top(type1) == '*' || type1['dtype'] !== undefined)) {
            return type1
        }
        CrashNotif({ "error word": "Incompatible types" })
    }
    let postfix_push = function (elem) {
        let op1 = postfix_stack.pop(), op2 = undefined, temp_res = { 'value': 0, 'type': "float" }
        let is_pointer = function (elem) {
            if (elem === undefined) return false
            if (elem['type'] === undefined) return false
            if (_top(elem['type']) === '*') return true
            if (elem['type']['dtype'] !== undefined) return true
            return false
        }
        // if (typeof (op1) != 'object') {
        //     op1 = Variables[getVariableIndex(op1, scope)]
        //     if (op1 === undefined) {
        //         CrashNotif({ "error word": "Invalid Variable" })
        //         return
        //     }
        // }
        switch (elem) {
            case '&':
                temp_res['value'] = op1['addr']
                if (temp_res['value'] === undefined) {
                    CrashNotif({ "error word": "Invalid Variable" })
                }
                temp_res['type'] = op1['type'] + '*'
                postfix_stack.push(temp_res)
                break;
            case '*deref':
                if (op1['addr'] === undefined) {
                    temp_res['addr'] = op1['value']
                }
                else {
                    temp_res['addr'] = getVariableData(op1)
                }
                if (temp_res['addr'] === undefined) {
                    CrashNotif({ "error word": "Invalid Variable" })
                }
                if (_top(op1['type']) == '*') {
                    temp_res['type'] = op1['type'].slice(0, -1)
                }
                else {
                    CrashNotif("Dereferencing a Non-Pointer")
                    return;
                }
                postfix_stack.push(temp_res)
                break;
            case '++pre':
                if (op1['addr'] === undefined) {
                    CrashNotif("Incrementing temporary variables is not possible")
                    return
                }
                else if (op1['type']['dtype'] !== undefined) {
                    CrashNotif("Incrementing constant pointer is not possible")
                    return
                }
                else {
                    temp_res = { 'value': getVariableData(op1), 'type': op1['type'] }
                    if (_top(op1['type']) != '*') {
                        temp_res['value'] = TypeCastFloat(temp_res) + 1
                    }
                    else {
                        temp_res['value'] = temp_res['value'] + size_of(op1['type'])
                    }
                    setVariableData(op1, temp_res['value'])
                }
                postfix_stack.push(temp_res)
                break;
            case '+unary':
                // if (op1['addr'] === undefined) {
                //     temp_res['value'] = op1['value']
                // }
                // else {
                //     temp_res['value'] = getVariableData(op1)
                // }
                // temp_res['type']=op1['type']
                // if(op['type']=='char'){
                //     temp_res['type']='char'
                //     temp_res['value']=TypeCastInt(temp_res)
                //     temp_res['type']='int'
                // }
                // temp_res['value']=-temp_res['value']
                // if (_top(op1['type']) == '*') {
                //     temp_res['type'] = op1['type'].slice(0, -1)
                // }
                // else {
                //     CrashNotif("Dereferencing a Non-Pointer")
                //     return;
                // }
                // postfix_stack.push(temp_res)
                postfix_stack.push(op1)
                break;
            case '--pre':
                if (op1['addr'] === undefined) {
                    CrashNotif("Incrementing temporary variables is not possible")
                    return
                }
                else if (op1['type']['dtype'] !== undefined) {
                    CrashNotif("Incrementing constant pointer is not possible")
                    return
                }
                else {
                    temp_res = { 'value': getVariableData(op1), 'type': op1['type'] }
                    if (_top(op1['type']) != '*') {
                        temp_res['value'] = TypeCastFloat(temp_res) - 1
                    }
                    else {
                        temp_res['value'] = temp_res['value'] - size_of(op1['type'])
                    }
                    setVariableData(op1, temp_res['value'])
                }
                postfix_stack.push(temp_res)
                break;
            case '-unary':
                if (op1['addr'] === undefined) {
                    temp_res['value'] = op1['value']
                }
                else {
                    temp_res['value'] = getVariableData(op1)
                }
                temp_res['type'] = op1['type']
                if (op1['type'] == 'char') {
                    temp_res['type'] = 'char'
                    temp_res['value'] = TypeCastInt(temp_res)
                    temp_res['type'] = 'int'
                }
                temp_res['value'] = -temp_res['value']
                postfix_stack.push(temp_res)
                break;
            case '(float)':
                if (op1['type'] == 'float' ||
                    op1['type'] == 'int' ||
                    op1['type'] == 'char'
                ) {
                    if (op1['addr'] !== undefined) {
                        op1 = { 'type': op1['type'], 'value': getVariableData(op1) }
                    }
                    temp_res['value'] = TypeCastFloat(op1)
                    temp_res['type'] = 'float'
                    postfix_stack.push(temp_res)
                }
                else if (_top(op1['type']) == '*') {
                    if (op1['addr'] !== undefined) {
                        op1 = { 'type': op1['type'], 'value': getVariableData(op1) }
                    }
                    temp_res['value'] = op1['value']
                    temp_res['type'] = 'float'
                }
                else {
                    CrashNotif("cant convert this type to float")
                    return;
                }
                break;
            case '(char)':
                if (op1['type'] == 'float' ||
                    op1['type'] == 'int' ||
                    op1['type'] == 'char'
                ) {
                    if (op1['addr'] !== undefined) {
                        op1 = { 'type': op1['type'], 'value': getVariableData(op1) }
                    }
                    temp_res['value'] = TypeCastChar(op1)
                    temp_res['type'] = 'float'
                    postfix_stack.push(temp_res)
                }
                else if (_top(op1['type']) == '*') {
                    if (op1['addr'] !== undefined) {
                        op1 = { 'type': op1['type'], 'value': getVariableData(op1) }
                    }
                    temp_res['value'] = TypeCastChar({ 'value': op1['value'], "type": 'int' })
                    temp_res['type'] = 'char'
                }
                else {
                    CrashNotif("cant convert this type to char")
                    return;
                }
                break;
            case '(int)':
                if (op1['type'] == 'float' ||
                    op1['type'] == 'int' ||
                    op1['type'] == 'char'
                ) {
                    if (op1['addr'] !== undefined) {
                        op1 = { 'type': op1['type'], 'value': getVariableData(op1) }
                    }
                    temp_res['value'] = TypeCastInt(op1)
                    temp_res['type'] = 'int'
                    postfix_stack.push(temp_res)
                }
                else if (_top(op1['type']) == '*') {
                    if (op1['addr'] !== undefined) {
                        op1 = { 'type': op1['type'], 'value': getMemoryData(op1['addr']) }
                    }
                    temp_res['value'] = op1['value']
                    temp_res['type'] = 'int'
                }
                else {
                    CrashNotif("cant convert this type to int")
                    return;
                }
                break;
            case '(float*)':
            case '(char*)':
            case '(int*)':
            case '(float**)':
            case '(char**)':
            case '(int**)':
                temp_res['type'] = elem
                if (op1['type'] == 'int' ||
                    op1['type'] == 'float' ||
                    op1['type'] == 'char'
                ) {
                    if (op1['addr'] !== undefined) {
                        op1 = { 'value': getMemoryData(op1['addr']), 'type': op1['type'] }
                    }
                    temp_res['value'] = TypeCastInt(op1)
                    postfix_stack.push(temp_res)
                    return;
                }
                else if (_top(op1['type']) == '*') {
                    if (op1['addr'] !== undefined) {
                        op1 = { 'value': getMemoryData(op1['addr']), 'type': op1['type'] }
                    }
                    temp_res['value'] = op1['value']
                    postfix_stack.push(temp_res)
                    return;
                }
                else {
                    CrashNotif("Cant type cast to pointer")
                    return;
                };
            case '!':
                if (op1['addr'] === undefined) {
                    temp_res['value'] = op1['value']
                }
                else {
                    temp_res['value'] = getVariableData(op1)
                }
                temp_res['type'] = op1['type']
                if (op1['type'] == 'char') {
                    temp_res['type'] = 'char'
                    temp_res['value'] = TypeCastInt(temp_res)
                    temp_res['type'] = 'int'
                }
                if (temp_res['value'] == 0) {
                    temp_res['value'] = 1
                } else {
                    temp_res['value'] = 0
                }
                postfix_stack.push(temp_res)
                break;
            case '++post':
                if (op1['addr'] === undefined) {
                    CrashNotif("Incrementing temporary variables is not possible")
                    return
                }
                else if (op1['type']['dtype'] !== undefined) {
                    CrashNotif("Incrementing constant pointer is not possible")
                    return
                }
                else {
                    temp_res = { 'value': getVariableData(op1), 'type': op1['type'] }
                    if (_top(op1['type']) != '*') {
                        setVariableData(op1, TypeCastFloat(temp_res) + 1)
                    }
                    else {
                        setVariableData(op1, temp_res['value'] + size_of(op1['type']))
                    }
                }
                postfix_stack.push(temp_res)
                break;
            case '--post':
                if (op1['addr'] === undefined) {
                    CrashNotif("Incrementing temporary variables is not possible")
                    return
                }
                else if (op1['type']['dtype'] !== undefined) {
                    CrashNotif("Incrementing constant pointer is not possible")
                    return
                }
                else {
                    temp_res = { 'value': getVariableData(op1), 'type': op1['type'] }
                    if (_top(op1['type']) != '*') {
                        setVariableData(op1, TypeCastFloat(temp_res) - 1)
                    }
                    else {
                        setVariableData(op1, temp_res['value'] - size_of(op1['type']))
                    }
                }
                postfix_stack.push(temp_res)
                break;
            //binary operators
            default:
                op2 = op1
                op1 = postfix_stack.pop()
                if (op1 === undefined) {
                    CrashNotif("undefined value came up")
                    return
                }
                if (typeof (op1) != 'object') {
                    op1 = Variables[getVariableIndex(op1, scope)]
                    if (op1 === undefined) {
                        CrashNotif({ "error word": "Invalid Variable" })
                        return
                    }
                }
                switch (elem) {
                    case '=':
                        if (op1['addr'] === undefined) {
                            CrashNotif("Setting temporary variables is not possible")
                            return
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { "value": getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] === 'int') {
                            if (op2['type'] == 'int' ||
                                op2['type'] == 'float' ||
                                op2['type'] == 'char'
                            ) {
                                temp_res['value'] = TypeCastInt(op2)
                            } else if (_top(op2['type']) == '*' || op2['type']['dtype'] !== undefined) {
                                temp_res['value'] = op2['value']
                            } else {
                                CrashNotif("Unsupported type")
                                return
                            }
                        } else if (op1['type'] === 'float') {
                            if (op2['type'] == 'int' ||
                                op2['type'] == 'float' ||
                                op2['type'] == 'char'
                            ) {
                                temp_res['value'] = TypeCastFloat(op2)
                            } else if (_top(op2['type']) == '*' || op2['type']['dtype'] !== undefined) {
                                temp_res['value'] = op2['value']
                            } else {
                                CrashNotif("Unsupported type")
                                return
                            }
                        } else if (op1['type'] === 'char') {
                            if (op2['type'] == 'int' ||
                                op2['type'] == 'float' ||
                                op2['type'] == 'char'
                            ) {
                                temp_res['value'] = TypeCastChar(op2)
                            } else if (_top(op2['type']) == '*' || op2['type']['dtype'] !== undefined) {
                                temp_res['value'] = op2['value'] % 256
                            } else {
                                CrashNotif("Unsupported type")
                                return
                            }
                        } else if (_top(op1['type']) == '*') {
                            if (op2['type'] == 'float') {
                                CrashNotif("Requied integral type for pointer arithmetic")
                                return
                            }
                            if (op2['type'] == 'int' || _top(op2['type']) == '*' || op2['type']['dtype'] !== undefined) {
                                temp_res['value'] = op2['value']
                            }
                            if (op2['type'] == 'char') {
                                temp_res['value'] = TypeCastInt(op2)
                            }
                        }
                        else if (op1['type']['dtype'] !== undefined) {
                            CrashNotif("Cannot assign to constant pointers")
                            return
                        } else if (op1['type'] === op2['type']) {
                            // temp_res['value'] = op2['value']
                            // add struct copy feature here later
                        } else {
                            CrashNotif("Invalid type ")
                            return
                        }
                        setVariableData(op1, temp_res['value'])
                        postfix_stack.push(op1)
                        break
                    case '+=':
                        postfix_stack.push(op1);
                        postfix_stack.push(op1);
                        postfix_stack.push(op2);
                        postfix_push('+')
                        postfix_push('=');
                        break;
                    case '-=':
                        postfix_stack.push(op1);
                        postfix_stack.push(op1);
                        postfix_stack.push(op2);
                        postfix_push('-')
                        postfix_push('=');
                        break;
                    case '*=':
                        postfix_stack.push(op1);
                        postfix_stack.push(op1);
                        postfix_stack.push(op2);
                        postfix_push('*')
                        postfix_push('=');
                        break;
                    case '/=':
                        postfix_stack.push(op1);
                        postfix_stack.push(op1);
                        postfix_stack.push(op2);
                        postfix_push('/')
                        postfix_push('=');
                        break;
                    case '%=':
                        postfix_stack.push(op1);
                        postfix_stack.push(op1);
                        postfix_stack.push(op2);
                        postfix_push('%')
                        postfix_push('=');
                        break;
                    case '||':
                        temp_res['type'] = 'int'
                        temp_res['value'] = 1
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (op1['value'] == 0 && op2['value'] == 0) {
                            temp_res['value'] = 0
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '&&':
                        temp_res['type'] = 'int'
                        temp_res['value'] = 0
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (op1['value'] != 0 && op2['value'] != 0) {
                            temp_res['value'] = 1
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '==':
                        temp_res['type'] = 'int'
                        temp_res['value'] = 0
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (op1['value'] == op2['value']) {
                            temp_res['value'] = 1
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '!=':
                        temp_res['type'] = 'int'
                        temp_res['value'] = 0
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (op1['value'] != op2['value']) {
                            temp_res['value'] = 1
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '>':
                        temp_res['type'] = 'int'
                        temp_res['value'] = 0
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (op1['value'] > op2['value']) {
                            temp_res['value'] = 1
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '<':
                        temp_res['type'] = 'int'
                        temp_res['value'] = 0
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (op1['value'] < op2['value']) {
                            temp_res['value'] = 1
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '>=':
                        temp_res['type'] = 'int'
                        temp_res['value'] = 0
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (op1['value'] >= op2['value']) {
                            temp_res['value'] = 1
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '<=':
                        temp_res['type'] = 'int'
                        temp_res['value'] = 0
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (op1['value'] <= op2['value']) {
                            temp_res['value'] = 1
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '+':
                        temp_res['type'] = resolveTypes(op1['type'], op2['type'])
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (is_pointer(op1) && is_pointer(op2) == '*') {
                            CrashNotif("cant add pointers")
                        }
                        else if (is_pointer(op1) && !is_pointer(op2)) {
                            if (op1['type']['dtype'] !== undefined) {
                                let elem_size = size_of(op1['type'])
                                let result = op1['value'] + elem_size * op2['value']
                                // postfix_stack.push(result)
                                temp_res['value'] = result
                            }
                            else {
                                temp_res['value'] = op1['value'] + op2['value'] * size_of(op1['type'].slice(0, -1))
                            }
                        }
                        else if (!is_pointer(op1) && is_pointer(op2)) {
                            if (op2['type']['dtype'] !== undefined) {
                                let elem_size = size_of(op2['type'])
                                let result = op2['value'] + elem_size * op1['value']
                                // postfix_stack.push(result)
                                temp_res['value'] = result
                            }
                            else {
                                temp_res['value'] = op1['value'] * size_of(op2['type'].slice(0, -1)) + op2['value']
                            }
                        }
                        else {
                            temp_res['value'] = op1['value'] + op2['value']
                        }
                        if (temp_res['type'] == 'char') {
                            temp_res['value'] = TypeCastChar({ 'value': temp_res['value'], 'type': 'float' })
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '-':
                        temp_res['type'] = resolveTypes(op1['type'], op2['type'])
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (is_pointer(op1) && is_pointer(op2)) {
                            if (op1['type']['dtype'] === undefined && op2['type']['dtype'] === undefined) {
                                if (op1['type'] == op2['type']) {
                                    temp_res['value'] = op1['value'] - op2['value']
                                }
                            }
                            else if (op1['type']['dtype'] === undefined || op2['type']['dtype'] === undefined) {
                                CrashNotif("Subtraction between pointers and arrays is invalid")
                                return
                            }
                            else {
                                //same array or not?
                                if (op1['type']['dtype'] != op2['type']['dtype']) {
                                    CrashNotif("Subtraction between different types of arrays is invalid")
                                    return
                                }
                                if (op1['type']['dims'].length != op2['type']['dims'].length) {
                                    CrashNotif("Subtraction between different types of arrays is invalid")
                                    return
                                }
                                for (let i = 0; i < op1['type']['dims'].length; i++) {
                                    if (op1['type']['dims'][i]['value'] != op2['type']['dims'][i]['value']) {
                                        CrashNotif("Subtraction between different types of arrays is invalid")
                                        return
                                    }
                                }
                                temp_res['value'] = op1['value'] - op2['value']
                            }
                        }
                        else if (is_pointer(op1) && !is_pointer(op2)) {
                            if (op1['type']['dtype'] !== undefined) {
                                let elem_size = size_of(op1['type'])
                                let result = op1['value'] - elem_size * op2['value']
                                // postfix_stack.push(result)
                                temp_res['value'] = result
                            }
                            else {
                                temp_res['value'] = op1['value'] - op2['value'] * size_of(op1['type'].slice(0, -1))
                            }
                        }
                        else if (!is_pointer(op1) && is_pointer(op2)) {
                            if (op2['type']['dtype'] !== undefined) {
                                let elem_size = size_of(op2['type'])
                                let result = -op2['value'] + elem_size * op1['value']
                                // postfix_stack.push(result)
                                temp_res['value'] = result
                            }
                            else {
                                temp_res['value'] = op1['value'] * size_of(op2['type'].slice(0, -1)) - op2['value']
                            }
                        }
                        else {
                            temp_res['value'] = op1['value'] - op2['value']
                        }
                        if (temp_res['type'] == 'char') {
                            temp_res['value'] = TypeCastChar({ 'value': temp_res['value'], 'type': 'float' })
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '*':
                        temp_res['type'] = resolveTypes(op1['type'], op2['type'])
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (_top(op1['type']) == '*' || _top(op2['type']) == '*') {
                            CrashNotif("Arithmetic types required")
                            return
                        }
                        else {
                            temp_res['value'] = op1['value'] * op2['value']
                        }
                        if (temp_res['type'] == 'char') {
                            temp_res['value'] = TypeCastChar({ 'value': temp_res['value'], 'type': 'float' })
                        }
                        else if (temp_res['type'] == 'int') {
                            temp_res['value'] = TypeCastInt({ 'value': temp_res['value'], 'type': 'float' })
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '%':
                        temp_res['type'] = resolveTypes(op1['type'], op2['type'])
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (_top(op1['type']) == '*' || _top(op2['type']) == '*') {
                            CrashNotif("Arithmetic types required")
                            return
                        }
                        if (temp_res['type'] == 'float') {
                            CrashNotif("Cannot apply modulo on floating values")
                            return
                        }
                        else {
                            temp_res['value'] = op1['value'] % op2['value']
                        }
                        if (temp_res['type'] == 'char') {
                            temp_res['value'] = TypeCastChar({ 'value': temp_res['value'], 'type': 'float' })
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '/':
                        temp_res['type'] = resolveTypes(op1['type'], op2['type'])
                        if (op1['addr'] !== undefined) {
                            op1 = { 'value': getVariableData(op1), 'type': op1['type'] }
                        }
                        if (op2['addr'] !== undefined) {
                            op2 = { 'value': getVariableData(op2), 'type': op2['type'] }
                        }
                        if (op1['type'] == 'char') {
                            op1['value'] = TypeCastInt(op1)
                        }
                        if (op2['type'] == 'char') {
                            op2['value'] = TypeCastInt(op2)
                        }
                        if (_top(op1['type']) == '*' || _top(op2['type']) == '*') {
                            CrashNotif("Arithmetic types required")
                            return
                        }
                        else {
                            if (op2['value'] === 0) {
                                CrashNotif('Divide by Zero')
                                return
                            }
                            temp_res['value'] = op1['value'] / op2['value']
                        }
                        if (temp_res['type'] == 'char') {
                            temp_res['value'] = TypeCastChar({ 'value': temp_res['value'], 'type': 'float' })
                        }
                        else if (temp_res['type'] == 'int') {
                            temp_res['value'] = TypeCastInt({ 'value': temp_res['value'], 'type': 'float' })
                        }
                        postfix_stack.push(temp_res)
                        break;
                    case '.':
                        if (op1['addr'] === undefined) {
                            CrashNotif("Cant access temporary variable")
                            return
                        }
                        temp_res['value'] = op1['addr']
                        temp_res['type'] = op1['type'] + '*'
                        postfix_stack.push(temp_res)
                        postfix_stack.push(op2)
                        postfix_push('->')
                        break;
                    case '->':
                        if (op1['addr'] !== undefined) {
                            // CrashNotif('Cant access temporary variable')
                            op1 = { 'value': getMemoryData(op1['addr']), 'type': op1['type'], addr: op1['addr'] }
                            return
                        }
                        if (op1['type'] == "struct stack*") {
                            if (op2 == 'arr') {
                                temp_res['addr'] = op1['value']
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "int*"
                                postfix_stack.push(temp_res)
                            } else if (op2 == 'size') {
                                temp_res['addr'] = op1['value'] + 8
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "int"
                                postfix_stack.push(temp_res)
                            } else if (op2 == 'top') {
                                temp_res['addr'] = op1['value'] + 12
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "int"
                                postfix_stack.push(temp_res)

                            } else {
                                CrashNotif("No such member")
                            }
                        } else if (op1['type'] == "struct queue*") {
                            if (op2 == 'arr') {
                                temp_res['addr'] = op1['value']
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "int*"
                                postfix_stack.push(temp_res)
                            } else if (op2 == 'size') {
                                temp_res['addr'] = op1['value'] + 8
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "int"
                                postfix_stack.push(temp_res)
                            } else if (op2 == 'rear') {
                                temp_res['addr'] = op1['value'] + 12
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "int"
                                postfix_stack.push(temp_res)
                            } else if (op2 == 'front') {
                                temp_res['addr'] = op1['value'] + 16
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "int"
                                postfix_stack.push(temp_res)
                            } else {
                                CrashNotif("No such member")
                            }
                        } else if (op1['type'] == "struct sll*") {
                            if (op2 == 'next') {
                                temp_res['addr'] = op1['value']
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "struct sll*"
                                postfix_stack.push(temp_res)
                            } else if (op2 == 'info') {
                                temp_res['addr'] = op1['value'] + 8
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "int"
                                postfix_stack.push(temp_res)
                            } else {
                                CrashNotif("No such member")
                            }
                        } else if (op1['type'] == "struct dll*") {
                            if (op2 == 'next') {
                                temp_res['addr'] = op1['value']
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "struct dll*"
                                postfix_stack.push(temp_res)
                            } else if (op2 == 'prev') {
                                temp_res['addr'] = op1['value'] + 8
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "struct dll*"
                                postfix_stack.push(temp_res)
                            } else if (op2 == 'info') {
                                temp_res['addr'] = op1['value'] + 16
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "int"
                                postfix_stack.push(temp_res)
                            } else {
                                CrashNotif("No such member")
                            }
                        } else if (op1['type'] == "struct tree*") {
                            if (op2 == 'left') {
                                temp_res['addr'] = op1['value']
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "struct tree*"
                                postfix_stack.push(temp_res)
                            } else if (op2 == 'right') {
                                temp_res['addr'] = op1['value'] + 8
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "struct tree*"
                                postfix_stack.push(temp_res)
                            } else if (op2 == 'info') {
                                temp_res['addr'] = op1['value'] + 16
                                temp_res['value'] = getMemoryData(temp_res['addr'])
                                temp_res['type'] = "int"
                                postfix_stack.push(temp_res)
                            } else {
                                CrashNotif("No such member")
                            }
                        } else {
                            CrashNotif("No such Structure")
                            return
                        }
                }
        }
    }
    let exp_end = function () {
        debugger
        while (operation_stack.length > 1) {
            postfix_push(operation_stack.pop())
        }
    }
    for (let i = 0; i < tokens.length; i++) {
        let c = tokens[i]
        if (parse_mode == 0) {
            if (is_identifier(c) && tokens[i - 1] != '.' && tokens[i - 1] != '->') {
                if (tokens[i + 1] == '(') {
                    // is a function(handle later)
                }
                else {
                    temp = getVariableIndex(c, scope)
                    temp = Variables[temp]
                    conv(temp)
                }
            }
            else if (c == ';') {
                break
            }
            else {
                conv(c)
            }
        }
        else if (parse_mode == 1) {
        } else if (parse_mode == 2) {

        }
    }
    // console.log(postfix_stack)
    exp_end()
    result = postfix_stack[0]
    return result
}
// function getWord(line, StartIndex) {
//     let readmode = 0
//     let Wordstart = StartIndex, Wordend = StartIndex
//     for (let i = StartIndex; i < line.length; i++) {
//         if (readmode == 0) {
//             if (/^[ \t]$/.test(line[i])) {
//                 Wordstart++
//                 continue
//             }
//             else if (/^[a-zA-Z_]$/.test(line[i])) {
//                 readmode = 1
//             }
//             else {
//                 break;
//             }
//         }
//         else if (readmode == 1) {
//             if (/^[0-9a-zA-Z_]$/.test(line[i])) {
//                 Wordend = i
//             }
//             else {
//                 readmode = 2
//                 Wordend = i
//                 break;
//             }
//         }
//     }
//     if (readmode == 2) {
//         return { "word": line.slice(Wordstart, Wordend), "end": Wordend }
//     }
//     else if (readmode == 1) {
//         Wordend++
//         return { "word": line.slice(Wordstart, Wordend), "end": Wordend }
//     }
//     else {
//         return undefined
//     }
// }
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
function getVariableIndex(VariableName, scope) {
    let function_scope = 0
    for (let j = 0; j < Branch_stack.length; j++) {
        if (Branch_stack[j]['keyword'] == "function") {
            function_scope = Branch_stack[j]['scope']
        }
    }
    VariableName = VariableName.trim()
    for (let j = Variables.length - 1; j >= 0; j--) {
        if (Variables[j]['name'] == VariableName)//scope 0=malloced values
        {
            if ((Variables[j]['scope'] <= scope && Variables[j]['scope'] >= function_scope) || Variables[j]['scope'] == 0) {
                return j
            }
        }
    }
    return undefined
}
function deallocateOutOfScopeVariables(current_scope) {
    for (let i = Variables.length - 1; i >= 0; i--) {
        if (Variables[i]['scope'] > current_scope) {
            // removeVariable(Variables[i])
            Variables.pop(i)
        }
    }
    for (let i in Memory) {
        if (Memory[i]['scope'] > current_scope) {
            free_mem(i, true)
        }
    }
}
// function removeVariable(variable) {
//     variable['div'].remove()
// }
function CrashNotif(extra_detail) {
    if (typeof (extra_detail) == 'string') {
        extra_detail = { 'error word': extra_detail }
    }
    console.log("crashed")
    console.log(extra_detail['error word'])
    Program = []
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
        if (value['value'].charCodeAt === undefined) return value['value']
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
    // syntaxCorrection();
    let Cin = document.getElementById("Cin")
    let val = Cin.value
    deallocateOutOfScopeVariables(-1)
    Variables = []
    Branch_stack = [{ "keyword": "function", "scope": 1 }]
    functions = {}
    // console.log(val)
    // main_function_outline=/^int main\(\){\n.*\treturn 0;\n}$/
    // main_function_outline=/^int main\(\){(.|\n)*\treturn 0;\n}$/
    // main_function_outline=/(int|(.|\n)*\nint) main\(\){(.|\n)*\treturn 0;\n}$/
    main_function_outline = /^(.*\n)*int main\(\){(.|\n)*\treturn 0;\n}\s*$/
    if (main_function_outline.test(val)) {
        if (check_syntax(val)) {
            Cin_text = val
            Program = val.split("\n")

            datatypeExp = "((" + DataTypes[0] + ")"
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

function _top(arr) {
    if (arr === undefined)
        return arr
    if (arr.length === undefined)
        return undefined
    if (arr.length === 0)
        return undefined
    return arr[arr.length - 1]
}
function lineLexer(text) {
    let tokens = []
    let temp = ""
    text = text + " "
    function is_identifier(x) {
        if (x === undefined) return false
        return /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(x)
    }
    function is_int(x) {
        if (x === undefined) return false
        if (x['type'] == 'int') return true
        return /^[0-9]+$/.test(x)
    }
    function is_float(x) {
        if (x === undefined) return false
        if (x['type'] == 'float') return true
        return /^[0-9]+\.[0-9]+$/.test(x)
    }
    for (let i = 0; i < text.length; i++) {
        if (/^\s*$/.test(temp)) {
            temp = ""
        }
        if (temp.length == 0) {
            temp = text[i]
        }
        else if (temp == ';') {
            tokens.push(temp)
            temp = text[i]
        }
        else if (temp == "=") {
            if (text[i] == '=') {
                temp = "=="
                tokens.push(temp)
                temp = ""
            }
            else {
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (temp == "!") {
            if (text[i] == '=') {
                temp = "!="
                tokens.push(temp)
                temp = ""
            }
            else {
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (temp == "+") {
            if (text[i] == '=') {
                temp = "+="
                tokens.push(temp)
                temp = ""
            }
            else if (text[i] == '+') {
                temp = "++"
                if (is_identifier(_top(tokens)) || _top(tokens) == ')' || _top(tokens) == ']') {
                    temp = "++post"
                }
                else {
                    temp = "++pre"
                }
                tokens.push(temp)
                temp = ""
            }
            else {
                if (is_identifier(_top(tokens)) || _top(tokens) == ')' || _top(tokens) == ']' || is_int(_top(tokens)) || is_float(_top(tokens))) {//detect if unary or not
                }
                else {
                    temp = "+unary"
                }
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (temp == "-") {
            if (text[i] == '=') {
                temp = "-="
                tokens.push(temp)
                temp = ""
            }
            else if (text[i] == '-') {
                temp = "--"
                if (is_identifier(_top(tokens)) || _top(tokens) == ')' || _top(tokens) == ']') {
                    temp = "--post"
                }
                else {
                    temp = "--pre"
                }
                tokens.push(temp)
                temp = ""
            }
            else if (text[i] == '>') {
                temp = "->"
                tokens.push(temp)
                temp = ""
            }
            else {
                if (is_identifier(_top(tokens)) || _top(tokens) == ')' || _top(tokens) == ']' || is_int(_top(tokens)) || is_float(_top(tokens))) {//detect if unary or not
                }
                else {
                    temp = "-unary"
                }
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (temp == "%") {
            if (text[i] == '=') {
                temp = "%="
                tokens.push(temp)
                temp = ""
            }
            else {
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (temp == "/") {
            if (text[i] == '=') {
                temp = "/="
                tokens.push(temp)
                temp = ""
            }
            else if (text[i] == '/') {
                temp = "//"
                break;
                // tokens.push(temp)
                // temp = ""
            }
            else {
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (temp == "*") {
            if (text[i] == '=') {
                temp = "*="
                tokens.push(temp)
                temp = ""
            }
            else {
                if (is_identifier(_top(tokens)) ||
                    _top(tokens) == ')' ||
                    _top(tokens) == ']' ||
                    is_int(_top(tokens)) ||
                    is_float(_top(tokens)) ||
                    _top(tokens) == '++post' ||
                    _top(tokens) == '--post'
                ) {//detect if unary or not
                }
                else {
                    temp = "*deref"
                }
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (temp == "&") {
            if (text[i] == '&') {
                temp = "&&"
                tokens.push(temp)
                temp = ""
            }
            else {
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (temp == "|") {
            if (text[i] == '|') {
                temp = "||"
                tokens.push(temp)
                temp = ""
            }
            else {
                CrashNotif("Bitwise OR not supported")
                return
            }
        }
        else if (temp == '(' || temp == '[' || temp == ']' || temp == ')' || temp == '}' || temp == '{') {
            tokens.push(temp)
            temp = text[i]
        }
        else if (temp == ">") {
            if (text[i] == '=') {
                temp = ">="
                tokens.push(temp)
                temp = ""
            }
            else {
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (temp == "<") {
            if (text[i] == '=') {
                temp = "<="
                tokens.push(temp)
                temp = ""
            }
            else {
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (temp == ".") {
            tokens.push(temp)
            temp = text[i]
        }
        else if (temp == ",") {
            tokens.push(temp)
            temp = text[i]
        }
        else if (temp.indexOf("'") == 0) {
            if (temp == '\'') {
                temp += text[i]
            }
            else if (temp == '\'\\') {
                temp += text[i]
                // if (text[i] == '0' || text[i] == 'n' || text[i] == 't') {
                //     temp += text[i];
                // }
                // else {
                //     CrashNotif("Lex Error at line " + i)
                // }
            } else if (text[i] == '\'') {
                if (temp.length < 2) {
                    CrashNotif("Lex Error- invalid character at line " + i)
                    return
                }
                else {
                    temp += text[i]
                    if (temp == '\'\\0\'') {
                        temp = '\0'
                    } else {
                        // console.log(temp)
                        temp = JSON.parse(`"${temp.slice(1, -1)}"`)
                    }
                    y = tokens.push({ 'value': temp, 'type': 'char' })
                    temp = ""
                }
            }
        }
        else if (temp.indexOf('\"') == 0) {
            if (text[i] == '\"') {
                temp += '\0'
                tokens.push({ 'value': temp.slice(1), 'type': 'string' })
                temp = ""
            }
            else if (text[i] == '\\') {
                let esc = text[i] + text[i + 1]
                if (esc == '\\0') {
                    temp += '\0'
                } else if (esc == '\\t') {
                    temp += '\t'
                } else if (esc == '\\n') {
                    temp += '\n'
                }
                i++;
            } else {
                temp += text[i];
            }
        }
        else if (is_int(temp)) {
            if (/^[0-9\.]$/.test(text[i])) {
                temp += text[i]
            }
            else {
                temp = { 'value': Number(temp), 'type': 'int' }
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (is_float(temp) || is_int(temp.slice(0, -1))) {
            if (/^[0-9]$/.test(text[i])) {
                temp += text[i]
            }
            else {
                temp = { 'value': Number(temp), 'type': 'float' }
                tokens.push(temp)
                temp = text[i]
            }
        }
        else if (is_identifier(temp)) {
            if (is_identifier(temp + text[i])) {
                temp += text[i]
            }
            else {
                switch (temp) {
                    case 'STACK':
                    case 'QUEUE':
                    case 'SLL':
                    case 'DLL':
                    case 'TREE':
                        tokens.push('struct')
                        tokens.push(temp.toLowerCase())
                        tokens.push('*')
                        break;
                    case 'NULL':
                        tokens.push({ 'value': 0, 'type': 'int' })
                        break;
                    default:
                        tokens.push(temp)
                }
                temp = text[i]
            }
        }
    }
    function typecast_token_generation(tokens) {
        for (let i = tokens.length; i > 0; i--) {
            if (tokens[i] == ')') {
                // if(tokens[i-2]=="(" && (tokens[i-1]=="int" || tokens[i-1]=="float" || tokens[i-1]=="char")){
                //     tokens[i-2]='('+token[i-1]+')'
                //     tokens.splice(i-1,2)
                //     i-=2;
                // }
                let _3token = tokens[i - 2] + tokens[i - 1] + tokens[i]
                let _4token = tokens[i - 3] + tokens[i - 2] + tokens[i - 1] + tokens[i]
                let _5token = tokens[i - 4] + tokens[i - 3] + tokens[i - 2] + tokens[i - 1] + tokens[i]
                if (_3token == '(int)' || _3token == '(char)' || _3token == '(float)') {
                    tokens[i - 2] = _3token
                    tokens.splice(i - 1, 2)
                    i -= 2;
                }
                else if (_4token == '(int*)' || _4token == '(char*)' || _4token == '(float*)') {
                    tokens[i - 3] = _4token
                    tokens.splice(i - 2, 3)
                    i -= 3;
                }
                else if (_5token == '(int**deref)' || _5token == '(char**deref)' || _5token == '(float**deref)') {
                    tokens[i - 4] = '(' + tokens[i - 3] + '**)'
                    tokens.splice(i - 3, 4)
                    i -= 4;
                }
                else if (_5token == '(structstack*)' || _5token == '(structqueue*)' || _5token == '(structsll*)' || _5token == '(structdll*)' || _5token == '(structtree*)') {
                    tokens[i - 4] = '(struct ' + tokens[i - 2] + '*)'
                    tokens.splice(i - 3, 4)
                    i -= 4;
                }
            }
        }
    }
    typecast_token_generation(tokens)
    return tokens
}
function getMemoryData(mem_loc) {
    if (mem_loc in Memory) {
        let data = Memory[mem_loc]['value']
        if (typeof (data) == 'object') {
            while (typeof (data[0]) == 'object') {
                data = data[0]
            }
            if (data[0] !== undefined) {
                return data[0]
            }
            else {
                return 0
            }
        } else {
            return data
        }
    }
    else {
        let unwrap = function (obj) {
            let unwrapped_memory = {}
            for (let i in obj) {
                if (typeof (obj[i]) != "object") {
                    unwrapped_memory[i] = obj[i]
                }
                else {
                    let inner_wrap = unwrap(obj[i])
                    for (let j in inner_wrap) {
                        unwrapped_memory[Number(i) + Number(j)] = inner_wrap[j]
                    }
                }
            }
            return unwrapped_memory
        }
        for (let mem in Memory) {
            mem = Number(mem)
            if (mem <= mem_loc && mem + Memory[mem]['size'] > mem_loc) {
                let data = unwrap(Memory[mem]['value'])
                if (data[mem_loc - mem] !== undefined) {
                    return data[mem_loc - mem]
                }
                else {
                    return 0
                }
            }
        }
    }
    CrashNotif("Accessing Unallocated Memory")
}
function setMemoryData(mem_loc, value) {
    // value=TypeCastInt(value)
    // if (mem_loc in Memory) {
    //     let data = Memory[mem_loc]['value']
    //     if (typeof (data) === 'object') {
    //         data[0] = value
    //     } else {
    //         Memory[mem_loc]['value'] = value
    //     }
    //     // render_Memory()
    //     return value
    // }
    // else {
    //     for (let mem in Memory) {
    //         mem = Number(mem)
    //         if (mem <= mem_loc && mem + Memory[mem]['size'] > mem_loc) {
    //             let data = Memory[mem]['value']
    //             data[mem_loc - mem] = value
    //             // render_Memory()
    //             return value
    //         }
    //     }
    // }
    ////////////////////////////////
    if (mem_loc in Memory) {
        let data = Memory[mem_loc]['value']
        if (typeof (data) == 'object') {
            while (typeof (data[0]) == 'object') {
                data = data[0]
            }
            data[0] = value
            return value
        } else {
            Memory[mem_loc]['value'] = data
            return value
        }
    }
    else {
        let recursive_memset = function (obj, base, top, index, value) {
            let low = base, high = top
            for (let i in obj) {
                i = Number(i)
                if (base + i > index) {
                    if (base + i < high) {
                        high = base + i
                    }
                }
                else if (base + i == index) {
                    if (typeof (obj[i]) != "object") {
                        obj[i] = value
                        return value
                    }
                    obj = obj[i]
                    while (typeof (obj[0]) == 'object') {
                        obj = obj[0]
                    }
                    obj[0] = value
                    return value
                }
                else {
                    if (low < base + i) {
                        low = base + i
                    }
                }
            }
            if (typeof (obj[low - base]) != 'object') {
                obj[index - base] = value
                return value
            }
            return recursive_memset(obj[low - base], low, high, index, value)
        }
        for (let mem in Memory) {
            mem = Number(mem)
            if (mem <= mem_loc && mem + Memory[mem]['size'] > mem_loc) {
                recursive_memset(Memory[mem]['value'], mem, mem + Memory[mem]['size'], mem_loc, value)
                return value
            }
        }
    }
    CrashNotif("Accessing Unallocated Memory")
}
function setVariableData(storing_variable, value) {
    if (storing_variable === undefined) {
    }
    else if (storing_variable['addr'] === undefined) {
    }
    else {
        // if (storing_variable['type'] == '(struct stack*)' || storing_variable['type'] == '(struct queue*)' || storing_variable['type'] == '(struct sll*)'|| storing_variable['type'] == '(struct dll*)'|| storing_variable['type'] == '(struct tree*)'){

        // }
        setMemoryData(storing_variable['addr'], value)

        // if(storing_variable['type']=='float' || storing_variable['type']=='int' || _top(storing_variable['type'])=='*'){
        //     setMemoryData(storing_variable['addr'], value)
        // }
        // else if(storing_variable['type']=='char'){
        //     setMemoryData(storing_variable['addr'], TypeCastInt(setMemoryData(value)));
        // }
        // render_Variables()
        return
    }
    CrashNotif("Accessing Unallocated Memory")
}
function getVariableData(accessing_variable) {
    let temp = accessing_variable
    if (temp === undefined) {

    }
    else if (temp['type'] !== undefined && temp['type']['dtype'] !== undefined) {
        return temp['addr']
    }
    else if (temp['addr'] === undefined) {

    }
    else {
        return getMemoryData(temp['addr'])
    }
    CrashNotif({ "error word": "No Such Variable" })
}
function createVariable(variable_name, variable_type, scope) {
    if (getVariableIndex(variable_name, scope) !== undefined) {
        CrashNotif({ "error word": "Variable of same name already Exists" })
        return -1
    }
    if (variable_type['dtype'] !== undefined) {
        let total_size = variable_type['dims'].reduce((acc, val) => acc * val['value'], 1);
        let mem_loc = getStaticMemory(variable_type['dtype'], scope)
        Memory[mem_loc]['value'] = { 0: 0 }
        let temp_mem = getStaticMemory(variable_type['dtype'], scope)
        Memory[mem_loc]['value'][0] = Memory[temp_mem]['value']
        free_mem(temp_mem, true)
        for (let i = 1; i < total_size; i++) {
            let temp_mem = getStaticMemory(variable_type['dtype'], scope)
            Memory[mem_loc]['value'][Memory[mem_loc]['size']] = Memory[temp_mem]['value']
            Memory[mem_loc]['size'] = Number(Memory[mem_loc]['size']) + Number(Memory[temp_mem]['size'])
            free_mem(temp_mem, true)
        }
        Variables.push({ 'addr': mem_loc, 'name': variable_name, 'type': variable_type, 'scope': scope })
    }
    else {
        let mem_loc = getStaticMemory(variable_type, scope)
        Variables.push({ 'addr': mem_loc, 'name': variable_name, 'type': variable_type, 'scope': scope })
    }
    return Variables.length - 1
}
function malloc(size) {
    while (true) {
        let mem_loc = 6000 + Math.floor(Math.random() * 5000) * 4
        let is_valid = true;
        for (let key in Memory) {
            if (Memory.hasOwnProperty(key)) {
                if ((key > mem_loc && key < mem_loc + size) || (Number(Memory[key]['size']) + Number(key) > mem_loc && Number(Memory[key]['size']) + Number(key) < mem_loc + size)) {
                    is_valid = false
                    break;
                }
            }
        }
        if (is_valid) {
            Memory[mem_loc] = { 'value': { 0: 0 }, 'size': size, 'scope': 0 }
            return mem_loc
        }
    }
}
function getStaticMemory(type, scope) {
    let mem_loc = 2000
    for (let key in Memory) {
        if (Memory.hasOwnProperty(key)) {
            if (key >= 2000 && key <= 6000 && Number(key) + Number(Memory[key]['size']) > mem_loc) {
                mem_loc = Math.ceil((Number(key) + Number(Memory[key]['size'])) / 4) * 4
            }
        }
    }
    let size = size_of(type)
    Memory[mem_loc] = { 'value': 0, 'size': size, 'scope': scope }
    // if (type == 'char') {
    //     Memory[mem_loc]['value'] = '\0'
    // }
    // else 
    if (type == 'struct stack') {
        Memory[mem_loc]['value'] = { 0: 0, 8: 0, 12: 0 }
    }
    else if (type == 'struct queue') {
        Memory[mem_loc]['value'] = { 0: 0, 8: 0, 12: 0, 16: 0 }
    }
    else if (type == 'struct sll') {
        Memory[mem_loc]['value'] = { 0: 0, 8: 0 }
    }
    else if (type == 'struct dll') {
        Memory[mem_loc]['value'] = { 0: 0, 8: 0, 16: 0 }
    }
    else if (type == 'struct tree') {
        Memory[mem_loc]['value'] = { 0: 0, 8: 0, 16: 0 }
    }
    else if (type.slice(-2) == '**') {
        Memory[mem_loc]['value'] = { 0: 0 }
    }
    else if (type.slice(-1) == '*') {
        Memory[mem_loc]['value'] = { 0: 0 }
    }
    else if (type['dtype'] !== undefined) {
        //it's an array

    }
    return mem_loc
}
function calloc(elem_num, elem_size) {
    let mem_loc = malloc(elem_size * elem_num)
    Memory[mem_loc]['size'] = elem_size
    for (let i = 0; i < elem_num; i++) {
        Memory[mem_loc]['value'][i] = 0
    }
    return mem_loc
}
function size_of(type_name) {
    switch (type_name) {
        case 'int':
        case 'float': return 4;
        case 'char': return 1;
        case 'int*':
        case 'float*':
        case 'char*':
        case 'int**':
        case 'float**':
        case 'char**':
        case 'STACK':
        case 'struct stack*':
        case 'QUEUE':
        case 'struct queue*':
        case 'SLL':
        case 'struct sll*':
        case 'DLL':
        case 'struct dll*':
        case 'TREE':
        case 'struct tree*':
            return 8;
        case 'struct stack': return 16;
        case 'struct queue': return 20;
        case 'struct sll': return 12;
        case 'struct dll': return 20;
        case 'struct tree': return 20;
    }
    //is array
    if (type_name === undefined) return 0
    let size = size_of(type_name['dtype'])
    for (let i = 0; i < type_name['dims'].length; i++) {
        size *= type_name['dims'][i]['value']
    }
    return size
}
function free_mem(mem_loc, force) {
    if (force || mem_loc >= 6000) {
        if (mem_loc in Memory) {
            delete Memory[mem_loc]
        }
    }
}
function render_Variables() {
    if (representDiv) {
        // while(representDiv.firstChild){representDiv.removeChild(representDiv.lastChild)}
        representDiv.innerHTML = ""
        svgElement.innerHTML = ""
        svgElement.appendChild(marker)
        representDiv.appendChild(svgElement)
        let table = document.createElement("table");
        representDiv.appendChild(table);
        let insertRow = function () {
            const row = table.insertRow();
            for (let j = 0; j < 6; j++) {
                let cell = row.insertCell();
                cell.classList.add("visual_cell");
            }
        }
        // for the local variables
        let col_num = 0, row_num = 0, scope = 1
        insertRow();
        let safe_mem_access = function (mem_loc) {
            if (mem_loc in Memory) {
                let data = Memory[mem_loc]['value']
                if (typeof (data) == 'object') {
                    while (typeof (data[0]) == 'object') {
                        data = data[0]
                    }
                    if (data[0] !== undefined) {
                        return data[0]
                    }
                    else {
                        return 0
                    }
                } else {
                    return data
                }
            }
            else {
                let unwrap = function (obj) {
                    let unwrapped_memory = {}
                    for (let i in obj) {
                        if (typeof (obj[i]) != "object") {
                            unwrapped_memory[i] = obj[i]
                        }
                        else {
                            let inner_wrap = unwrap(obj[i])
                            for (let j in inner_wrap) {
                                unwrapped_memory[Number(i) + Number(j)] = inner_wrap[j]
                            }
                        }
                    }
                    return unwrapped_memory
                }
                for (let mem in Memory) {
                    mem = Number(mem)
                    if (mem <= mem_loc && mem + Memory[mem]['size'] > mem_loc) {
                        let data = unwrap(Memory[mem]['value'])
                        if (data[mem_loc - mem] !== undefined) {
                            return data[mem_loc - mem]
                        }
                        else {
                            return 0
                        }
                    }
                }
            }
            return NULL
        }
        let makeValidInnerRepresentNode = function (content) {
            if (content == NULL) {
                let innerNode = makeInnerRepresentNode()
                innerNode.style.backgroundColor = "#ed6b61"
                innerNode.textContent = "X"
                return innerNode
            }
            else {
                let innerNode = makeInnerRepresentNode()
                innerNode.textContent = content
                return innerNode
            }
        }
        let render_stack = function (variable) {
            let varNode = makeOuterRepresentNode()
            let table_cols = 3
            variable['addr']
            //code to check if memory is accessible    
            let stk_arr = safe_mem_access(getMemoryData(variable['addr']));
            let stk_size = safe_mem_access(variable['addr'] + 8);
            let stk_top = safe_mem_access(variable['addr'] + 12);
            let first_cell=undefined
            //code to detect no of rows for stack
            let table_rows = 2
            if (stk_arr !== NULL) {
                table_rows = 1 + stk_size
            }
            maketable(varNode, table_rows + 1, table_cols);
            for (let i = 0; i < table_rows - 1; i++) {
                let elem_addr = getMemoryData(variable['addr']) + size_of('int') * i
                let innerNode = makeValidInnerRepresentNode(safe_mem_access(elem_addr))
                if(first_cell === undefined) {
                    first_cell=innerNode;
                }
                setCell(varNode, innerNode, table_rows - 2 - i, 0)
            }
            let connects=[]
            let innerNode = makeValidInnerRepresentNode(safe_mem_access(variable['addr']))
            setCell(varNode, innerNode, table_rows - 1, 0)
            if(first_cell !== undefined) {
                connects=[[innerNode,first_cell,4,3]]
            }
            innerNode = makeValidInnerRepresentNode(stk_top)
            setCell(varNode, innerNode, table_rows - 1, 1)
            innerNode = makeValidInnerRepresentNode(stk_size)
            setCell(varNode, innerNode, table_rows - 1, 2)
            if (variable['name'] !== undefined) {
                let innerNode = document.createElement('p')
                innerNode.textContent = variable['name']
                setCell(varNode, innerNode, table_rows, 0)
            }
            else {
                let innerNode = document.createElement('p')
                innerNode.textContent = variable['addr']
                setCell(varNode, innerNode, table_rows, 0)
            }
            return [varNode, table_rows, table_cols,connects]
        }
        let render_queue = function (variable) {

        }
        let render_sll = function (variable) {

        }
        let render_dll = function (variable) {

        }
        let render_tree = function (variable) {

        }
        let render_array = function (variable) {
            let varNode = makeOuterRepresentNode()
            let table_cols = _top(variable['type']['dims'])['value']
            let table_rows = variable['type']['dims'].reduce((a, i) => a * i['value'], 1) / table_cols
            let elem_type = variable['type']['dtype']
            let extra_rows = 0
            let extra_cols = 0
            let connects=[]
            // console.log(elem_type,table_cols,table_rows,variable)
            if (elem_type.indexOf('struct') != -1) {
                table_rows = table_cols * table_rows
                table_cols = 1
            }
            maketable(varNode, table_rows + 1, table_cols);
            // let array_table = varNode.querySelector('table')
            // let insertRowForArray = function (rows = 1) {
            //     for (let i = 0; i < rows.length; i++) {
            //         const row = array_table.insertRow();
            //         for (let j = 0; j < table_cols; j++) {
            //             row.insertCell();
            //         }
            //     }
            // }
            for (let i = 0; i < table_rows; i++) {
                // console.log("in")
                for (let j = 0; j < table_cols; j++) {
                    let innerNode = makeInnerRepresentNode()
                    let elem_addr = variable['addr'] + size_of(elem_type) * (j + i * table_cols)
                    if (elem_type === 'int' || elem_type === 'float' || elem_type === 'char') {
                        // innerNode.innerHTML=getVariableData({"addr":elem_addr})
                        innerNode.textContent = getVariableData({ "addr": elem_addr })
                        setCell(varNode, innerNode, i, j)
                        // console.log(getVariableData({ "addr": elem_addr }))
                        continue
                    }
                    else if (elem_type.indexOf('struct') != -1) {
                        if (elem_type === 'struct stack') {
                            let elem_addr = variable['addr'] + size_of(elem_type) * (j + i * table_cols)
                            // let innerNode=makeInnerRepresentNode();
                            let rendered = render_stack({ "addr": elem_addr })
                            extra_rows += rendered[1]
                            connects.push(...rendered[3])
                            setCell(varNode, rendered[0], j + i * table_cols, 0)
                            continue
                        }
                    }
                    else if (elem_type.indexOf('**') != -1) {
                        // double pointer not yet supported
                    }
                    innerNode.textContent = getVariableData(variable)
                    setCell(varNode, innerNode, i, j)
                }
            }
            if (variable['name'] !== undefined) {
                let innerNode = document.createElement('p')
                innerNode.textContent = variable['name']
                setCell(varNode, innerNode, table_rows, 0)
            }
            else {
                let innerNode = document.createElement('p')
                innerNode.textContent = variable['addr']
                setCell(varNode, innerNode, table_rows, 0)
            }
            return [varNode, table_rows + extra_rows, table_cols + extra_cols,connects]
        }
        let render_primitive = function (variable) {
            let varNode = makeOuterRepresentNode()
            maketable(varNode, 2, 1);
            let innerNode = makeInnerRepresentNode()
            innerNode.textContent = getVariableData(variable)
            setCell(varNode, innerNode, 0, 0)
            if (variable['name'] !== undefined) {
                innerNode = document.createElement('p')
                innerNode.textContent = variable['name']
                setCell(varNode, innerNode, 1, 0)
            }
            return [varNode, 2, 1]
            // setCell(representDiv, varNode, row, col)
        }
        for (let i = 0; i < Variables.length; i++) {
            let temp = Variables[i]
            if (temp['scope'] == 0) {
                continue;
            }
            if (temp['scope'] != scope) {
                scope = temp['scope']
                if (col_num != 0) {
                    insertRow();
                    row_num++
                }
                insertRow();
                row_num++;
                col_num = 0;
            }
            // let varNode = makeOuterRepresentNode()
            if (temp['type'] == 'int' ||
                temp['type'] == 'float' ||
                temp['type'] == 'char'
            ) {
                let varNodeDetails = render_primitive(temp)
                let varNode = varNodeDetails[0]
                setCell(representDiv, varNode, row_num, col_num)
                col_num++;
                if (col_num == 6) {
                    row_num++;
                    insertRow();
                    col_num = 0;
                }
            }
            else if (temp['type']['dtype'] !== undefined) {
                if (col_num != 0) {
                    col_num = 0;
                    row_num++;
                    insertRow();
                }
                let varNodeDetails = render_array(temp)
                let varNode = varNodeDetails[0]
                setCell(representDiv, varNode, row_num, col_num)
                row_num += varNodeDetails[1];
                for (let j = 0; j < varNodeDetails[1]; j++) {
                    insertRow();
                }
                col_num = 0;
                for(let j=0 ; j < varNodeDetails[3].length; j++){
                    drawArrow(...varNodeDetails[3][j])
                }
            }
            else if (temp['type'].indexOf('**') != -1) {

            }
            else if (temp['type'].indexOf('*') != -1) {

            }
            else if (temp['type'] == "struct stack") {
                if (col_num != 0) {
                    col_num = 0;
                    row_num++;
                    insertRow();
                }
                let varNodeDetails = render_stack(temp)
                let varNode = varNodeDetails[0]
                setCell(representDiv, varNode, row_num, col_num)
                row_num += varNodeDetails[1];
                for (let j = 0; j < varNodeDetails[1]; j++) {
                    insertRow();
                }
                col_num = 0;
            }
            else if (temp['type'] == "struct queue") {
            }
            else if (temp['type'] == "struct sll") {
            }
            else if (temp['type'] == "struct dll") {
            }
            else if (temp['type'] == "struct tree") {
            }
        }
        //for the global variables
    }
}
function render_Memory() {
    if (memoryDiv) {
        memoryDiv.innerHTML = ""
        // while(memoryDiv.firstChild){console.log(memoryDiv.lastChild,tttt++);memoryDiv.removeChild(memoryDiv.lastChild)}
        let unwrap = function (obj) {
            let unwrapped_memory = {}
            for (let i in obj) {
                if (typeof (obj[i]) != "object") {
                    unwrapped_memory[i] = obj[i]
                }
                else {
                    let inner_wrap = unwrap(obj[i])
                    for (let j in inner_wrap) {
                        unwrapped_memory[Number(i) + Number(j)] = inner_wrap[j]
                    }
                }
            }
            return unwrapped_memory
        }
        let col_count = -1
        let row_num = -1
        maketable(memoryDiv, 0, 0)
        let table = memoryDiv.querySelector("table")
        let addRow = function () {
            table.insertRow().insertCell().classList.add("visual_cell");
            col_count = 0
            row_num += 1
        }
        let addCol = function () {
            if (col_count == -1 || col_count >= 5) {
                addRow()
            }
            else {
                _top(table.rows).insertCell().classList.add("visual_cell");
                col_count++;
            }
        }
        for (let i in Memory) {
            i = Number(i)
            let temp = Memory[i]
            let varNode = makeOuterMemoryNode()
            if (typeof (temp['value']) == 'object') {
                let unwrapped_memory = unwrap(temp['value'])
                maketable(varNode, 2, Object.keys(unwrapped_memory).length)
                for (let j = 0; j < Object.keys(unwrapped_memory).length; j++) {
                    let innerNode = makeInnerMemoryNode()
                    innerNode.textContent = unwrapped_memory[Object.keys(unwrapped_memory)[j]]
                    setCell(varNode, innerNode, 0, j)
                }
                innerNode = document.createElement('p')
                innerNode.textContent = i
                setCell(varNode, innerNode, 1, 0)
                addRow()
                setCell(memoryDiv, varNode, row_num, col_count)
                col_count = -1
            }
            else {
                maketable(varNode, 2, 1);
                let innerNode = makeInnerMemoryNode()
                innerNode.textContent = temp['value']
                setCell(varNode, innerNode, 0, 0)
                innerNode = document.createElement('p')
                innerNode.textContent = i
                setCell(varNode, innerNode, 1, 0)
                addCol()
                setCell(memoryDiv, varNode, row_num, col_count)

            }
            // memoryDiv.appendChild(varNode)
        }
    }
}
function is_var_declaration(tokens) {
    function is_identifier(x) {
        if (x === undefined) return false
        return /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(x)
    }
    let res = { 'is_var': true };
    let next = 0
    if (_top(tokens) != ';') {
        return { 'is_var': false }
    }
    if (DataTypes.indexOf(tokens[0]) >= 0) {
        res['type'] = tokens[0]
        next = 1
        while (tokens[next] == '*' || tokens[next] == '*deref') {
            if (DataTypes.indexOf(res['type'] + '*') >= 0) {
                res['type'] += '*'
                next++;
            }
            else {
                break;
            }
        }
    }
    else if (tokens[0] == 'struct' &&
        (['stack', 'queue', 'sll', 'dll', 'tree'].indexOf(tokens[1]) != -1)
    ) {
        res['type'] = tokens[0] + " " + tokens[1];
        next = 2
        if (tokens[2] == '*') {
            res['type'] += '*'
            next = 3
        }
    }
    else {
        return { 'is_var': false }
    }
    if (is_identifier(tokens[next])) {
        res['first variable'] = next
        next++
    } else {
        CrashNotif({ "error word": "Wrong Syntax" })
    }
    if (tokens[next] == '(') {
        return { 'is_var': false }
    }
    return res
}
// function MergeCells(table, start_row, end_row, start_col, end_col) {

// }
function syntaxCorrection() {
    debugger
    let val = document.getElementById('Cin').value.split('\n')
    let correctedProgram = ""
    for (let i = 0; i < val.length; i++) {
        let line = val[i]
        let tokens = lineLexer(line)
        if (tokens.length == 0) {
            correctedProgram += '\n'
            continue
        }
        if (tokens[0] != "for") {
            if (tokens[0] == '}' && tokens[1] == 'else') {
                let split_lines = line.split('}')
                correctedProgram += split_lines[0] + '}\n'
                let indents = line.match(/^\s*/);
                indents = indents ? indents[0] : ""
                correctedProgram += indents + split_lines[1] + '\n'
                continue
            }
            if (tokens[0] == '{') {
                correctedProgram = correctedProgram.slice(0, -1) + '{\n'
                let split_lines = line.split('{')[1]
                if (split_lines !== undefined || split_lines !== "" || /\S+/.test(split_lines)) {
                    let indents = line.match(/^\s*/);
                    indents = indents ? indents[0] : ""
                    correctedProgram += indents + split_lines + '\n'
                }
                continue
            }
            if (line.indexOf(';') == -1) {
                correctedProgram += line + '\n'
                continue
            }
            let split_lines = line.split(';')
            correctedProgram += split_lines[0] + ';\n'
            let indents = line.match(/^\s*/);
            indents = indents ? indents[0] : ""
            for (let j = 1; j < split_lines.length; j++) {
                if (/^\s*$/.test(split_lines[j])) {
                }
                else {
                    correctedProgram += indents + split_lines[j] + ';\n'
                }
            }
        }
        else {
            correctedProgram += line + '\n'
        }
    }
    document.getElementById("Cin").value = correctedProgram
    Cin_text = correctedProgram
}


function drawArrow(fromElement, toElement, fromEdge = 2, toEdge = 0) {
    /*
    edge: 0=left, 1=top, 2=right, 3=bottom, 4= center
    */
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    const representDivRect = representDiv.getBoundingClientRect();
    let startX = 0, startY = 0, endX = 0, endY = 0;
    switch (fromEdge) {
        case 0:
            startX = fromRect.left - representDivRect.left;
            startY = fromRect.top - representDivRect.top + fromRect.height / 2;
            break;
        case 1:
            startX = fromRect.left - representDivRect.left + fromRect.width / 2;
            startY = fromRect.top - representDivRect.top;
            break;
        case 2:
            startX = fromRect.right - representDivRect.left;
            startY = fromRect.top - representDivRect.top + fromRect.height / 2;
            break;
        case 3:
            startX = fromRect.left - representDivRect.left + fromRect.width / 2;
            startY = fromRect.bottom - representDivRect.top;
            break;
        case 4:
            startX = fromRect.left - representDivRect.left + fromRect.width / 2;
            startY = fromRect.top - representDivRect.top + fromRect.height / 2;
            break;
    }
    switch (toEdge) {
        case 0:
            endX = toRect.left - representDivRect.left;
            endY = toRect.top - representDivRect.top + toRect.height / 2;
            break;
        case 1:
            endX = toRect.left - representDivRect.left + toRect.width / 2;
            endY = toRect.top - representDivRect.top;
            break;
        case 2:
            endX = toRect.right - representDivRect.left;
            endY = toRect.top - representDivRect.top + toRect.height / 2;
            break;
        case 3:
            endX = toRect.left - representDivRect.left + toRect.width / 2;
            endY = toRect.bottom - representDivRect.top;
            break;
        case 4:
            endX = toRect.left - representDivRect.left + toRect.width / 2;
            endY = toRect.top - representDivRect.top + toRect.height / 2;
            break;
    }
    // const endX = toRect.left - representDivRect.left;
    // const endY = toRect.top - representDivRect.top + toRect.height / 2;
    svgElement.style.height = representDiv.scrollHeight;
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
    arrow.setAttribute("x1", startX);
    arrow.setAttribute("y1", startY);
    arrow.setAttribute("x2", endX);
    arrow.setAttribute("y2", endY);
    arrow.setAttribute("stroke", "black");
    arrow.setAttribute("stroke-width", "2");
    arrow.setAttribute("marker-end", "url(#arrowhead)");
    arrow.style.zIndex = 4;

    svgElement.appendChild(arrow);
}

const stacks_struct = "\nstruct stack{\n\tint * arr;\n\tint size,top;\n};\ntypedef struct stack * STACK;\n\nSTACK getStack(int size){\n\tSTACK x;\n\tx=(STACK)malloc(sizeof(struct stack));\n\tif(x==NULL){\n\t\t// Memory error\n\t\texit(0);\n\t}\n\tx->top=-1;\n\tx->size=size;\n\tx->arr=(int *)malloc(sizeof(int)*size);\n\treturn x;\n}\n\n"
const queue_struct = "\nstruct queue{\n\tint * arr;\n\tint size,rear,front;\n};\ntypedef struct queue * QUEUE;\n\nQUEUE getQueue(int size){\n\tQUEUE x;\n\tx=(QUEUE)malloc(sizeof(struct queue));\n\tif(x==NULL){\n\t\t// Memory error\n\t\texit(0);\n\t}\n\tx->front=-1;\n\tx->rear=0;\n\tx->size=size;\n\tx->arr=(int *)malloc(sizeof(int)*size);\n\treturn x;\n}\n\n"
const SLL_struct = "\nstruct sll{\n\tstruct sll * next;\n\tint info;\n};\ntypedef struct sll * SLL;\n\nSLL getSll(){\n\tSLL x;\n\tx=(SLL)malloc(sizeof(struct sll));\n\tif(x==NULL){\n\t\t// Memory error\n\t\texit(0);\n\t}\n\tx->next=NULL;\n\tx->info=0;\n\treturn x;\n}\n\n"
const DLL_struct = "\nstruct dll{\n\tstruct dll * next;\n\tstruct dll * prev;\n\tint info;\n};\ntypedef struct dll * DLL;\n\nDLL getDll(){\n\tDLL x;\n\tx=(DLL)malloc(sizeof(struct dll));\n\tif(x==NULL){\n\t\t// Memory error\n\t\texit(0);\n\t}\n\tx->next=NULL;\n\tx->prev=NULL;\n\tx->info=0;\n\treturn x;\n}\n\n"
const Tree_Struct = "\nstruct tree{\n\tstruct tree * left;\n\tstruct tree * right;\n\tint info;\n};\ntypedef struct tree * TREE;\n\nTREE getTree(){\n\tTREE x;\n\tx=(TREE)malloc(sizeof(struct tree));\n\tif(x==NULL){\n\t\t// Memory error\n\t\texit(0);\n\t}\n\tx->left=NULL;\n\tx->right=NULL;\n\tx->info=0;\n\treturn x;\n}\n\n"
var functions = {}
var Cin_text = "int main(){\n\treturn 0;\n}"
const NULL = Object.freeze({ 'addr': 0, 'name': "NULL", 'value': 0, 'type': 'void', 'scope': 0, 'div': 0 })
var Variables = []
var Memory = {}
var Branch_stack = [{ "keyword": "function", "scope": 1 }]
var DataTypes = ["int",
    "float",
    "char",
    "int*",
    "char*",
    "float*",
    "struct stack",
    "struct queue",
    "struct sll",
    "struct dll",
    "struct tree",
    "struct stack*",
    "struct queue*",
    "struct sll*",
    "struct dll*",
    "struct tree*",
    "SLL",
    "DLL",
    "TREE",
    "STACK",
    "QUEUE"
]
var Program = []
var datatypeExp = ""
// var scope=0
var sleepTime = 1000
var PAUSE_EXEC = false
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
    main_function_outline = /^(.*\n)*int main\(\){(.|\n)*\treturn 0;\n}\s*$/
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

// Add a marker for the arrowhead
const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svgElement.setAttribute("id", "arrow-svg")
svgElement.style.width = "100%"
svgElement.style.minHeight = "100%"
svgElement.style.height = "auto"
svgElement.setAttribute("position", "relative")
svgElement.setAttribute("top", "0px")
svgElement.setAttribute("left", "0px")
svgElement.style.zIndex = 3;
const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
marker.setAttribute("id", "arrowhead");
marker.setAttribute("markerWidth", "10");
marker.setAttribute("markerHeight", "7");
marker.setAttribute("refX", "10");
marker.setAttribute("refY", "3.5");
marker.setAttribute("orient", "auto");

const arrowheadPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
arrowheadPath.setAttribute("d", "M0,0 L10,3.5 L0,7 Z");
arrowheadPath.setAttribute("fill", "black");

marker.appendChild(arrowheadPath);
svgElement.appendChild(marker);
