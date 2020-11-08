import React, {Component} from 'react';
import * as _ from "lodash";
import SortableTree from "react-sortable-tree";
import 'react-sortable-tree/style.css';
import '../css/ASTVisualizer.css'
import ViewSimd from "../ASMComponents/ViewSimd";
import description from './descriptions.json';
//const file=require('./descriptions.txt');
//var file = File.createFromFileName("./descriptions.txt");
//const intrinsics=["vpslldq","vpaddd","vpsubd","vpalignr"];
/*
function extractregisters(props){
    var instructions = props.asm[0].body;
    var instructionslen = instructions.length;
    var registersset = new Set();
    for(var i = 0; i < instructionslen; i++) {
        var ins = instructions[i];
        for(var r of ins.params) {
            registersset.add(r);
        }
    }
    return registersset;

}*/
function registerFromParam(params){
    var Reg=[];
    for(var i=0; i<params.length; i++){
        if(params[i][0]=="x"||params[i][0]=="y"||params[i][0]=="z"){//we are just concern by the SIMD registers they start by X, Y or Z
            Reg.push(params[i])
        }
    }
    return Reg
}/*
function extractRegistersAndInst(props){// this function extracts the registers used and for each of these registers, the instructions that it uses.
    var registersAndInst=[];
    for(var i=0; i<props.asm[0].body.length; i++){
        let register=registerFromParam(props.asm[0].body[i].params);
        for(var j=0; j<register.length; j++){
            var regOb={register:null, instructions:[]};
            if (registersAndInst.filter(obj=>obj.register==register[j]).length==0){
                regOb.register=register[j];              
                regOb.instructions.push(props.asm[0].body[i].name);
                registersAndInst.push(regOb)
            }
            else{
                for(var k=0; k<registersAndInst.length; k++){
                    if(registersAndInst[k].register==register[j] && registersAndInst[k].instructions.indexOf(props.asm[0].body[i].name)==-1){
                        registersAndInst[k].instructions.push(props.asm[0].body[i].name);
                        break; //because they are not duplicated element
                    }
                }
            } 
        }
    }
    return registersAndInst.sort((a,b)=>a.register>b.register)
}
*/

function extractInstAndRegisters(props){//this function return a table of quatriples {id, intrinsic, registers, line}. In fact it is from such sorted quatriplets on the id that will be built the dynamic visualization of registers ( SIMD registers only). registers (an array) in each triple is sort by the order of used (of a given register)
        var instAndRegisters=[], id=0;
        for(var i=0; i<props.asm[0].body.length; i++){
            let obj={id:null, intrinsic:"", registers:[], line:null};
            if(registerFromParam(props.asm[0].body[i].params).length!=0){
                [obj.id,obj.intrinsic,obj.registers, obj.line]=[id,props.asm[0].body[i].name,registerFromParam(props.asm[0].body[i].params),props.asm[0].body[i].line ];
                instAndRegisters.push(obj);
                id++
            }
        }
        return instAndRegisters.sort((a,b)=>a.id>b.id)        
}
/*
function buildDescriptionTable(arrayOfObjectOfInstruction, arrayOfDescriptions){//This function takes an array of instructions (objects) and returns an array of objects. Input instructions (objects) are in the form {id: "", intrinsic: "", registers: []}. The output description (objects) are in the form {intrinsic: "", description: "text",operation:""}
        var tabDescriptions=[]
        arrayOfObjectOfInstruction.forEach(element => {
            if(!tabDescriptions.find(e=>e.intrinsic==element.intrinsic)){
                if(arrayOfDescriptions.find(x=>"instruction" in x && x.instruction[0].$.name==element.intrinsic)){
                    let intrinsic=element.intrinsic
                    let description=arrayOfDescriptions.find(x=>"instruction" in x && x.instruction[0].$.name==element.intrinsic).description[0]
                    let operation=arrayOfDescriptions.find(x=>"instruction" in x && x.instruction[0].$.name==element.intrinsic).operation[0]
                    tabDescriptions=[{intrinsic:intrinsic, description:description, operation:operation},...tabDescriptions]
                }
            }
        });
        return tabDescriptions
}*/

function buildDescriptionTable(arrayOfObjectOfInstruction, ObjectOfDescriptions){//This function takes an array of instructions (objects) and an Object of intrinsic objects, then returns an array of objects. Input instructions (objects) are in the form {id: "", intrinsic: "", registers: []}. The output description (objects) are in the form {intrinsic: "", description: "text"}
        var tabDescriptions=[]
        arrayOfObjectOfInstruction.forEach(element => {
            if(!tabDescriptions.find(e=>e.intrinsic.toLowerCase()==element.intrinsic)){
                if(Object.keys(ObjectOfDescriptions.instructions).find(x=>x.toLowerCase()==element.intrinsic)){
                    let intrinsic=Object.keys(ObjectOfDescriptions.instructions).find(x=>x.toLowerCase()==element.intrinsic)
                    let description=ObjectOfDescriptions.instructions[intrinsic].summary
                    tabDescriptions=[{intrinsic:intrinsic, description:description},...tabDescriptions]
                }
            }
        });
        return tabDescriptions
}


