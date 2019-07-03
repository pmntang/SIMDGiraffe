import React, {Component} from "react";
import * as _ from "lodash";
import "../css/VectorRegister.css";
//import {convertToStrings} from "../Utils/Converter";


function instructionsByRegisterBySteps(arrayOfObject){//objects are quatriples {id, intrinsic, line, registers}
            var newArray=[]
            arrayOfObject.map(function (anIntrObj){          
                for(let i=0; i<anIntrObj.registers.length; i++){
                    var obj={register:"", instructions:[]}
                    let objInstr={id:anIntrObj.id, intrinsic:anIntrObj.intrinsic, line:anIntrObj.line, idr:anIntrObj.registers.length-i}
                    let register=anIntrObj.registers[i]
                    obj.register=register
                    obj.instructions.push(objInstr)
                    if(newArray.find(x=>x.register==obj.register)){
                        if(!(newArray.find(x=>x.register==obj.register).instructions.find(x=>x.id==objInstr.id && x.intrinsic==objInstr.intrinsic && x.idr==objInstr.idr))){
                            newArray.find(x=>x.register==obj.register).instructions.push(objInstr)
                        }
                    }
                    else{
                        newArray.push(obj)
                    }
                }
        })
        return newArray.sort((a,b)=>a.register > b.register)
}

function searchInstruction (id, idr, tab){//this function extracts from an array of objects (tab) { register:, instructions:} an object in the form {instruction:, register: } corresponding to the criteria passed to it as a parameter (id, idr,tab). the property instructions is an array of triples
    var varInstruction=null
    tab.find(function(obj){
        return obj.instructions.find(function(instruction){
          varInstruction=(instruction.id==id && instruction.idr==idr)?{ register:obj.register, instruction:instruction}:null
          return instruction.id==id && instruction.idr==idr  
        })
    })
    return varInstruction
}

function displayWindow(aWindow){// aWindow is an object {id:, idr:, tab}. This function construct an object {id:, idr:, name:, register:} based on aWindow
    var objectTodisplay={}, currentWindow=null;
    if(searchInstruction (aWindow.id, aWindow.idr, aWindow.tab)){
        currentWindow= searchInstruction (aWindow.id, aWindow.idr, aWindow.tab);
        objectTodisplay.id=currentWindow.instruction.id;
        objectTodisplay.idr=currentWindow.instruction.idr;
        objectTodisplay.name=currentWindow.instruction.intrinsic;
        objectTodisplay.register=currentWindow.register;
    }
    return objectTodisplay
}

function advanceWindow(aWindow){// This function makes it possible to go from one step in the execution of an instruction to the next step, or from one instruction to the next when all the steps of the current instruction are exhausted. At the last step of the last instruction of the program been retrieved, it starts again and returns the first step of the first instruction of the program been retrieved. The continuous application of this function therefore generates cyclical data.
    return searchInstruction(aWindow.id, aWindow.idr+1, aWindow.tab)?{id:aWindow.id, idr:aWindow.idr+1, tab:aWindow.tab}:(searchInstruction(aWindow.id+1,1, aWindow.tab)?{id: aWindow.id+1 ,idr:1, tab:aWindow.tab}:{id:0,idr:1,tab:aWindow.tab})
}
function message(aWindow){//this function generate a message in the form of and object {head:, body}. the body contains a html element containing a text to display. The text is construct based on aWindow. the property head contains the name of the correspondant register.
    const styleText={color:"#86DE74"}//style of the text to display, except the name of the instruction (which is displaye in the same style as the id and idr)
    const styleId={color:"#FF7DE9"}
    var messageContent=displayWindow(aWindow)//Below we identify the paragraph (tag p) with the id of aWindow messageContent.id as we will use this id to set the same color for the paragraph having the same id
    var message={head:messageContent.register, body:<p className={messageContent.id} ><span style={styleText}>instruction:</span> <span style={styleId}>{messageContent.id}</span><br/><span style={styleText}>step:</span> <span style={styleId}>{messageContent.idr}</span><br/><span style={styleId}>{messageContent.name}</span></p>}
    return message
}

function pickStep(instNumber, arrayOfInstructions){//takes an array of instructions and an instruction number, then returns an array consisting of the steps of the instruction whose number was given.here an instruction is a triple {id:, name:, idr:, line}
return arrayOfInstructions.reduce((acc, curr)=> (curr.id==instNumber) ? [curr.idr,...acc] : acc, []); 
}

