async function interpret(text){
    let lines=text.split("\n")
    datatypeExp="(("+DataTypes[0]+")"
    for(let i=1;i<DataTypes.length;i++){
        datatypeExp+="|("+DataTypes[i]+")"
    }
    datatypeExp+=")"
    const variableExp="[a-zA-Z_][a-zA-Z0-9_]*"
    
    // datatypeExp="d"
    // variableExp="v"

    regex_of_function=new RegExp("^\\s*"+datatypeExp+" +"+variableExp+"\\(( *("+datatypeExp+" +"+variableExp+" *, *)*( *"+datatypeExp+" +"+variableExp+") *)?"+"\\)\\{ *$")
    regex_var_decl=new RegExp("^\\s*"+datatypeExp+" +("+variableExp+" *(=[\\S\\s]+)? *, *)*"+variableExp+"(=[\\S\\s]+)?;")
    const regex_assign=new RegExp("^\\s*"+variableExp+" *=[\\S\\s]+;")
    const regex_return=new RegExp("^\\s*return *( [\\S\\s]*)?;")
    let main_function_pointer=0
    for(let i=0;i<lines.length;i++){
        let line=lines[i].trim()
        if(line==="int main(){"){
            main_function_pointer=i+1
            break
        }
    }
    let scope=1
    for(let i=main_function_pointer;i<lines.length-2;i++){
        await sleep(1000);
        let line=lines[i].trim()
        if(regex_var_decl.test(line)){
            let type_data=line.match(datatypeExp)
            let var_names=line.slice(type_data['index']+type_data[0].length,-1).split(",")
            console.log(var_names)
            for(let j=0;j<var_names.length;j++){
                // varnames[j].match(variableExp)
                let var_name=var_names[j].split("=")[0].trim()
                let var_data=0
                if (var_names[j].split("=")[1]){
                    var_data=var_names[j].split("=")[1]
                    if(type_data[0]=="int"){
                        if (var_data.match(/^(-)?[0-9]+$/)){
                            var_data=parseInt(var_data)
                        }
                        else{
                            console.log("crashed, int mismatch")
                            return
                        }
                    }
                    else if(type_data[0]=="float"){
                        if (var_data.match(/^(-)?[0-9]+(.[0-9]+)?$/)){
                            var_data=parseFloat(var_data)
                        }
                        else{
                            console.log("crashed, float mismatch")
                            return
                        }    
                    }
                    else if(type_data[0]=="char"){
                        if (var_data.match(/^'\S'$/)){
                            var_data=var_data[1]
                        }
                        else{
                            console.log("crashed, char mismatch")
                            return
                        }    
                        
                    }else{
                        console.log(type_data[0])
                        console.log("Can only initialize int,float or char variables during declaration")
                        return;
                    }
                }
                else if(type_data!="int" && type_data!="float"){
                    if(type_data=='char'){
                        var_data='\0'
                    }
                    else{
                        var_data=NULL
                    }
                }
                for(let k=0;k<Variables.length;k++){
                    if(Variables[k]['name']==var_name && (Variables[k]['scope']==scope || Variables[k]['scope']==0)){
                        console.log("Crashed")
                        return
                        //crashed
                    }
                }
                
                console.log("made var")
                Variables.push({'addr':0,'name':var_name,'value':var_data,'type':type_data[0],'scope':scope,'div':makeNode(0,var_name+":"+var_data)})
            }
        }
        else if(regex_assign.test(line)){
            let var_name=line.split("=")[0]
            let var_data=line.split("=")[1].slice(0,-1)
            let match=undefined
            for (let j=0;j<Variables.length;j++){
                if (Variables[j]['name']==var_name && (Variables[j]['scope']==scope || Variables[j][scope]==0))//scope 0=malloced values
                {
                    match=j
                    break
                }
            }
            if (match===undefined){
                console.log("Crashed")
                return;
                //crashed program
            }
            else{
                let type_data=Variables[match]['type']
                if(type_data=="int"){
                    if (var_data.match(/^(-)?[0-9]+$/)){
                        Variables[match]['value']=parseInt(var_data)
                        Variables[match]['div'].innerHTML=Variables[match]['addr']+"|"+Variables[match]['name']+":"+Variables[match]['value']
                    }
                    else{
                        console.log("crashed, int mismatch")
                        return
                    }
                }
                else if(type_data=="float"){
                    if (var_data.match(/^(-)?[0-9]+(.[0-9]+)?$/)){
                        Variables[match]['value']=parseFloat(var_data)
                        Variables[match]['div'].innerHTML=Variables[match]['addr']+"|"+Variables[match]['name']+":"+Variables[match]['value']
                    }
                    else{
                        console.log("crashed, float mismatch")
                        return
                    }    
                }
                else if(type_data=="char"){
                    if (var_data.match(/^'\S'$/)){
                        Variables[match]['value']=var_data[1]
                        Variables[match]['div'].innerHTML=Variables[match]['addr']+"|"+Variables[match]['name']+":"+Variables[match]['value']
                        
                    }
                    else{
                        console.log("crashed, char mismatch")
                        return
                    }    
                    
                }else{

                }
            }

        }
    }
    // console.log(lines)
}
function regexQuote(s) { return s.replace(/[\[\]^$*+?{}.|\\]/g, "\\$&") }
function compile() {
    let nodes=document.getElementsByClassName("Node")
    for(let i=nodes.length-1;i>=0;i--){
        nodes[i].parentElement.removeChild(nodes[i])
    }
    Variables=[]
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
var DataTypes=["int","float","char"]
const NULL=0 
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
    },0)
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
setTimeout(() => {
    // document.getElementById("Cin").value=stacks_struct+document.getElementById("Cin").value;
    document.getElementById("Cin").addEventListener('keydown', handleKey, true);
}, 100);