/*
function transformIntrInRegister(anIntrObj){
    var newArray=[]
    while(anIntrObj.registers.length){
        let obj={register:anIntrObj.registers.pop(),instructions:[]}
        if(!newArray.filter(x=>x.register==obj.register)){//an entry with this register is not yet in the newArray
            let reGobj={intrinsic:"",id:null, idr:null}
            reGobj.intrinsic=anIntrObj.intrinsic
            reGobj.id=anIntrObj.id
            reGobj.idr=anIntrObj.registers.length
            obj.instructions.push(reGobj)
            for(let i=anIntrObj.registers.length; i>0; i--){
                if(anIntrObj.registers[anIntrObj.registers.length-1]==obj.register){//the register is use again
                    let anotherReGobj={intrinsic:"",id:null, idr:null}
                    anotherReGobj.intrinsic=anIntrObj.intrinsic
                    anotherReGobj.id=anIntrObj.id
                    anotherReGobj.idr=i
                    obj.instructions.push(anotherReGobj)
                }
            }
            newArray.push(obj)
        }
        else //an entry with this register is already in the newArray
        {
            let reGobj={intrinsic:"",id:null, idr:null}
            reGobj.intrinsic=anIntrObj.intrinsic
            reGobj.id=anIntrObj.id
            reGobj.idr=anIntrObj.registers.length
            if(!(newArray.filter(x=>x.register==obj.register).instructions.filter(x=>x.id==reGobj.id && x.intrinsic==reGobj.intrinsic && x.idr==reGobj.idr))){//the object {id, intrinsic, idr} is not yet in the register instructions
                newArray.filter(x=>x.register==obj.register).instructions.push(reGobj)
            }
            for(let i=anIntrObj.registers.length; i>0; i++){
                if((anIntrObj.registers[anIntrObj.registers.length-1]==obj.register)&&(!(newArray.filter(x=>x.register==obj.register).instructions.filter(x=>x.id==anIntrObj.id && x.intrinsic==anIntrObj.intrinsic && x.idr==i)))){
                    let anotherReGobj={intrinsic:"",id:null, idr:null}
                    anotherReGobj.intrinsic=anIntrObj.intrinsic
                    anotherReGobj.id=anIntrObj.id
                    anotherReGobj.idr=i
                    newArray.filter(x=>x.register==obj.register).instructions.push(anotherReGobj)
                }
            }
        }

    }
    return newArray
}
*/
class ViewRegister extends Component {
    constructor(props) {
        super(props);
        this.instructions=extractInstAndRegisters(props)
        this.description=buildDescriptionTable(this.instructions,description)
        //this.registers=instructionsByRegisterBySteps(extractInstAndRegisters(props))

/*
        var instructions = this.props.asm[0].body;
        var instructionslen = instructions.length;
        var registersset = new Set();
        for(var i = 0; i < instructionslen; i++) {
            var ins = instructions[i];
            console.log(ins.params);
            for(var r of ins.params) { 
                registersset.add(r); 
            }
        }
        
        for(var r of registersset) {
            console.log(r);
        }

        console.log(this.props.asm[0].body[0], "dans le state")
        this.state = {
            registers: registersset
        };
*/
this.state = {
    register: "",
    dynamicMessage:""
};

    }
    
    componentDidMount() {
      //  this.setState({treeData: this.buildTree(this.props.ast)})
    }

    componentWillReceiveProps(nextProps) {
        //this.setState({treeData: this.buildTree(nextProps.ast)})
    }
/*
    recursiveBuilder = (node) => {
        let children = getChildren(node);
        let tree = [];
        if (children === [])
            return children;
        children.forEach((child) => {
            tree.push({
                title: getLabel(child),
                children: this.recursiveBuilder(child),
                expanded: true,
                type: child.type,
                start: child.start,
                end: child.end
            });
        });
        return tree
    };

    buildTree = (ast) => {
        let tree = [];
        tree.push({
            title: getLabel(ast),
            children: this.recursiveBuilder(ast),
            expanded: true,
            type: ast.type,
            start: ast.start,
            end: ast.end
        });
        return tree
    };

    highlightCode = (start, end) => {
        let codeEditor = this.props.cm.current.editor.doc;
        const fromIndex = codeEditor.posFromIndex(start);
        const toIndex = codeEditor.posFromIndex(end);
        codeEditor.markText(fromIndex, toIndex, {
            className: 'highlighted-code'
        });
    };

    clearHighlightedCode = () => {
        this.props.cm.current.editor.doc.getAllMarks().forEach((m) => {
            m.clear()
        })
    };
*/



    render() {

        /*return (
            <div>`test {this.state.registers}` </div>
            
        );*/
        return (
            <div>
                <ViewSimd instructions= {this.instructions} asm={this.props.asm} cm={this.props.cm} description={this.description} simdFunction={this.props.simdFunction}/>                
            </div>
            );
    }
}
export default ViewRegister;