function extractStepRegAtInst(aRegister, anArrayOfRegisters, instNumber){// extract from an array of register the steps of an instruction executed on this register.this instruction is identified by its id. returns null if no step of this instruction is executed on this register.
    return anArrayOfRegisters.find(e=>e.register==aRegister)?pickStep(instNumber, anArrayOfRegisters.find(e=>e.register==aRegister).instructions):null
}

function buildMatrixRegInt(anArrayOfRegisters, anArrayOfInstructions){ 
    let augMentArrayOfReg=[{register:"NAME"},...anArrayOfRegisters]
    let matrix=augMentArrayOfReg.map(e=>new Array(anArrayOfInstructions.length+1).fill(e.register))
    matrix=matrix.map(r=>(r[0]=="NAME")? (r.map((c,i)=>(i==0)?r[0]:{name:""+anArrayOfInstructions[i-1].intrinsic, line:anArrayOfInstructions[i-1].line})):(r.map((c, i)=>(i==0)?r[0]:extractStepRegAtInst(c, anArrayOfRegisters, i-1))) )
    return matrix[0].map((x,i)=>matrix.map(x=>x[i])) //this is to transpose
}

function searchStep(lineIndex, columnIndex, aMatrix){
    return lineIndex>0 && columnIndex>=0 && lineIndex<aMatrix.length && columnIndex<aMatrix[0].length && (aMatrix[lineIndex][columnIndex].length>0||(aMatrix[lineIndex][columnIndex]!==null && !Array.isArray(aMatrix[lineIndex][columnIndex])))
  }
  
  function advanceMatrixWindow(lineIndex, columnIndex, aMatrix){//Advance the window to the next step of an instruction or until the next instruction.
    return {value:searchStep(lineIndex, columnIndex+1, aMatrix)?aMatrix[lineIndex][columnIndex+1]:
                  ((lineIndex>=aMatrix.length-1 && columnIndex>=aMatrix[0].length-1 && searchStep(1,0,aMatrix))?aMatrix[1][0]:
                    (((lineIndex>=aMatrix.length-1 && columnIndex>=aMatrix[0].length-1)||(lineIndex<=0 ||columnIndex<0))?advanceMatrixWindow(1,0,aMatrix).value:
                      ((columnIndex>=aMatrix[0].length-1 && searchStep(lineIndex+1,0, aMatrix))?aMatrix[lineIndex+1][0]:
                       ((columnIndex>=aMatrix[0].length-1 && lineIndex<aMatrix.length-1)?advanceMatrixWindow(lineIndex+1, 0, aMatrix).value:
                        ((lineIndex>=aMatrix.length-1 && searchStep(aMatrix.length-1, columnIndex+1, aMatrix))?aMatrix[aMatrix.length-1][columnIndex+1]:
                         (advanceMatrixWindow(lineIndex, columnIndex+1, aMatrix).value)))))),
            indexes:searchStep(lineIndex, columnIndex+1, aMatrix)?[lineIndex,columnIndex+1]:
                    ((lineIndex>=aMatrix.length-1 && columnIndex>=aMatrix[0].length-1 && searchStep(1,0,aMatrix))?[1,0]:
                      (((lineIndex>=aMatrix.length-1 && columnIndex>=aMatrix[0].length-1)||(lineIndex<=0 ||columnIndex<0))?advanceMatrixWindow(1,0,aMatrix).indexes:
                       ((columnIndex>=aMatrix[0].length-1 && searchStep(lineIndex+1,0, aMatrix))?[lineIndex+1,0]:
                        ((columnIndex>=aMatrix[0].length-1 && lineIndex<aMatrix.length-1)?advanceMatrixWindow(lineIndex+1, 0, aMatrix).indexes:
                          ((lineIndex>=aMatrix.length-1 && searchStep(aMatrix.length-1, columnIndex+1, aMatrix))?[aMatrix.length-1,columnIndex+1]:
                           (advanceMatrixWindow(lineIndex, columnIndex+1, aMatrix).indexes))))))
    }
  
  }
  
  
  function retrievePosition(aPosition, aMatrix){
    if (aPosition.rank==0){//we are at the first column (index 0)
      return <th className="intrinsicName"   rowspan="3" scope="rowgroup"><span className="intrinsicName">{aMatrix[aPosition.line][aPosition.column].name.toUpperCase()}</span></th>
    }
    else 
      if(aMatrix[aPosition.line][aPosition.column].length==1){
        if(aPosition.rank==buildNonNulPositionsLine(aPosition.line, aMatrix).length-1){
          return <React.Fragment><td ><span className="empty"></span>a</td><td ><span className="empty"></span>a</td><td className="out"><span className="out">&#x21D9;</span></td></React.Fragment>
        }
        else
          {
            return <React.Fragment><td className="in"><span className="in">&#x21D7;</span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></React.Fragment>
          }
      }
      else 
        if(aMatrix[aPosition.line][aPosition.column].length==2){
          if(aPosition.rank==buildPosition(aPosition.line,aPosition.column,aMatrix)[0].rank){
            return <React.Fragment><td className="in"><span className="in">&#x21D7;</span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></React.Fragment>
          }
          else
          {
            return <React.Fragment><td className="in"><span className="in">&#x21D7;</span></td><td ><span className="empty"></span></td><td className="out"><span className="out">&#x21D9;</span></td></React.Fragment>
          }
        }
  }

  function retrieveLinePosition(aPosition, aMatrix){
    return<tr>{aMatrix[aPosition.line].map((x,j)=>searchStep(aPosition.line,j,aMatrix)?
                (buildPosition(aPosition.line,j, aMatrix)[buildPosition(aPosition.line,j, aMatrix).length-1].rank<=aPosition.rank?retrievePosition(buildPosition(aPosition.line,j, aMatrix)[buildPosition(aPosition.line,j, aMatrix).length-1], aMatrix):
                  (buildPosition(aPosition.line,j, aMatrix)[0].rank<=aPosition.rank?retrievePosition(buildPosition(aPosition.line,j, aMatrix)[0], aMatrix):<td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td>)}</tr>
  }
  function buildPosition(indexLine, indexColumn, aMatrix){
    let obj={}
    return (searchStep(indexLine, indexColumn, aMatrix)&&Array.isArray(aMatrix[indexLine][indexColumn]))?aMatrix[indexLine][indexColumn].map(e=>obj={line:indexLine, column:indexColumn, rank:e,codeLine:aMatrix[indexLine][0].line}).sort((a,b)=>a.rank>b.rank):
            (searchStep(indexLine, indexColumn, aMatrix)?new Array (obj={line:indexLine, column:indexColumn, rank:0,codeLine:aMatrix[indexLine][0].line}):null)
  }
  
  

  function buildNonNulPositionsLine(indexLine, aMatrix){
      return  aMatrix[indexLine].map((e,i)=>searchStep(indexLine, i, aMatrix)?buildPosition(indexLine, i, aMatrix):null).flat().filter(e=>e).sort((a,b)=>a.rank>b.rank)
  }
  
  
  function buildNonNulPositions(aMatrix){
      return  aMatrix.map((e,i)=>buildNonNulPositionsLine(i, aMatrix).length>0?buildNonNulPositionsLine(i, aMatrix):null)
  }
  

  function advancePosition(aPosition, aMatrix){
    return buildNonNulPositionsLine(aPosition.line,aMatrix).find(e=>e.rank>aPosition.rank)?buildNonNulPositionsLine(aPosition.line,aMatrix).find(e=>e.rank>aPosition.rank):
             buildNonNulPositionsLine(advanceMatrixWindow(buildNonNulPositionsLine(aPosition.line,aMatrix).find((pos, i,t)=>!t.some(x=>x.column>pos.column)).line,buildNonNulPositionsLine(aPosition.line,aMatrix).find((pos, i,t)=>!t.some(x=>x.column>pos.column)).column,aMatrix).indexes[0], aMatrix)[0]
  }

  function advanceLinePosition(aPosition, aMatrix){
    return (aPosition.line===advancePosition(aPosition, aMatrix).line&& aPosition.rank!==null)?advancePosition(aPosition, aMatrix):
              (aPosition.rank!==null?{line:aPosition.line,column:aMatrix[0].length-1, rank:null, codeLine:aPosition.codeLine}:buildNonNulPositionsLine(advanceMatrixWindow(aPosition.line, aPosition.column, aMatrix).indexes[0], aMatrix)[0])
  }
  function renameReg(aRegister){
    return aRegister.length==4?aRegister[0].toUpperCase()+aRegister[3]:(aRegister[0]+"M").toUpperCase()
  }
  function renameRegister(aMatrix){
    return aMatrix.map((e,i)=>i==0?e.map((x,j)=>j==0?x:renameReg(x)):e)
  }

class VectorRegister extends React.Component {
    constructor(props) {
        super(props);
        this.registers=instructionsByRegisterBySteps(props.instructions)
        this.matrix=renameRegister(buildMatrixRegInt(this.registers, props.instructions))
        this.tableBodyInit=this.matrix.map((e,i)=>i==0?<tr>{e.map((x,j)=><th className="head">{x}</th>)}</tr>://initialization of a matrix (tableBodyInit)with empty cells except the first line which receives a cell with the name of registers.
                                                 (i==1? e.map((x,j)=>j==0?<tr><th className="intrinsicName" rowspan="3" scope="rowgroup"><span className="intrinsicName">{this.matrix[1][0].name.toUpperCase()}</span></th><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>:<tr><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>):
                                                       (e.map((x,j)=>j==0?<tr><th className="empty"   rowspan="3" scope="rowgroup"><span className="empty"></span></th><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>:<tr><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>))))
        this.state = {
            position: {line:1,column:0, rank:0, codeLine:this.matrix[1][0].line},
            tableBody:this.tableBodyInit
    };
    }

    componentDidMount() {
        this.timerID = setInterval(
          () => this.process(),
          1500
        );
    }/*
      componentDidUpdate(prevProps, prevState, snapshot){
        const list = this.listRef.current;
        console.log(document.getElementsByTagName("p"));
      }*/
      componentWillUnmount() {
        if (this.hightlightedline) this.hightlightedline.clear();
        clearInterval(this.timerID);
      }
    
      process() {
        this.setState(function(state){
          let position=state.position
          let tableBody=state.tableBody
          position=advancePosition(position, this.matrix)
          tableBody=tableBody.map((e,i)=>i!=position.line?e:retrieveLinePosition(position, this.matrix))
          if(position.line==1 && position.rank==0){
            tableBody=this.tableBodyInit
          }
        return{position:position, tableBody:tableBody}
        });

      }
      
      
      highlightCode = (isHover = false) => {
        let line =this.state.position.codeLine-1
        let cm = this.props.cm.current;
        if (line && cm) {
            const lineLength = cm.editor.getLine(line).length;
            return cm.editor.doc.markText({line, ch: 0}, {line, ch: lineLength}, {
                className: isHover ? 'highlighted-code' : 'sequential-highlighted-code'
            });
        }
        return null
    };
    
/*
      buildGraphicStack = () => {
        let stack = [];
        this.props.asm.forEach((func) => {
            let commands = func.body;
            stack.push(<Function name={func.name} params={func.params}/>);
            commands.forEach(c => {
                let command = commandFactory(c);
                const defaultValues = _.filter(func.params, param => c.params.some(e => e === param.register));
                stack.push(
                    //c.line - 1 because line number starts at 1 and we need to start at 0.
                    React.cloneElement(command, {name: c.name, params: c.params, line: c.line - 1, defaultValues})
                );
            });
        });console.log("stack", stack)
        return stack;
    };
    componentDonePlaying(key) {
        if (this.state.play) {
            let increment = key === this.state.idx ? 1 : 0;
            this.setState({idx: this.state.idx + increment});
        }
    }*/

    render(){console.log("this.state.tableBody", this.state.tableBody)
        if (this.hightlightedline) this.hightlightedline.clear();
        this.hightlightedline=this.highlightCode();
        //const k=this.dhighlightCode().clear();
        return(
            <div className="registerUsed"> 
                <div className="controlButton">  </div>
                <div className="visualization"><h6 className="text">Semantic visualization of the execution of the program {this.props.asm[0].name} <br/>Executed on {this.registers.length} registers in {this.props.instructions.length} instructions</h6>
                <table className="visualization"><thead>{this.state.tableBody.map((e,i)=>i==0?<tr ref={i}>{e}</tr>:null)}</thead><tbody> {this.state.tableBody.map((e,i)=>i==0?null:<tr ref={i}>{e}</tr>)}</tbody></table>
                </div>
                <div className="presentation" className="text"><h6><strong>{this.props.description.find(x=>x.intrinsic.toLowerCase()==this.matrix[this.state.position.line][0].name).intrinsic} : {this.props.description.find(x=>x.intrinsic.toLowerCase()==this.matrix[this.state.position.line][0].name).description}</strong></h6>
              </div>
 
            </div>
   )
    }

}

export default VectorRegister;