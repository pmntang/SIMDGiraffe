import React, {Component} from "react";
import * as _ from "lodash";
import "../css/VectorRegister.css";
import 'array-flat-polyfill';
import 'underscore';
//import {convertToStrings} from "../Utils/Converter";

const prefix=["vp", "v","p"]
const suffix=["dqa","ps", "sb", "ss","pd","sd","ud","q","w", "b", "d","s"]//"dq",
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
        let sorted = newArray.sort((a,b)=>(a.register > b.register?1:a.register < b.register?-1:0))
        return sorted
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
      return <th className="intrinsicName"   rowSpan="3" scope="rowgroup"><span className="intrinsicName">{aMatrix[aPosition.line][aPosition.column].name.toUpperCase()}</span></th>
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

  function preRetrieveLinePosition(aPosition, aMatrix){//this function retrieve and return the ligne corresponding to the aPosition.line each time it is called, as aPosition move foward
    return aMatrix[aPosition.line].map((x,j)=>j==0?x:retrieveIndexPositionLine(aPosition.line, j, aPosition,aMatrix))//in, out or inout is put where necessary
  }
  /*
  function handleMouseEnterDef(anEvent, aMatrix){
    console.log("reactif")
    let id=anEvent.target.getAttribute("id")
    let aPosition=extractPositionFromId(id)
    let pathPosition=consPath(aPosition,  aMatrix)
    let listOfPathId=pathPosition.map(e=>"l"+e.line+"c"+e.column+"r"+e.rank)
    let pathHtml=listOfPathId.map(e=>document.getElementById(e))
    pathHtml.map(e=>console.log(e))

  }
  
  function retrieveLinePosition(aPosition, aMatrix){
    let id=buildPosition(aPosition.line, aPosition.column, aMatrix)//this is to know later which cell of the table to adress
    let preRetriveMatrixLine=preRetrieveLinePosition(aPosition, aMatrix)
    var ligne1=<th rowspan="3" scope="rowgroup" className="intrinsicName">{preRetriveMatrixLine[0].name.toUpperCase()}</th>, ligne2=null, ligne3=null;
    for(let j=1; j<preRetriveMatrixLine.length; j++){
      if(preRetriveMatrixLine[j]){
        let statePos=preRetriveMatrixLine[j]
        switch(statePos){
          case "in":{ligne1=<React.Fragment>{ligne1}<td onMouseEnter={handleMouseEnter} id={"l"+id[0].line+"c"+id[0].column+"r"+id[0].rank} className="in">&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
          break;
          case "out":{ligne1=<React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onMouseEnter={handleMouseEnter} id={"l"+id[0].line+"c"+id[0].column+"r"+id[0].rank}  className="out">&#x21D9;</td></React.Fragment>}
          break
          case "inout":{ligne1=<React.Fragment>{ligne1}<td onMouseEnter={handleMouseEnter} id={"l"+id[0].line+"c"+id[0].column+"r"+id[0].rank} className="in">&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onMouseEnter={handleMouseEnter} id={"l"+id[1].line+"c"+id[1].column+"r"+id[1].rank} className="out">&#x21D9;</td></React.Fragment>}
          break
        }
      }
      else{
        {ligne1=<React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
      }

    }
    return <tbody><tr>{ligne1}</tr><tr>{ligne2}</tr><tr>{ligne3}</tr></tbody> 
  }*/
  function initializeLinesMatrix(aLine, aMatrix){
    var ligne1=<th rowSpan="3" scope="rowgroup" className="empty"></th>, ligne2=null, ligne3=null;
     for(let j=1; j<aMatrix[aLine].length; j++){
      ligne1=<React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>
      ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>
      ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>
     }
     return <tbody><tr>{ligne1}</tr><tr>{ligne2}</tr><tr>{ligne3}</tr></tbody>
  }
  function initializeFirstLineMatrix(firstLine, aMatrix){//should have call this initializeFirstLigneMatrix
    var ligne1=<th rowSpan="3" scope="rowgroup" className="intrinsicName">{aMatrix[firstLine][0].name.toUpperCase()}</th>, ligne2=null, ligne3=null;
     for(let j=1; j<aMatrix[firstLine].length; j++){
      ligne1=<React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>
      ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>
      ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>
     }
     return <tbody><tr>{ligne1}</tr><tr>{ligne2}</tr><tr>{ligne3}</tr></tbody>
  }

  function retrieveIndexPositionLine(aLine, aColumn, aPosition,aMatrix){//all the positions before aPosition (those wich position are <= aPosition.rank) are retrieve
    var statePos=null
    if(aLine==aPosition.line){//this condition could have been left
      let indexPosition=buildPosition(aLine,aColumn,aMatrix)
      if(indexPosition){
        let l=indexPosition.length
        switch(l){
          case 1: if(indexPosition[0].rank==buildNonNulPositionsLine(aPosition.line, aMatrix).length-1&&indexPosition[0].rank<=aPosition.rank){//rank are ordered and if indexPosition[0] is the last position of the line, it is an out position
            statePos="out"// is the last step, the last position
          }
                  else
                    if(indexPosition[0].rank<=aPosition.rank){//indexPosition[0] isn't the last position of the line, it is an in
                      statePos="in"+indexPosition[0].rank//add indexPosition[0].rank to intentify the step being executed (the position reach by the program execution or more precisely the flow of the program)
                    }
                    break;
          case 2: if(indexPosition[1].rank<=aPosition.rank){
            statePos="inout"+indexPosition[0].rank// the last step but they are two steps in this i,j index (two positions) (they are two steps which means the instruction has two steps on the corresponding register, necessarily an in and an out) and it is important to know the rank (number) of the first step (the last being an out=the last step of the line)
          }//inout is  to remind that they are two positions at this i, j index it could have been out if not
                  else
                    if(indexPosition[0].rank<=aPosition.rank){
                      statePos="in"+indexPosition[0].rank// this rank indicate the position or the number of the this step
                    }
                    break;
                  
              }              
            }


          }
      return statePos
  }
  function buildPosition(indexLine, indexColumn, aMatrix){
    let obj={}
    let positionsLineCol=(searchStep(indexLine, indexColumn, aMatrix)&&Array.isArray(aMatrix[indexLine][indexColumn]))?aMatrix[indexLine][indexColumn].map(e=>obj={line:indexLine, column:indexColumn, rank:e,codeLine:aMatrix[indexLine][0].line}).sort((a,b)=>a.rank>b.rank)://e represent the step of instruction, step 1, 2, etc.(step is associate with the register)
            (searchStep(indexLine, indexColumn, aMatrix)?new Array (obj={line:indexLine, column:indexColumn, rank:0,codeLine:aMatrix[indexLine][0].line}):null)
    return positionsLineCol
  }
  
  

  function buildNonNulPositionsLine(indexLine, aMatrix){
      let positionsLine=aMatrix[indexLine].map((e,i)=>searchStep(indexLine, i, aMatrix)?buildPosition(indexLine, i, aMatrix):null).flat().filter(e=>e).sort((a,b)=>a.rank>b.rank)
      return positionsLine
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
  function removePrefix(aTablePrefix, aMatrix){
  return aMatrix.map((e,i)=>i==0?e:e.map((x,j)=>j==0&&findPrefix(aTablePrefix, x.name.toUpperCase())?{name:x.name.slice(findPrefix(aTablePrefix, x.name.toUpperCase()).length), line:x.line}:x))
  }

  function findPrefix(aTablePrefix,anInstruction){
  return aTablePrefix.find((currentPre, indexPre, currentTa)=>anInstruction.toUpperCase().slice(0, currentPre.length).match(currentPre.toUpperCase())&& !(currentTa.find(e=>anInstruction.toUpperCase().slice(0, e.length).match(e.toUpperCase())).length>currentPre.length))
  }

  function removeSuffix(aTableSuffix, aMatrix){
  return aMatrix.map((e,i)=>i==0?e:e.map((x,j)=>j==0&&findSuffix(aTableSuffix, x.name.toUpperCase())?{name:x.name.slice(0, x.name.length-findSuffix(aTableSuffix, x.name.toUpperCase()).length), line:x.line}:x))
  }

  function findSuffix(aTableSuffixe, anInstruction){
  return aTableSuffixe.find((currentPre, indexPre, currentTa)=>anInstruction.toUpperCase().slice(anInstruction.length-currentPre.length).match(currentPre.toUpperCase())&& !(currentTa.find(e=>anInstruction.toUpperCase().slice(anInstruction.length-e.length).match(e.toUpperCase())).length>currentPre.length))
  }
  function consPath(aPosition,  aMatrix){
    return forwardPathPosition(aPosition,  aMatrix).concat(backwardPathPosition(aPosition,aMatrix)).sort((a,b)=>a.line>=b.line&&a.rank>=b.rank)
  }
  function nextPos(aPosition, aMatrix){
    var pathNextpos=[]
    if (aPosition.rank>0){
      var forbidenColumn=0
      pathNextpos.push(aPosition)
      let lastPositionLine=buildNonNulPositionsLine(aPosition.line, aMatrix)[buildNonNulPositionsLine(aPosition.line, aMatrix).length-1]
      if(aPosition.rank<lastPositionLine.rank){// the last position is always the successor of all the position of the same line
        pathNextpos.push(lastPositionLine)
        forbidenColumn=lastPositionLine.column //
      }
     for(let i=aPosition.line; i<aMatrix.length; i++){
       let positionsLine=buildNonNulPositionsLine(i, aMatrix)
       if(positionsLine.find(e=>e.column!=forbidenColumn&&e.column==aPosition.column&&e.line!=aPosition.line&&!pathNextpos.find(x=>x.rank==e.rank&&x.line==e.line&&x.column==e.column))){ 
        let posNext=positionsLine.find(e=>e.column!=forbidenColumn&&e.column==aPosition.column&&e.line!=aPosition.line&&!pathNextpos.find(x=>x.rank==e.rank&&x.line==e.line&&x.column==e.column))
        if(posNext.rank<positionsLine[positionsLine.length-1].rank){
          pathNextpos.push(posNext)
        }
        break
       }
     }
    }
    return pathNextpos
  }
function matrixPath(aMatrix){
  return aMatrix.map((x,i)=>i==0?[]:x.map((y,j)=>j==0?[]:(searchStep(i, j, aMatrix)?buildPosition(i,j,aMatrix).map(e=>nextPos(e,aMatrix)):[])))
}

  function forwardPathPosition(aPosition, aMatrix){
    var forwardPathOfPosition=nextPos(aPosition, aMatrix)
    let level=1
    while(level<aMatrix.length){
      //forwardPathOfPosition=forwardPathOfPosition.map((e, i,t)=>nextPos(e, aMatrix)).flat()
      forwardPathOfPosition=forwardPathOfPosition.concat(forwardPathOfPosition.map((e, i,t)=>nextPos(e, aMatrix).filter(x=>!t.find(y=>y.rank==x.rank&&y.column==x.column&&y.line==x.line))).flat())
      level++
    }
    return forwardPathOfPosition
  }
  /*function comptuteNextPositionsTab(tabOfPositions){
    return tabOfPositions.length==1||!Array.isArray(tabOfPositions)?[tabOfPositions].flat():tabOfPositions.map(e=>comptuteNextPositionsTab(e))
  }*/
  function backwardPathPosition(aPosition, aMatrix){
    var backwardPathOfPosition=[]
    for(let i=1; i<aPosition.line; i++){
      let positionsLine=buildNonNulPositionsLine(i, aMatrix)
      for(let j=0; j<positionsLine.length; j++){
        let forwardPathOfPositionj=forwardPathPosition(positionsLine[j], aMatrix)
        backwardPathOfPosition=forwardPathOfPositionj.some(x=>x.rank == aPosition.rank && x.column == aPosition.column && x.line == aPosition.line)?backwardPathOfPosition.concat(positionsLine[j]):backwardPathOfPosition
      }
    }
    let positionsLine=buildNonNulPositionsLine(aPosition.line, aMatrix)
    for(let j=0; j<aPosition.rank; j++){
      let forwardPathOfPositionj=forwardPathPosition(positionsLine[j], aMatrix)
      backwardPathOfPosition=forwardPathOfPositionj.some(x=>x.rank==aPosition.rank&&x.column==aPosition.column&&x.line==aPosition.line)?backwardPathOfPosition.concat(positionsLine[j]):backwardPathOfPosition
    }
    return backwardPathOfPosition
  }
  function extractPositionFromId(aGivenId){
    let positionPropertiesArray=aGivenId.split(/[lcrz]/)
    return {line:parseInt(positionPropertiesArray[1]), column:parseInt(positionPropertiesArray[2]), rank:parseInt(positionPropertiesArray[3]), codeLine:parseInt(positionPropertiesArray[4])}
  }
  function maxPosition(aMatrix){
    let pos=buildNonNulPositionsLine(aMatrix.length-1, aMatrix)[buildNonNulPositionsLine(aMatrix.length-1, aMatrix).length-1]
    return pos
  }

  function minFreePosition(aListOfCurrentPosition){
    let anArray=aListOfCurrentPosition.map(e=>e.idPosition)
    anArray=anArray.map(e=>parseInt(e, 10))
    anArray=anArray.sort((a,b)=>a-b)
   let freePos=null
   let l=anArray.length
   switch(l){
       case 0: freePos=1
           break
       case 1: if(anArray[0]!=1){
            freePos=1
        } 
           else{
               freePos=2
           }
           break
       default:{
          if(anArray[0]!=1){
              freePos=1
          }
           else{
               for(let i=1; i<l; i++){
                   if(anArray[i]-anArray[i-1]>1){
                       freePos=anArray[i-1]+1
                       break
                   }
               }
           }
      }
   }
    freePos=freePos?freePos:l+1
    return freePos
}
  /*
  function updateListOfCurrentPosition(aListOfCurrentPosition, idOfEventElt, aMatrix){
    let pathElt=consPath(extractPositionFromId(idOfEventElt), aMatrix)
    let eltId=aListOfCurrentPosition.find(e=>e.anElementId==idOfEventElt) //[...aListOfCurrentPosition, {aPosition:pathElt[0], anElementId:idOfEventElt}]
    let updateList=eltId&&aListOfCurrentPosition.splice(aListOfCurrentPosition.indexOf(eltId), 1).length>0?aListOfCurrentPosition:[...aListOfCurrentPosition, {aPosition:pathElt[0], anElementId:idOfEventElt, idPosition:minFreePosition(aListOfCurrentPosition)}]; 
    return updateList 
  }*/
  function updateListOfCurrentPosition(aListOfCurrentPosition, idOfEventElt,aMatrix){
    let eltId=aListOfCurrentPosition.find(e=>e.anElementId==idOfEventElt) //[...aListOfCurrentPosition, {aPosition:pathElt[0], anElementId:idOfEventElt}]
    let updateList=[]
    if(eltId){
      aListOfCurrentPosition.splice(aListOfCurrentPosition.indexOf(eltId), 1)
      updateList=aListOfCurrentPosition
    }
    else{
      let pathElt=consPath(extractPositionFromId(idOfEventElt), aMatrix)
      pathElt=pathElt.sort((a,b)=>compare(a,b))
      updateList=[...aListOfCurrentPosition, {aCurrentPosition:initialPosition(pathElt, pathElt[0], aMatrix), anElementId:idOfEventElt, idPosition:minFreePosition(aListOfCurrentPosition), listOfPath:pathElt}]
    }
    return updateList
  }


  function initialPosition(aPath,aPosition,aMatrix){
    let positionLine=aPath.filter(e=>e.line==aPosition.line && e.rank!=buildNonNulPositionsLine(aPosition.line, aMatrix)[buildNonNulPositionsLine(aPosition.line, aMatrix).length-1].rank)
    return positionLine
  }

  function advanceAselectPosition(aListOfCurrentPosition, aMatrix){
    let sortPath=aListOfCurrentPosition.listOfPath.sort((a,b)=>compare(a,b))
    let sortCurrentList=aListOfCurrentPosition.aCurrentPosition.sort((a,b)=>compare(a,b))
    let outPosition=sortPath.find(e=>e.line==sortCurrentList[sortCurrentList.length-1].line&&e.rank>sortCurrentList[sortCurrentList.length-1].rank)
    if(outPosition){
      aListOfCurrentPosition.aCurrentPosition=[outPosition]
    }
    else{
      if(aListOfCurrentPosition.aCurrentPosition[0].line==sortPath[sortPath.length-1].line){
        aListOfCurrentPosition.aCurrentPosition=initialPosition(sortPath, sortPath[0],aMatrix)
      }
      else{
        aListOfCurrentPosition.aCurrentPosition=initialPosition(sortPath,sortPath.find(e=>e.line>sortCurrentList[0].line), aMatrix)
      }
    }
    return aListOfCurrentPosition
  }
  function advanceSelectPositions(aListOfCurrentPositions, aMatrix){//aListOfCurrentPosition={aPosition:..., anElementId:...idPosition:, listhOfPath:} anElementId is an id corresponding to aPosition
    return aListOfCurrentPositions.map(e=>advanceAselectPosition(e, aMatrix))
  }
  
  function compare(a, b) {
    if ((a.line<b.line)||((a.line==b.line)&&a.rank<b.rank)) {
      return -1;
    }
    if (a.line>b.line) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }/*
  function processSelectElt (anArrayListOfPath, eltEventId, aMatrix){
    anArrayListOfPath=updateListOfPath(anArrayListOfPath, eltEventId, aMatrix)

  }
  function udapteAttributsElt(anElt,anEltIndex){console.log("visualise", anElt.anElementId)
    return anElt.anElementId.className.substring(anElt.anElementId.className.length-3, anElt.anElementId.className.length-1)=="id"?
    {aPosition:anElt.aPosition.setAttribute("className", "el"+anElt.anElementId.getAttribute("className").substring(anElt.anElementId.getAttribute("className").length-1)), anElementId:document.getElementById(anElt.anElementId)}:
    {aPosition:anElt.aPosition.setAttribute("className","el"+anEltIndex), anElementId:anElt.anElementId.setAttribute("className","id"+anEltIndex)}
  }
  function updateSelectElt(listOfCurrentElt){console.log("a l'entrée", listOfCurrentElt)
    listOfCurrentElt=listOfCurrentElt.map(e=>{return {aPosition:"l"+e.aPosition.line+"c"+e.aPosition.column+"r"+e.aPosition.rank+"z"+e.aPosition.codeLine, anElementId:e.anElementId}})
    listOfCurrentElt=listOfCurrentElt.map(e=>{return {aPosition:document.getElementById(e.aPosition), anElementId:document.getElementById(e.anElementId)}})
   // listOfCurrentElt=listOfCurrentElt.map(e=>console.log("aPosition",e))
    listOfCurrentElt=listOfCurrentElt.map((e,i)=>udapteAttributsElt(e,i))
    listOfCurrentElt=listOfCurrentElt.map(e=>console.log("aPosition1",e))
    console.log("listOfCurrentElt", listOfCurrentElt)
    listOfCurrentElt=listOfCurrentElt.map(e=>e?console.log("aPosition2",e):console.log("aPosition2","bbbbbb"))
  }*/
  function computeSuffix(aPosition, aListOfCurrentPosition){
    let isInCurrentPos=aListOfCurrentPosition.find(e=>_.isEqual(e.aPosition, aPosition))
    let isCurrentPos=aListOfCurrentPosition.find(e=>e.anElementId=="l"+aPosition.line+"c"+aPosition.column+"r"+aPosition.rank+"z"+aPosition.codeLine)
    let suffix=isInCurrentPos?"el"+isInCurrentPos.idPosition:(isCurrentPos?"id"+isCurrentPos.idPosition:""); console.log("suffix", suffix, "aPosition",aPosition,"aListOfcurrent", aListOfCurrentPosition)
    return suffix
  }
  function findPositionInCurrentPositions(indexLine, aListOfCurrentPosition){
    return aListOfCurrentPosition.find(e=>e.aPosition.line==indexLine||extractPositionFromId(e.anElementId).line==indexLine)?
            (aListOfCurrentPosition.find(e=>e.aPosition.line==indexLine)? aListOfCurrentPosition.find(e=>e.aPosition.line==indexLine).aPosition:
            extractPositionFromId(aListOfCurrentPosition.find(e=>extractPositionFromId(e.anElementId).line==indexLine).anElementId)):null
  }
function matrixToCoordinate(aMatrx, anOrigin, widthOfFigures, heightOfFigures){//build a matrix of coordinates with a given matrix, origin, width and height of figures
  let matrixCoordinate= aMatrx.map((e,i)=>i==0?e.map((x,j)=>Array.of(anOrigin+j*widthOfFigures,anOrigin+i*heightOfFigures, widthOfFigures, heightOfFigures)):
                                e.map((x,j)=>j==0?Array.of(anOrigin+j*widthOfFigures,anOrigin+i*heightOfFigures, widthOfFigures, heightOfFigures):
                                                  Array.of(Array.of(anOrigin+j*widthOfFigures,anOrigin+i*heightOfFigures,widthOfFigures,heightOfFigures/3), 
                                                           Array.of(anOrigin+j*widthOfFigures,anOrigin+(3*i+1)*heightOfFigures/3,widthOfFigures,heightOfFigures/3),
                                                           Array.of(anOrigin+j*widthOfFigures,anOrigin+(3*i+2)*heightOfFigures/3,widthOfFigures,heightOfFigures/3))))
      return matrixCoordinate
}
function matrixToPosition(aMatrix){// build a matrix of position with a given matrix
  let matrixPosition=aMatrix.map((e,i)=>i==0?e:e.map((x,j)=>j==0?x:(buildPosition(i,j, aMatrix)?(buildPosition(i,j, aMatrix).length==1?
              (_.isEqual(buildPosition(i,j, aMatrix)[0], buildNonNulPositionsLine(i, aMatrix)[buildNonNulPositionsLine(i, aMatrix).length-1])? Array.of(Array.of(), Array.of(),Array.of(buildPosition(i,j,aMatrix)[0])):
                                                                                                                                               Array.of(Array.of( buildPosition(i,j,aMatrix)[0]), Array.of(),Array.of())):
                                                                                                                                      Array.of(Array.of(buildPosition(i,j,aMatrix)[0]), Array.of(), Array.of(buildPosition(i,j,aMatrix)[1]))):
                                                                                                Array.of(Array.of(), Array.of(), Array.of()))))
  return matrixPosition
}

function positionsAndCoordinateToFigures(aMatrixPosition, aMatrixCoordinate){// build a matrix of figures (svg elements) with a given matrix of positions and a matrix of coordinates (with appropriate classNames)
  let matrixFigures=aMatrixPosition.map((e,i)=>i==0?e.map((x,j)=>j==0?(<g transform={'translate('+aMatrixCoordinate[i][j][0]+','+aMatrixCoordinate[i][j][1]+')'}><rect className="name" x="0" y="0" width={""+aMatrixCoordinate[i][j][2]} height={""+aMatrixCoordinate[i][j][3]}></rect>
                                                                                                                                                 <text className="textname" alignmentBaseline="middle" textAnchor="middle" x={""+aMatrixCoordinate[i][j][2]/2} y={""+aMatrixCoordinate[i][j][3]/2}>{x}</text></g>):
                                                                      (<g transform={'translate('+aMatrixCoordinate[i][j][0]+','+aMatrixCoordinate[i][j][1]+')'}><rect className="head" x="0" y="0" width={""+aMatrixCoordinate[i][j][2]} height={""+aMatrixCoordinate[i][j][3]}></rect>
                                                                      <text className="texthead" alignmentBaseline="middle" textAnchor="middle" x={""+aMatrixCoordinate[i][j][2]/2} y={""+aMatrixCoordinate[i][j][3]/2}>{x}</text></g>) ):
                                                   e.map((x,j)=>j==0?(<g transform={'translate('+aMatrixCoordinate[i][j][0]+','+aMatrixCoordinate[i][j][1]+')'}><rect className="intrinsicName" x="0" y="0" width={""+aMatrixCoordinate[i][j][2]} height={""+aMatrixCoordinate[i][j][3]}></rect>
                                                                      <text className="textintrinsicName" alignmentBaseline="middle" textAnchor="middle" x={""+aMatrixCoordinate[i][j][2]/2} y={""+aMatrixCoordinate[i][j][3]/2}>{x.name.toUpperCase()}</text></g>):
                                                                      x.map((t,l)=>t.length==0?(<g transform={'translate('+aMatrixCoordinate[i][j][l][0]+','+aMatrixCoordinate[i][j][l][1]+')'}><rect className="empty" x="0" y="0" width={""+aMatrixCoordinate[i][j][l][2]} height={""+aMatrixCoordinate[i][j][l][3]}></rect></g>):
                                                                          (l==0?(<g transform={'translate('+aMatrixCoordinate[i][j][l][0]+','+aMatrixCoordinate[i][j][l][1]+')'}><rect id={"l"+t[0].line+"c"+t[0].column+"r"+t[0].rank+"z"+t[0].codeLine} className={"in"+t[0].line+t[0].rank} x="0" y="0" width={""+aMatrixCoordinate[i][j][l][2]} height={""+aMatrixCoordinate[i][j][l][3]}></rect></g>):
                                                                          (<g transform={'translate('+aMatrixCoordinate[i][j][l][0]+','+aMatrixCoordinate[i][j][l][1]+')'}><rect id={"l"+t[0].line+"c"+t[0].column+"r"+t[0].rank+"z"+t[0].codeLine} className={"out"+t[0].line+t[0].rank} x="0" y="0" width={""+aMatrixCoordinate[i][j][l][2]} height={""+aMatrixCoordinate[i][j][l][3]}></rect></g>)))))
  return matrixFigures
}

function emptyPositionsAndCoordinateOfFigures(aMatrixPosition, aMatrixCoordinate){// build a matrix of figures (svg elements) with a given matrix of positions and a matrix of coordinates (with empty classNames)
  let emptyMatrixFigures=aMatrixPosition.map((e,i)=>i==0?e.map((x,j)=>j==0?(<g transform={'translate('+aMatrixCoordinate[i][j][0]+','+aMatrixCoordinate[i][j][1]+')'}><rect className="name" x="0" y="0" width={""+aMatrixCoordinate[i][j][2]} height={""+aMatrixCoordinate[i][j][3]}></rect>
                                                                                                                                                                      <text className="textname" alignmentBaseline="middle" textAnchor="middle" x={""+aMatrixCoordinate[i][j][2]/2} y={""+aMatrixCoordinate[i][j][3]/2}>{x}</text></g>):
                                                                           (<g transform={'translate('+aMatrixCoordinate[i][j][0]+','+aMatrixCoordinate[i][j][1]+')'}><rect className="head" x="0" y="0" width={""+aMatrixCoordinate[i][j][2]} height={""+aMatrixCoordinate[i][j][3]}></rect>
                                                                           <text className="texthead" alignmentBaseline="middle" textAnchor="middle" x={""+aMatrixCoordinate[i][j][2]/2} y={""+aMatrixCoordinate[i][j][3]/2}>{x}</text></g>) ):
                                                         e.map((x,j)=>j==0?(<g transform={'translate('+aMatrixCoordinate[i][j][0]+','+aMatrixCoordinate[i][j][1]+')'}><rect className="emptyIntrinsicName" x="0" y="0" width={""+aMatrixCoordinate[i][j][2]} height={""+aMatrixCoordinate[i][j][3]}></rect>
                                                                            <text className="emptyTextintrinsicName" alignmentBaseline="middle" textAnchor="middle" x={""+aMatrixCoordinate[i][j][2]/2} y={""+aMatrixCoordinate[i][j][3]/2}></text></g>):
                                                                      x.map((t,l)=>t.length==0?(<g transform={'translate('+aMatrixCoordinate[i][j][l][0]+','+aMatrixCoordinate[i][j][l][1]+')'}><rect className="empty" x="0" y="0" width={""+aMatrixCoordinate[i][j][l][2]} height={""+aMatrixCoordinate[i][j][l][3]}></rect></g>):
                                                                                (l==0?(<g transform={'translate('+aMatrixCoordinate[i][j][l][0]+','+aMatrixCoordinate[i][j][l][1]+')'}><rect  className="empty" x="0" y="0" width={""+aMatrixCoordinate[i][j][l][2]} height={""+aMatrixCoordinate[i][j][l][3]}></rect></g>):
                                                                                      (<g transform={'translate('+aMatrixCoordinate[i][j][l][0]+','+aMatrixCoordinate[i][j][l][1]+')'}><rect  className="empty" x="0" y="0" width={""+aMatrixCoordinate[i][j][l][2]} height={""+aMatrixCoordinate[i][j][l][3]}></rect></g>)))))
  return emptyMatrixFigures
}


class VectorRegister extends React.Component {
    constructor(props) {
        super(props);
        this.registers=instructionsByRegisterBySteps(props.instructions)
        this.matrix=renameRegister(buildMatrixRegInt(this.registers, props.instructions))
        this.renameInstrunctionMatrix=removeSuffix(suffix, removePrefix(prefix, this.matrix))
        this.matrixPosition=matrixToPosition(this.renameInstrunctionMatrix)
        this.handleMouseEnter=this.handleMouseEnter.bind(this)
        this.processEvent=this.processEvent.bind(this)
        this.positionInit={line:1,column:0, rank:0, codeLine:this.matrix[1][0].line}
        this.tableBodyInit=this.matrix.map((e,i)=>i==0?<tr>{this.positionsToTable(this.matrixPosition)[i]}</tr>://initialization of a matrix (tableBodyInit)with empty cells except the first line which receives a cell with the name of registers.
                                                 (i==1?this.retrieveUntilAPosition(this.positionInit, this.matrixPosition):this.retrieveLine(this.emptyPositionsOfTable(this.matrixPosition)[i]))) //initializeFirstLineMatrix(i, this.renameInstrunctionMatrix):initializeLinesMatrix(i, this.renameInstrunctionMatrix) e.map((x,j)=>j==0?<tr><th className="intrinsicName" rowspan="3" scope="rowgroup"><span className="intrinsicName">{this.matrix[1][0].name.toUpperCase()}</span></th><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>:<tr><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>):
                                                       //(e.map((x,j)=>j==0?<tr><th className="empty"   rowspan="3" scope="rowgroup"><span className="empty"></span></th><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>:<tr><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>))))
        this.state = {
            position: this.positionInit,
            tableBody:this.tableBodyInit,
            listOfPath:[],
            listOfCurrentPositions:[]
    };
    }

    componentDidMount() { //console.log("matrixposition", this.matrixPosition[1][2][0], "et", this.matrix)
        this.displayFullMatrix ()
         this.timerID = setInterval(
          () => this.processPath (),
          15500
         );/*
        this.timerID = setInterval(
         () => this.display(),
         1500
        );*/
    }/*
      componentDidUpdate(prevProps, prevState, snapshot){
        const list = this.listRef.current;
        console.log(document.getElementsByTagName("p"));
      }*/
      componentWillUnmount() {
        if (this.hightlightedline) this.hightlightedline.clear();
        clearInterval(this.timerID);
      }
    
      display() {
        this.setState(function(state){
          let position=state.position
          let tableBody=state.tableBody
          let listOfCurrentPositions=state.listOfCurrentPositions
          position=advancePosition(position, this.matrix)
          tableBody=tableBody.map((e,i)=>i!=position.line?e:this.retrieveLinePosition(position, listOfCurrentPositions))
          if(position.line==1 && position.rank==0){//clearInterval(this.timerID);position=maxPosition(this.matrix);tableBody=state.tableBody
           tableBody=this.tableBodyInit

          }
        return{position:position,tableBody:tableBody,listOfCurrentPositions:listOfCurrentPositions}
        });

      }

      displayMatrix() {
        this.setState(function(state){
          let position=state.position
          let tableBody=state.tableBody
          let listOfCurrentPositions=state.listOfCurrentPositions
          position=advancePosition(position, this.matrix)
          tableBody=tableBody.map((e,i)=>i<position.line?e:
                                        (i==position.line?this.retrieveUntilAPosition(position, this.matrixPosition):e))
          if(position.line==1 && position.rank==0){//clearInterval(this.timerID);position=maxPosition(this.matrix);tableBody=state.tableBody
           tableBody=this.tableBodyInit

          }
        return{position:position,tableBody:tableBody,listOfCurrentPositions:listOfCurrentPositions}
        });

      }
      processPath(){
        this.setState(function(state){
          let listOfCurrentPositions=state.listOfCurrentPositions//; console.log("curent", listOfCurrentPositions)
          listOfCurrentPositions=advanceSelectPositions(listOfCurrentPositions, this.renameInstrunctionMatrix) 
          return {listOfCurrentPositions:listOfCurrentPositions}
        });
      }
      processEvent(anEvent){
          let id=anEvent.target.getAttribute("id")
          this.setState(function(state){
          let listOfCurrentPositions=state.listOfCurrentPositions
          listOfCurrentPositions=updateListOfCurrentPosition(listOfCurrentPositions, id, this.matrix)
          return {listOfCurrentPositions:listOfCurrentPositions}
        })
        this.processPath()
      }

      displayFull (){
        this.setState(function(state){
          let position=state.position
          let tableBody=state.tableBody
          let listOfCurrentPositions=state.listOfCurrentPositions
          do{
            position=advancePosition(position, this.matrix)
            tableBody=tableBody.map((e,i)=>i!=position.line?e:this.retrieveLinePosition(position, listOfCurrentPositions)) 
          }while(!_.isEqual(position, maxPosition(this.matrix))); console.log("tablebidyDM", tableBody)
          return{position:position, tableBody:tableBody, listOfCurrentPositions:listOfCurrentPositions}
        });
      }
      displayFullMatrix (){
        this.setState(function(state){
          let tableBody=state.tableBody
          tableBody=this.matrix.map((e,i)=>i==0?<tr>{this.positionsToTable(this.matrixPosition)[i]}</tr>:this.retrieveLine(this.positionsToTable(this.matrixPosition)[i]))
          return {tableBody:tableBody}
        });
      }
      handleMouseEnter=(anEvent)=>{
        let id=anEvent.target.getAttribute("id")
        let thisPosition=extractPositionFromId(id)
        let pathPosition=consPath(thisPosition,  this.matrix)
        let listOfPathId=pathPosition.map(e=>"l"+e.line+"c"+e.column+"r"+e.rank+"z"+e.codeLine)//;console.log("path",pathPosition, "pathid", listOfPathId)
        let pathHtml=listOfPathId.map(e=>document.getElementById(e))
        pathHtml.map(e=>e?e.style.color="red":null)
        //pathHtml.map(e=>console.log(e))
      }
      handleonMouseLeave=(anEvent)=>{
        let id=anEvent.target.getAttribute("id")
        let thisPosition=extractPositionFromId(id)
        let pathPosition=consPath(thisPosition,  this.matrix)
        let listOfPathId=pathPosition.map(e=>"l"+e.line+"c"+e.column+"r"+e.rank+"z"+e.codeLine)//;console.log("path",pathPosition, "pathid", listOfPathId)
        let pathHtml=listOfPathId.map(e=>document.getElementById(e))
        pathHtml.map(e=>e?e.style.color="red":null)
       // pathHtml.map(e=>console.log(e))
      }
      handleClick=(anEvent)=>{
        let id=anEvent.target.getAttribute("id")
        let thisPosition=extractPositionFromId(id)
        let pathPosition=consPath(thisPosition,  this.matrix)
        let listOfPathId=pathPosition.map(e=>"l"+e.line+"c"+e.column+"r"+e.rank+"z"+e.codeLine)//;console.log("path",pathPosition, "pathid", listOfPathId)
        let pathHtml=listOfPathId.map(e=>document.getElementById(e))
        pathHtml.map(e=>e?e.style.color="red":null)
        //pathHtml.map(e=>console.log(e))
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
     retrieveLine(aLigne){ 
      let ligne1=<React.Fragment>{aLigne[0]}</React.Fragment>
      let ligne2=null
      let ligne3=null
      for(let i=1; i<aLigne.length; i++){
        ligne1=<React.Fragment>{ligne1}{aLigne[i][0]}</React.Fragment>
        ligne2=<React.Fragment>{ligne2}{aLigne[i][1]}</React.Fragment>
        ligne3=<React.Fragment>{ligne3}{aLigne[i][2]}</React.Fragment>
      }
      let retrieveLine=<tbody><tr>{ligne1}</tr><tr>{ligne2}</tr><tr>{ligne3}</tr></tbody> 
      return retrieveLine
    
     /* return <tbody> {aLigne.map((x,j)=>j==0?ligne1:(j==aLigne.length-1?<tr>{x.map((u,l)=>l==0?<React.Fragment>{ligne1}{u}</React.Fragment>:(l==1?<React.Fragment>{ligne2}{u}</React.Fragment>:<React.Fragment>{ligne3}{u}</React.Fragment>))}</tr>:
                                                             x.map((u,l)=>l==0?ligne1=<React.Fragment>{ligne1}{u}</React.Fragment>:
                                                                          (l==1?ligne2=<React.Fragment>{ligne2}{u}</React.Fragment>:ligne3=<React.Fragment>{ligne3}{u}</React.Fragment>))))}</tbody>*/
    }


    
    positionsToTable(aMatrixPosition){//table version of positionsAndCoordinateToFigures
      let matrixTable=aMatrixPosition.map((e,i)=>i==0?e.map((x,j)=>j==0?<th className="name" >{x}</th>: <th className="head" >{x}</th> ):
                                                  e.map((x,j)=>j==0?(<th rowSpan="3" scope="rowgroup" className="intrinsicName">{aMatrixPosition[i][j].name.toUpperCase()}</th>):
                                                                      x.map((t,l)=>t.length==0?(<td className="empty"></td>):
                                                                                                 (l==0?(<td onClick= {this.processEvent} id={"l"+t[0].line+"c"+t[0].column+"r"+t[0].rank+"z"+t[0].codeLine} className={"in"+t[0].line+t[0].rank}></td>):
                                                                                                   (<td onClick= {this.processEvent} id={"l"+t[0].line+"c"+t[0].column+"r"+t[0].rank+"z"+t[0].codeLine} className={"out"+t[0].line+t[0].rank}></td> )))))
      return matrixTable
    }


    emptyPositionsOfTable(aMatrixPosition){//table version of emptyPositionsAndCoordinateOfFigures
      let emptyMatrixTable=aMatrixPosition.map((e,i)=>i==0?e.map((x,j)=>j==0?(<th className="name" >{x}</th>): <th className="head" >{x}</th> ):
                                                  e.map((x,j)=>j==0?(<th rowSpan="3" scope="rowgroup" className="emptyIntrinsicName"></th>): x.map(t=><td className="empty"></td>)))
      return emptyMatrixTable
    }

    
     retrieveUntilAPosition(aPosition, aMatrixOfPositions){ 
      let aLigne=aMatrixOfPositions[aPosition.line]
      let aLigneOfPositionsTable=this.positionsToTable(aMatrixOfPositions)[aPosition.line]
      let aLigneOfEmptyPositions=this.emptyPositionsOfTable(aMatrixOfPositions)[aPosition.line]
      let ligne1=<React.Fragment>{aLigneOfPositionsTable[0]}</React.Fragment>
      let ligne2=null
      let ligne3=null
      for(let i=1; i<aLigne.length; i++){
        ligne1=aLigne[i][0].length>0&&aLigne[i][0][0].rank<=aPosition.rank?<React.Fragment>{ligne1}{aLigneOfPositionsTable[i][0]}</React.Fragment>:<React.Fragment>{ligne1}{aLigneOfEmptyPositions[i][0]}</React.Fragment>
        ligne2=<React.Fragment>{ligne2}{aLigneOfEmptyPositions[i][1]}</React.Fragment>
        ligne3=aLigne[i][2].length>0&&aLigne[i][2][0].rank<=aPosition.rank?<React.Fragment>{ligne3}{aLigneOfPositionsTable[i][2]}</React.Fragment>:<React.Fragment>{ligne3}{aLigneOfEmptyPositions[i][2]}</React.Fragment>
      }
      let retrieveUntilAPosition=<tbody><tr>{ligne1}</tr><tr>{ligne2}</tr><tr>{ligne3}</tr></tbody>
      return retrieveUntilAPosition
    }
    retrieveLinePosition(aPosition, listOfCurrentPositions){
      //computeSuffix(aPosition, listOfCurrentPositions, aListOfPosition)
      let id=buildNonNulPositionsLine(aPosition.line, this.matrix)//this is to know later which cell of the table to adress
      let id1=id.length>=2?"l"+id[1].line+"c"+id[1].column+"r"+id[1].rank+"z"+id[1].codeLine:null //"l"+id[1].line+"c"+id[1].column+"r"+id[1].rank+"z"+id[1].codeLine
      let id2=id.length>=3?"l"+id[2].line+"c"+id[2].column+"r"+id[2].rank+"z"+id[2].codeLine:null //"l"+id[2].line+"c"+id[2].column+"r"+id[2].rank+"z"+id[2].codeLine
      let id3=id.length>=4?"l"+id[3].line+"c"+id[3].column+"r"+id[3].rank+"z"+id[3].codeLine:null  //"l"+id[3].line+"c"+id[3].column+"r"+id[3].rank+"z"+id[3].codeLine
      let idl=id.length>0?"l"+id[id.length-1].line+"c"+id[id.length-1].column+"r"+id[id.length-1].rank+"z"+id[id.length-1].codeLine:null //"l"+id[id.length-1].line+"c"+id[id.length-1].column+"r"+id[id.length-1].rank+"z"+id[id.length-1].codeLine
      let preRetriveMatrixLine=preRetrieveLinePosition(aPosition, this.renameInstrunctionMatrix)//; console.log(aPosition.line, "preRetriveMatrixLine", preRetriveMatrixLine, "matrix", this.renameInstrunctionMatrix[aPosition.line])
      var ligne1=<th rowSpan="3" scope="rowgroup" className="intrinsicName">{preRetriveMatrixLine[0].name.toUpperCase()}</th>, ligne2=null, ligne3=null;
      for(let j=1; j<preRetriveMatrixLine.length; j++){
        if(preRetriveMatrixLine[j]){
          let statePos=preRetriveMatrixLine[j]
          switch(statePos){
            case "in1":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={id1} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], listOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
            break;
            case "in2":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={id2} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], listOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
            break;
            case "in3":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={id3} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], listOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
            break;
            case "out":{ligne1=<React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={idl}  className={"out"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[buildPosition(aPosition.line, j, this.matrix).length-1], listOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
            break
            case "inout1":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={id1} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], listOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={idl} className={"out"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[buildPosition(aPosition.line, j, this.matrix).length-1], listOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
            break
            case "inout2":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={id2} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], listOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={idl} className={"out"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[buildPosition(aPosition.line, j, this.matrix).length-1], listOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
            break
            case "inout3":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={id3} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], listOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={idl} className={"out"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[buildPosition(aPosition.line, j, this.matrix).length-1], listOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
            break
          }
        }
        else{
          {ligne1=<React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
        }
  
      }//console.log("lignes", ligne1, ligne2, ligne3, "aPosition", aPosition, "listOfCurrentPos", listOfCurrentPositions)
      return <tbody><tr>{ligne1}</tr><tr>{ligne2}</tr><tr>{ligne3}</tr></tbody> 
    }
    
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

    render(){console.log("cureentlist",this.state.listOfCurrentPositions )
      
        if (this.hightlightedline) this.hightlightedline.clear();//console.log("id document",maxPosition(this.matrix));
        this.hightlightedline=this.highlightCode();
        //const k=this.dhighlightCode().clear();
        return( 
            <div className="registerUsed"> 
                <div className="controlButton">  </div>
                <div className="visualization"><h6 className="text">Semantic visualization of the execution of the program {this.props.asm[0].name} <br/>Executed on <span className="registers">{this.registers.length} registers</span> in <span className="instructions">{this.props.instructions.length} instructions</span></h6>
                <table className="visualization"><thead>{this.state.tableBody.map((e,i)=>i==0?e:null)}</thead> {this.state.tableBody.map((e,i)=>i==0?null:e)}</table>
                </div>
                <div className="presentation" className="text"><h6><strong><span className="description">{this.props.description.find(x=>x.intrinsic.toLowerCase()==this.matrix[this.state.position.line][0].name).intrinsic}</span> : {this.props.description.find(x=>x.intrinsic.toLowerCase()==this.matrix[this.state.position.line][0].name).description}</strong></h6>
              </div>
 
            </div>
   )
    }
    componentDidUpdate(prevProps) {//console.log("id document",document.querySelectorAll("td[className$='out']"));
      // Typical usage (don't forget to compare props):
     // if (this.props.userID !== prevProps.userID) {
      //  this.fetchData(this.props.userID);
     // }
     //console.log(this.matrix,"this.renameInstrunctionMatrix", matrixToPosition(this.matrix), "this.tableBodyInit", this.tableBodyInit, "test",this.retrieveUntilAPosition(this.state.position, matrixToPosition(this.matrix)), "position",this.state.position)
    }
}



export default VectorRegister;