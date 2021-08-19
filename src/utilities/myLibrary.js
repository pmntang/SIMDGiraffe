import React, { Component } from "react";
import * as _ from "lodash";
// import 'array-flat-polyfill';
// import 'underscore';

export function instructionsByRegisterBySteps(arrayOfObject) {//objects are quatriples {id, intrinsic, line, registers}
  var newArray = []
  arrayOfObject.map(function (anIntrObj) {
    for (let i = 0; i < anIntrObj.registers.length; i++) {
      var obj = { register: "", instructions: [] }
      let objInstr = { id: anIntrObj.id, intrinsic: anIntrObj.intrinsic, line: anIntrObj.line, idr: anIntrObj.registers.length - i }
      let register = anIntrObj.registers[i]
      obj.register = register
      obj.instructions.push(objInstr)
      if (newArray.find(x => x.register == obj.register)) {
        if (!(newArray.find(x => x.register == obj.register).instructions.find(x => x.id == objInstr.id && x.intrinsic == objInstr.intrinsic && x.idr == objInstr.idr))) {
          newArray.find(x => x.register == obj.register).instructions.push(objInstr)
        }
      }
      else {
        newArray.push(obj)
      }
    }
  })
  let sorted = newArray.sort((a, b) => (a.register > b.register ? 1 : a.register < b.register ? -1 : 0))
  return sorted
}


export function searchInstruction(id, idr, tab) {//this function extracts from an array of objects (tab) { register:, instructions:} an object in the form {instruction:, register: } corresponding to the criteria passed to it as a parameter (id, idr,tab). the property instructions is an array of triples
  var varInstruction = null
  tab.find(function (obj) {
    return obj.instructions.find(function (instruction) {
      varInstruction = (instruction.id == id && instruction.idr == idr) ? { register: obj.register, instruction: instruction } : null
      return instruction.id == id && instruction.idr == idr
    })
  })
  return varInstruction
}

export function displayWindow(aWindow) {// aWindow is an object {id:, idr:, tab}. This function construct an object {id:, idr:, name:, register:} based on aWindow
  var objectTodisplay = {}, currentWindow = null;
  if (searchInstruction(aWindow.id, aWindow.idr, aWindow.tab)) {
    currentWindow = searchInstruction(aWindow.id, aWindow.idr, aWindow.tab);
    objectTodisplay.id = currentWindow.instruction.id;
    objectTodisplay.idr = currentWindow.instruction.idr;
    objectTodisplay.name = currentWindow.instruction.intrinsic;
    objectTodisplay.register = currentWindow.register;
  }
  return objectTodisplay
}

export function advanceWindow(aWindow) {// This function makes it possible to go from one step in the execution of an instruction to the next step, or from one instruction to the next when all the steps of the current instruction are exhausted. At the last step of the last instruction of the program been retrieved, it starts again and returns the first step of the first instruction of the program been retrieved. The continuous application of this function therefore generates cyclical data.
  return searchInstruction(aWindow.id, aWindow.idr + 1, aWindow.tab) ? { id: aWindow.id, idr: aWindow.idr + 1, tab: aWindow.tab } : (searchInstruction(aWindow.id + 1, 1, aWindow.tab) ? { id: aWindow.id + 1, idr: 1, tab: aWindow.tab } : { id: 0, idr: 1, tab: aWindow.tab })
}
export function message(aWindow) {//this function generate a message in the form of and object {head:, body}. the body contains a html element containing a text to display. The text is construct based on aWindow. the property head contains the name of the correspondant register.
  const styleText = { color: "#86DE74" }//style of the text to display, except the name of the instruction (which is displaye in the same style as the id and idr)
  const styleId = { color: "#FF7DE9" }
  var messageContent = displayWindow(aWindow)//Below we identify the paragraph (tag p) with the id of aWindow messageContent.id as we will use this id to set the same color for the paragraph having the same id
  var message = { head: messageContent.register, body: <p className={messageContent.id} ><span style={styleText}>instruction:</span> <span style={styleId}>{messageContent.id}</span><br /><span style={styleText}>step:</span> <span style={styleId}>{messageContent.idr}</span><br /><span style={styleId}>{messageContent.name}</span></p> }
  return message
}

export function pickStep(instNumber, arrayOfInstructions) {//takes an array of instructions and an instruction number, then returns an array consisting of the steps of the instruction whose number was given.here an instruction is a triple {id:, name:, idr:, line}
  return arrayOfInstructions.reduce((acc, curr) => (curr.id == instNumber) ? [curr.idr, ...acc] : acc, []);
}

export function extractStepRegAtInst(aRegister, anArrayOfRegisters, instNumber) {// extract from an array of register the steps of an instruction executed on this register.this instruction is identified by its id. returns null if no step of this instruction is executed on this register.
  return anArrayOfRegisters.find(e => e.register == aRegister) ? pickStep(instNumber, anArrayOfRegisters.find(e => e.register == aRegister).instructions) : null
}

export function buildMatrixRegInt(anArrayOfRegisters, anArrayOfInstructions) {
  let augMentArrayOfReg = [{ register: "NAME" }, ...anArrayOfRegisters]
  let matrix = augMentArrayOfReg.map(e => new Array(anArrayOfInstructions.length + 1).fill(e.register))
  matrix = matrix.map(r => (r[0] == "NAME") ? (r.map((c, i) => (i == 0) ? r[0] : { name: "" + anArrayOfInstructions[i - 1].intrinsic, line: anArrayOfInstructions[i - 1].line })) : (r.map((c, i) => (i == 0) ? r[0] : extractStepRegAtInst(c, anArrayOfRegisters, i - 1))))
  return matrix[0].map((x, i) => matrix.map(x => x[i])) //this is to transpose
}

export function searchStep(lineIndex, columnIndex, aMatrix) {
  return lineIndex > 0 && columnIndex >= 0 && lineIndex < aMatrix.length && columnIndex < aMatrix[0].length && (aMatrix[lineIndex][columnIndex].length > 0 || (aMatrix[lineIndex][columnIndex] !== null && !Array.isArray(aMatrix[lineIndex][columnIndex])))
}

export function advanceMatrixWindow(lineIndex, columnIndex, aMatrix) {//Advance the window to the next step of an instruction or until the next instruction.
  return {
    value: searchStep(lineIndex, columnIndex + 1, aMatrix) ? aMatrix[lineIndex][columnIndex + 1] :
      ((lineIndex >= aMatrix.length - 1 && columnIndex >= aMatrix[0].length - 1 && searchStep(1, 0, aMatrix)) ? aMatrix[1][0] :
        (((lineIndex >= aMatrix.length - 1 && columnIndex >= aMatrix[0].length - 1) || (lineIndex <= 0 || columnIndex < 0)) ? advanceMatrixWindow(1, 0, aMatrix).value :
          ((columnIndex >= aMatrix[0].length - 1 && searchStep(lineIndex + 1, 0, aMatrix)) ? aMatrix[lineIndex + 1][0] :
            ((columnIndex >= aMatrix[0].length - 1 && lineIndex < aMatrix.length - 1) ? advanceMatrixWindow(lineIndex + 1, 0, aMatrix).value :
              ((lineIndex >= aMatrix.length - 1 && searchStep(aMatrix.length - 1, columnIndex + 1, aMatrix)) ? aMatrix[aMatrix.length - 1][columnIndex + 1] :
                (advanceMatrixWindow(lineIndex, columnIndex + 1, aMatrix).value)))))),
    indexes: searchStep(lineIndex, columnIndex + 1, aMatrix) ? [lineIndex, columnIndex + 1] :
      ((lineIndex >= aMatrix.length - 1 && columnIndex >= aMatrix[0].length - 1 && searchStep(1, 0, aMatrix)) ? [1, 0] :
        (((lineIndex >= aMatrix.length - 1 && columnIndex >= aMatrix[0].length - 1) || (lineIndex <= 0 || columnIndex < 0)) ? advanceMatrixWindow(1, 0, aMatrix).indexes :
          ((columnIndex >= aMatrix[0].length - 1 && searchStep(lineIndex + 1, 0, aMatrix)) ? [lineIndex + 1, 0] :
            ((columnIndex >= aMatrix[0].length - 1 && lineIndex < aMatrix.length - 1) ? advanceMatrixWindow(lineIndex + 1, 0, aMatrix).indexes :
              ((lineIndex >= aMatrix.length - 1 && searchStep(aMatrix.length - 1, columnIndex + 1, aMatrix)) ? [aMatrix.length - 1, columnIndex + 1] :
                (advanceMatrixWindow(lineIndex, columnIndex + 1, aMatrix).indexes))))))
  }

}


export function retrievePosition(aPosition, aMatrix) {
  if (aPosition.rank == 0) {//we are at the first column (index 0)
    return <th className="intrinsicName" rowSpan="3" scope="rowgroup"><span className="intrinsicName">{aMatrix[aPosition.line][aPosition.column].name.toUpperCase()}</span></th>
  }
  else
    if (aMatrix[aPosition.line][aPosition.column].length == 1) {
      if (aPosition.rank == buildNonNulPositionsLine(aPosition.line, aMatrix).length - 1) {
        return <React.Fragment><td ><span className="empty"></span>a</td><td ><span className="empty"></span>a</td><td className="out"><span className="out">&#x21D9;</span></td></React.Fragment>
      }
      else {
        return <React.Fragment><td className="in"><span className="in">&#x21D7;</span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></React.Fragment>
      }
    }
    else
      if (aMatrix[aPosition.line][aPosition.column].length == 2) {
        if (aPosition.rank == buildPosition(aPosition.line, aPosition.column, aMatrix)[0].rank) {
          return <React.Fragment><td className="in"><span className="in">&#x21D7;</span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></React.Fragment>
        }
        else {
          return <React.Fragment><td className="in"><span className="in">&#x21D7;</span></td><td ><span className="empty"></span></td><td className="out"><span className="out">&#x21D9;</span></td></React.Fragment>
        }
      }
}

export function preRetrieveLinePosition(aPosition, aMatrix) {//this function retrieve and return the ligne corresponding to the aPosition.line each time it is called, as aPosition move foward
  return aMatrix[aPosition.line].map((x, j) => j == 0 ? x : retrieveIndexPositionLine(aPosition.line, j, aPosition, aMatrix))//in, out or inout is put where necessary
}

export function initializeLinesMatrix(aLine, aMatrix) {
  var ligne1 = <th rowSpan="3" scope="rowgroup" className="empty"></th>, ligne2 = null, ligne3 = null;
  for (let j = 1; j < aMatrix[aLine].length; j++) {
    ligne1 = <React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>
    ligne2 = <React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>
    ligne3 = <React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>
  }
  return <tbody><tr>{ligne1}</tr><tr>{ligne2}</tr><tr>{ligne3}</tr></tbody>
}

export function initializeFirstLineMatrix(firstLine, aMatrix) {//should have call this initializeFirstLigneMatrix
  var ligne1 = <th rowSpan="3" scope="rowgroup" className="intrinsicName">{aMatrix[firstLine][0].name.toUpperCase()}</th>, ligne2 = null, ligne3 = null;
  for (let j = 1; j < aMatrix[firstLine].length; j++) {
    ligne1 = <React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>
    ligne2 = <React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>
    ligne3 = <React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>
  }
  return <tbody><tr>{ligne1}</tr><tr>{ligne2}</tr><tr>{ligne3}</tr></tbody>
}

export function retrieveIndexPositionLine(aLine, aColumn, aPosition, aMatrix) {//all the positions before aPosition (those wich position are <= aPosition.rank) are retrieve
  var statePos = null
  if (aLine == aPosition.line) {//this condition could have been left
    let indexPosition = buildPosition(aLine, aColumn, aMatrix)
    if (indexPosition) {
      let l = indexPosition.length
      switch (l) {
        case 1: if (indexPosition[0].rank == buildNonNulPositionsLine(aPosition.line, aMatrix).length - 1 && indexPosition[0].rank <= aPosition.rank) {//rank are ordered and if indexPosition[0] is the last position of the line, it is an out position
          statePos = "out"// is the last step, the last position
        }
        else
          if (indexPosition[0].rank <= aPosition.rank) {//indexPosition[0] isn't the last position of the line, it is an in
            statePos = "in" + indexPosition[0].rank//add indexPosition[0].rank to intentify the step being executed (the position reach by the program execution or more precisely the flow of the program)
          }
          break;
        case 2: if (indexPosition[1].rank <= aPosition.rank) {
          statePos = "inout" + indexPosition[0].rank// the last step but they are two steps in this i,j index (two positions) (they are two steps which means the instruction has two steps on the corresponding register, necessarily an in and an out) and it is important to know the rank (number) of the first step (the last being an out=the last step of the line)
        }//inout is  to remind that they are two positions at this i, j index it could have been out if not
        else
          if (indexPosition[0].rank <= aPosition.rank) {
            statePos = "in" + indexPosition[0].rank// this rank indicate the position or the number of the this step
          }
          break;

      }
    }


  }
  return statePos
}

export function buildPosition(indexLine, indexColumn, aMatrix) {
  let obj = {}
  let positionsLineCol = (searchStep(indexLine, indexColumn, aMatrix) && Array.isArray(aMatrix[indexLine][indexColumn])) ? aMatrix[indexLine][indexColumn].map(e => obj = { line: indexLine, column: indexColumn, rank: e, codeLine: aMatrix[indexLine][0].line }).sort((a, b) => a.rank - b.rank) ://e represent the step of instruction, step 1, 2, etc.(step is associate with the register)
    (searchStep(indexLine, indexColumn, aMatrix) ? new Array(obj = { line: indexLine, column: indexColumn, rank: 0, codeLine: aMatrix[indexLine][0].line }) : null)
  return positionsLineCol
}



export function buildNonNulPositionsLine(indexLine, aMatrix) {
  let positionsLine = aMatrix[indexLine].map((e, i) => searchStep(indexLine, i, aMatrix) ? buildPosition(indexLine, i, aMatrix) : null).flat().filter(e => e).sort((a, b) => a.rank - b.rank)
  return positionsLine
}


export function buildNonNulPositions(aMatrix) {
  return aMatrix.map((e, i) => buildNonNulPositionsLine(i, aMatrix).length > 0 ? buildNonNulPositionsLine(i, aMatrix) : null)
}


export function advancePosition(aPosition, aMatrix) {
  return buildNonNulPositionsLine(aPosition.line, aMatrix).find(e => e.rank > aPosition.rank) ? buildNonNulPositionsLine(aPosition.line, aMatrix).find(e => e.rank > aPosition.rank) :
    buildNonNulPositionsLine(advanceMatrixWindow(buildNonNulPositionsLine(aPosition.line, aMatrix).find((pos, i, t) => !t.some(x => x.column > pos.column)).line, buildNonNulPositionsLine(aPosition.line, aMatrix).find((pos, i, t) => !t.some(x => x.column > pos.column)).column, aMatrix).indexes[0], aMatrix)[0]
}

export function advanceLinePosition(aPosition, aMatrix) {
  return (aPosition.line === advancePosition(aPosition, aMatrix).line && aPosition.rank !== null) ? advancePosition(aPosition, aMatrix) :
    (aPosition.rank !== null ? { line: aPosition.line, column: aMatrix[0].length - 1, rank: null, codeLine: aPosition.codeLine } : buildNonNulPositionsLine(advanceMatrixWindow(aPosition.line, aPosition.column, aMatrix).indexes[0], aMatrix)[0])
}
export function renameReg(aRegister) {
  return aRegister.length == 4 ? aRegister[0].toUpperCase() + aRegister[3] : (aRegister[0] + "M").toUpperCase()
}


export function renameRegister(aMatrix) {
  return aMatrix.map((e, i) => i == 0 ? e.map((x, j) => j == 0 ? x : renameReg(x)) : e)
}
export function removePrefix(linesPrefix, aMatrix) {
  return aMatrix.map((e, i) => i == 0 ? e : e.map((x, j) => j == 0 && findPrefix(linesPrefix, x.name.toUpperCase()) ? { name: x.name.slice(findPrefix(linesPrefix, x.name.toUpperCase()).length), line: x.line } : x))
}

export function findPrefix(linesPrefix, anInstruction) {
  return linesPrefix.find((currentPre, indexPre, currentTa) => anInstruction.toUpperCase().slice(0, currentPre.length).match(currentPre.toUpperCase()) && !(currentTa.find(e => anInstruction.toUpperCase().slice(0, e.length).match(e.toUpperCase())).length > currentPre.length))
}

export function removeSuffix(linesSuffix, aMatrix) {
  return aMatrix.map((e, i) => i == 0 ? e : e.map((x, j) => j == 0 && findSuffix(linesSuffix, x.name.toUpperCase()) ? { name: x.name.slice(0, x.name.length - findSuffix(linesSuffix, x.name.toUpperCase()).length), line: x.line } : x))
}

export function findSuffix(linesSuffix, anInstruction) {
  return linesSuffix.find((currentPre, indexPre, currentTa) => anInstruction.toUpperCase().slice(anInstruction.length - currentPre.length).match(currentPre.toUpperCase()) && !(currentTa.find(e => anInstruction.toUpperCase().slice(anInstruction.length - e.length).match(e.toUpperCase())).length > currentPre.length))
}
export function consPath(aPosition, aMatrix) {
  return (forwardPathPosition(aPosition, aMatrix).concat(backwardPathPosition(aPosition, aMatrix))).sort((a, b) => compare(a, b))
}

export function nextPositions(aPosition, aMatrix) {
  var pathNextpos = []
  if (aPosition.rank > 0) {
    var forbidenColumn = 0
    pathNextpos = [aPosition, ...pathNextpos]
    let lastPositionLine = buildNonNulPositionsLine(aPosition.line, aMatrix)[buildNonNulPositionsLine(aPosition.line, aMatrix).length - 1]
    if (aPosition.rank < lastPositionLine.rank) {// the last position is always the successor of all the position of the same line
      pathNextpos = [lastPositionLine, ...pathNextpos]
      forbidenColumn = lastPositionLine.column // the next position can't be on the same column after an out position (can't be skiped)
    }
    for (let i = aPosition.line; i < aMatrix.length; i++) {
      let positionsLine = buildNonNulPositionsLine(i, aMatrix)
      let posNext = positionsLine.find(e => e.column != forbidenColumn && e.column == aPosition.column && e.line != aPosition.line && !pathNextpos.find(x => _.isEqual(x, e)))
      if (posNext) {
        pathNextpos = posNext.rank < positionsLine[positionsLine.length - 1].rank ? [posNext, ...pathNextpos] : pathNextpos
        break
      }
    }
  }
  return pathNextpos.sort((a, b) => compare(a, b))
}


export function previousPositions(aPosition, aMatrix) {
  var pathNextpos = []
  if (aPosition.rank > 0) {
    var authorizedColumn = aPosition.column // the previous position if not on the same line (wich is always the case for an out position) is always on the same column as the position
    pathNextpos = [aPosition, ...pathNextpos]
    let lastPositionLine = buildNonNulPositionsLine(aPosition.line, aMatrix)//[buildNonNulPositionsLine(aPosition.line, aMatrix).length-1]
    if (aPosition.rank == lastPositionLine[lastPositionLine.length - 1].rank) {//  all the positions of the same line are always the predecessor of the out position
      pathNextpos = [...lastPositionLine.filter(e => !pathNextpos.find(x => _.isEqual(x, e))), ...pathNextpos].filter(e => e.rank != 0)
    }
    else {
      for (let i = aPosition.line; i > 0; i--) {
        let positionsLine = buildNonNulPositionsLine(i, aMatrix)
        let posNext = positionsLine.find(e => e.column == authorizedColumn && e.line != aPosition.line && !pathNextpos.find(x => _.isEqual(x, e)))
        if (posNext) {
          pathNextpos = positionsLine[positionsLine.length - 1].column == authorizedColumn ? [positionsLine[positionsLine.length - 1], ...pathNextpos] : [posNext, ...pathNextpos]//if the out position is in the same column it is the which one picked
          break
        }
      }

    }

  }
  return pathNextpos.sort((a, b) => compare(a, b)).reverse()
}




export function matrixPath(aMatrix) {
  return aMatrix.map((x, i) => i == 0 ? [] : x.map((y, j) => j == 0 ? [] : (searchStep(i, j, aMatrix) ? buildPosition(i, j, aMatrix).map(e => nextPositions(e, aMatrix)) : [])))
}


export function forwardPathPosition(aPosition, aMatrix) {
  var forwardPathOfPosition = nextPositions(aPosition, aMatrix)
  let level = 1
  while (level < aMatrix.length) {
    //forwardPathOfPosition=forwardPathOfPosition.map((e, i,t)=>nextPositions(e, aMatrix)).flat()
    forwardPathOfPosition = forwardPathOfPosition.concat(forwardPathOfPosition.map((e, i, t) => nextPositions(e, aMatrix).filter(x => !t.find(y => y.rank == x.rank && y.column == x.column && y.line == x.line && y.codeLine == x.codeLine))).flat())
    level++
  }
  return forwardPathOfPosition.sort((a, b) => compare(a, b))
}
/*function comptuteNextPositionsTab(tabOfPositions){
  return tabOfPositions.length==1||!Array.isArray(tabOfPositions)?[tabOfPositions].flat():tabOfPositions.map(e=>comptuteNextPositionsTab(e))
}*/

export function backwardPathPosition(aPosition, aMatrix) {
  var backwardPathOfPosition = []
  for (let i = 1; i < aPosition.line; i++) {
    let positionsLine = buildNonNulPositionsLine(i, aMatrix)
    for (let j = 0; j < positionsLine.length; j++) {
      let forwardPathOfPositionj = forwardPathPosition(positionsLine[j], aMatrix)
      backwardPathOfPosition = forwardPathOfPositionj.some(x => x.rank == aPosition.rank && x.column == aPosition.column && x.line == aPosition.line && x.codeLine == aPosition.codeLine) ? backwardPathOfPosition.concat(positionsLine[j]) : backwardPathOfPosition
    }
  }
  let positionsLine = buildNonNulPositionsLine(aPosition.line, aMatrix)
  for (let j = 0; j < aPosition.rank; j++) {
    let forwardPathOfPositionj = forwardPathPosition(positionsLine[j], aMatrix)
    backwardPathOfPosition = forwardPathOfPositionj.some(x => x.rank == aPosition.rank && x.column == aPosition.column && x.line == aPosition.line && x.codeLine == aPosition.codeLine) ? backwardPathOfPosition.concat(positionsLine[j]) : backwardPathOfPosition
  }
  return backwardPathOfPosition.sort((a, b) => compare(a, b))
}

export function extractPositionFromId(aGivenId) {
  let positionPropertiesArray = aGivenId.split(/[lcrz]/)
  return { line: parseInt(positionPropertiesArray[1]), column: parseInt(positionPropertiesArray[2]), rank: parseInt(positionPropertiesArray[3]), codeLine: parseInt(positionPropertiesArray[4]) }
}

export function maxPosition(aMatrix) {
  let pos = buildNonNulPositionsLine(aMatrix.length - 1, aMatrix)[buildNonNulPositionsLine(aMatrix.length - 1, aMatrix).length - 1]
  return pos
}

export function minFreePosition(aListOfCurrentPosition) {
  let anArray = aListOfCurrentPosition.map(e => e.idPosition)
  anArray = anArray.map(e => parseInt(e, 10))
  anArray = anArray.sort((a, b) => a - b)
  let freePos = null
  let l = anArray.length
  switch (l) {
    case 0: freePos = 1
      break
    case 1: if (anArray[0] != 1) {
      freePos = 1
    }
    else {
      freePos = 2
    }
      break
    default: {
      if (anArray[0] != 1) {
        freePos = 1
      }
      else {
        for (let i = 1; i < l; i++) {
          if (anArray[i] - anArray[i - 1] > 1) {
            freePos = anArray[i - 1] + 1
            break
          }
        }
      }
    }
  }
  freePos = freePos ? freePos : l + 1
  return freePos
}

export function updateArrayOfCurrentPositions(anArrayOfCurrentPositions, idOfEventElt, aMatrix) {
  let thisPosition = extractPositionFromId(idOfEventElt)//; console.log("nexposition",  nextPositions(thisPosition, aMatrix), "previous", previousPositions(thisPosition, aMatrix))
  let eltId = anArrayOfCurrentPositions.find(e => e.anElementId == idOfEventElt) //[...aListOfCurrentPosition, {aPosition:pathElt[0], anElementId:idOfEventElt}]
  if (!eltId) {
    let pathElt = consPath(extractPositionFromId(idOfEventElt), aMatrix)
    let pathEltDown = forwardPathPosition(extractPositionFromId(idOfEventElt), aMatrix)
    let pathEltUp = backwardPathPosition(extractPositionFromId(idOfEventElt), aMatrix).concat(thisPosition)
    let positionsOfThisLine = buildNonNulPositionsLine(pathElt[0].line, aMatrix).filter(e => e.rank >= 1)
    let positionsOfThisLineUp = buildNonNulPositionsLine(pathEltUp[0].line, aMatrix).filter(e => e.rank >= 1)
    let positionsOfThisLineDown = buildNonNulPositionsLine(pathEltDown[0].line, aMatrix).filter(e => e.rank >= 1)
    let restrictPositions = linePosition(pathElt, pathElt[0], aMatrix).filter(e => !_.isEqual(e, thisPosition)).length == 0 ? [positionsOfThisLine[positionsOfThisLine.length - 1]] : linePosition(pathElt, pathElt[0], aMatrix).filter(e => !_.isEqual(e, thisPosition))
    let restrictPositionsup = linePosition(pathEltUp, pathEltUp[0], aMatrix).filter(e => !_.isEqual(e, thisPosition)).length == 0 ? [positionsOfThisLineUp[positionsOfThisLineUp.length - 1]] : linePosition(pathEltUp, pathEltUp[0], aMatrix).filter(e => !_.isEqual(e, thisPosition))
    let restrictPositionsDown = linePosition(pathEltDown, pathEltDown[0], aMatrix).filter(e => !_.isEqual(e, thisPosition)).length == 0 ? [positionsOfThisLineDown[positionsOfThisLineDown.length - 1]] : linePosition(pathEltDown, pathEltDown[0], aMatrix).filter(e => !_.isEqual(e, thisPosition))
    anArrayOfCurrentPositions = [...anArrayOfCurrentPositions, {
      aCurrentPosition: restrictPositions, aCurrentPositionUp: previousPositions(thisPosition, aMatrix), aCurrentPositionDown: nextPositions(thisPosition, aMatrix), anElementId: idOfEventElt, idPosition: minFreePosition(anArrayOfCurrentPositions),
      listOfPath: pathElt, listOfPathUp: pathEltUp, listOfPathDown: pathEltDown, linkedPositionsUp: [thisPosition], linkedPositionsDown: [thisPosition]
    }]
  }
  else {
    anArrayOfCurrentPositions.splice(anArrayOfCurrentPositions.indexOf(eltId), 1)
  }
  return anArrayOfCurrentPositions
}


export function linePosition(aPath, aPosition, aMatrix) {
  let positionLine = []
  if (aPosition.rank == buildNonNulPositionsLine(aPosition.line, aMatrix)[buildNonNulPositionsLine(aPosition.line, aMatrix).length - 1].rank) {
    positionLine = [...positionLine, aPosition]
  }
  else {
    positionLine = aPath.filter(e => e.line == aPosition.line && e.rank != buildNonNulPositionsLine(aPosition.line, aMatrix)[buildNonNulPositionsLine(aPosition.line, aMatrix).length - 1].rank)
  }     //console.log("position",aPosition, "posiLi",positionLine)
  return positionLine
}


export function advanceAselectPosition(anObjectOfCurrentPosition, aMatrix) {

  let thisPosition = extractPositionFromId(anObjectOfCurrentPosition.anElementId)
  let linePositions = buildNonNulPositionsLine(anObjectOfCurrentPosition.listOfPath[0].line, aMatrix)
  let firstPosition = linePosition(anObjectOfCurrentPosition.listOfPath, anObjectOfCurrentPosition.listOfPath[0], aMatrix).filter(e => !_.isEqual(e, thisPosition)).length == 0 ?
    [linePositions[linePositions.length - 1]] : linePosition(anObjectOfCurrentPosition.listOfPath, anObjectOfCurrentPosition.listOfPath[0], aMatrix).filter(e => !_.isEqual(e, thisPosition))

  if (_.isEqual(anObjectOfCurrentPosition.aCurrentPosition[anObjectOfCurrentPosition.aCurrentPosition.length - 1], anObjectOfCurrentPosition.listOfPath[anObjectOfCurrentPosition.listOfPath.length - 1])) {
    anObjectOfCurrentPosition.aCurrentPosition = firstPosition
  }
  else {
    let anextPosition = anObjectOfCurrentPosition.listOfPath.find(e => (e.line > anObjectOfCurrentPosition.aCurrentPosition[0].line || (e.line == anObjectOfCurrentPosition.aCurrentPosition[0].line && e.rank > anObjectOfCurrentPosition.aCurrentPosition[0].rank)) && !anObjectOfCurrentPosition.aCurrentPosition.some(x => _.isEqual(x, e)))
    let nextPositions = linePosition(anObjectOfCurrentPosition.listOfPath, anextPosition, aMatrix).filter(e => !_.isEqual(e, thisPosition))
    if (nextPositions.length > 0) {
      anObjectOfCurrentPosition.aCurrentPosition = nextPositions
    }
    else {
      let followingPosition = anObjectOfCurrentPosition.listOfPath.find(e => (e.line > thisPosition.line || (e.line == thisPosition.line && e.rank > thisPosition.rank)) && !linePosition(anObjectOfCurrentPosition.listOfPath, thisPosition, aMatrix).some(x => _.isEqual(x, e)))
      if (followingPosition) {
        anObjectOfCurrentPosition.aCurrentPosition = linePosition(anObjectOfCurrentPosition.listOfPath, followingPosition, aMatrix)
      }
      else {
        anObjectOfCurrentPosition.aCurrentPosition = firstPosition
      }
    }
  }
  return anObjectOfCurrentPosition
}


export function advanceAselectPositionFoward(anObjectOfCurrentPosition, aMatrix) {

  let thisPosition = extractPositionFromId(anObjectOfCurrentPosition.anElementId)
  let linePositions = buildNonNulPositionsLine(anObjectOfCurrentPosition.listOfPathDown[0].line, aMatrix)
  let firstPosition = linePosition(anObjectOfCurrentPosition.listOfPathDown, anObjectOfCurrentPosition.listOfPathDown[0], aMatrix).filter(e => !_.isEqual(e, thisPosition)).length == 0 ?
    [linePositions[linePositions.length - 1]] : linePosition(anObjectOfCurrentPosition.listOfPathDown, anObjectOfCurrentPosition.listOfPathDown[0], aMatrix).filter(e => !_.isEqual(e, thisPosition))

  if (_.isEqual(anObjectOfCurrentPosition.aCurrentPositionDown[anObjectOfCurrentPosition.aCurrentPositionDown.length - 1], anObjectOfCurrentPosition.listOfPathDown[anObjectOfCurrentPosition.listOfPathDown.length - 1])) {
    anObjectOfCurrentPosition.aCurrentPositionDown = firstPosition
  }
  else {
    let anextPosition = anObjectOfCurrentPosition.listOfPathDown.find(e => (e.line > anObjectOfCurrentPosition.aCurrentPositionDown[0].line || (e.line == anObjectOfCurrentPosition.aCurrentPositionDown[0].line && e.rank > anObjectOfCurrentPosition.aCurrentPositionDown[0].rank)) && !anObjectOfCurrentPosition.aCurrentPositionDown.some(x => _.isEqual(x, e)))
    let nextPositions = linePosition(anObjectOfCurrentPosition.listOfPathDown, anextPosition, aMatrix).filter(e => !_.isEqual(e, thisPosition))
    if (nextPositions.length > 0) {
      anObjectOfCurrentPosition.aCurrentPositionDown = nextPositions
    }
    else {
      let followingPosition = anObjectOfCurrentPosition.listOfPathDown.find(e => (e.line > thisPosition.line || (e.line == thisPosition.line && e.rank > thisPosition.rank)) && !linePosition(anObjectOfCurrentPosition.listOfPathDown, thisPosition, aMatrix).some(x => _.isEqual(x, e)))
      if (followingPosition) {
        anObjectOfCurrentPosition.aCurrentPositionDown = linePosition(anObjectOfCurrentPosition.listOfPathDown, followingPosition, aMatrix)
      }
      else {
        anObjectOfCurrentPosition.aCurrentPositionDown = firstPosition
      }
    }
  }
  return anObjectOfCurrentPosition
}

export function advanceSelectPositionsFoward(anArrayOfCurrentPositions, aMatrix) {//aListOfCurrentPosition={aPosition:..., anElementId:...idPosition:, listhOfPath:} anElementId is an id corresponding to aPosition
  return anArrayOfCurrentPositions.map(e => advanceAselectPositionFoward(e, aMatrix))
}

export function advanceSelectPositions(anArrayOfCurrentPositions, aMatrix) {//aListOfCurrentPosition={aPosition:..., anElementId:...idPosition:, listhOfPath:} anElementId is an id corresponding to aPosition
  return anArrayOfCurrentPositions.map(e => advanceAselectPosition(e, aMatrix))
}

export function compare(a, b) {
  if (a.line == b.line) {
    if (a.rank < b.rank) {
      return -1
    }
    else {
      if (a.rank > b.rank) {
        return 1
      }
      else {
        return 0
      }
    }
  }
  else {
    if (a.line < b.line) {
      return -1
    }
    else {
      return 1
    }
  }
}

export function computeSuffix(aPosition, anArrayOfCurrentPositions) {
  let suffix = null
  if (anArrayOfCurrentPositions) {
    if (anArrayOfCurrentPositions.find(e => _.isEqual(extractPositionFromId(e.anElementId), aPosition))) {
      suffix = "id" + anArrayOfCurrentPositions.find(e => _.isEqual(extractPositionFromId(e.anElementId), aPosition)).idPosition
    }
    else {
      if (anArrayOfCurrentPositions.find(e => e.aCurrentPosition.find(x => _.isEqual(x, aPosition)))) {
        suffix = "el" + anArrayOfCurrentPositions.find(e => e.aCurrentPosition.find(x => _.isEqual(x, aPosition))).idPosition
      }
      else {
        suffix = ""
      }
    }//console.log("suffix",suffix,"aPosition",aPosition,"aListOfcurrent", anArrayOfCurrentPositions)
  }
  return suffix
}

export function findPositionInCurrentPositions(indexLine, aListOfCurrentPosition) {
  return aListOfCurrentPosition.find(e => e.aPosition.line == indexLine || extractPositionFromId(e.anElementId).line == indexLine) ?
    (aListOfCurrentPosition.find(e => e.aPosition.line == indexLine) ? aListOfCurrentPosition.find(e => e.aPosition.line == indexLine).aPosition :
      extractPositionFromId(aListOfCurrentPosition.find(e => extractPositionFromId(e.anElementId).line == indexLine).anElementId)) : null
}

export function matrixToPosition(aMatrix) {// build a matrix of position with a given matrix
  let matrixPosition = aMatrix.map((e, i) => i == 0 ? e : e.map((x, j) => j == 0 ? x : (buildPosition(i, j, aMatrix) ? (buildPosition(i, j, aMatrix).length == 1 ?
    (_.isEqual(buildPosition(i, j, aMatrix)[0], buildNonNulPositionsLine(i, aMatrix)[buildNonNulPositionsLine(i, aMatrix).length - 1]) ? Array.of(Array.of(), Array.of(), Array.of(buildPosition(i, j, aMatrix)[0])) :
      Array.of(Array.of(buildPosition(i, j, aMatrix)[0]), Array.of(), Array.of())) :
    Array.of(Array.of(buildPosition(i, j, aMatrix)[0]), Array.of(), Array.of(buildPosition(i, j, aMatrix)[1]))) :
    Array.of(Array.of(), Array.of(), Array.of()))))
  return matrixPosition
}



export function emptyPositionsAndCoordinateOfFigures(aMatrixPosition, aMatrixCoordinate) {// build a matrix of figures (svg elements) with a given matrix of positions and a matrix of coordinates (with empty classNames)
  let emptyMatrixFigures = aMatrixPosition.map((e, i) => i == 0 ? e.map((x, j) => j == 0 ? (<g transform={'translate(' + aMatrixCoordinate[i][j][0] + ',' + aMatrixCoordinate[i][j][1] + ')'}><rect className="name" x="0" y="0" width={"" + aMatrixCoordinate[i][j][2]} height={"" + aMatrixCoordinate[i][j][3]}></rect>
    <text className="textname" alignmentBaseline="middle" textAnchor="middle" x={"" + aMatrixCoordinate[i][j][2] / 2} y={"" + aMatrixCoordinate[i][j][3] / 2}>{x}</text></g>) :
    (<g transform={'translate(' + aMatrixCoordinate[i][j][0] + ',' + aMatrixCoordinate[i][j][1] + ')'}><rect className="head" x="0" y="0" width={"" + aMatrixCoordinate[i][j][2]} height={"" + aMatrixCoordinate[i][j][3]}></rect>
      <text className="texthead" alignmentBaseline="middle" textAnchor="middle" x={"" + aMatrixCoordinate[i][j][2] / 2} y={"" + aMatrixCoordinate[i][j][3] / 2}>{x}</text></g>)) :
    e.map((x, j) => j == 0 ? (<g transform={'translate(' + aMatrixCoordinate[i][j][0] + ',' + aMatrixCoordinate[i][j][1] + ')'}><rect className="emptyIntrinsicName" x="0" y="0" width={"" + aMatrixCoordinate[i][j][2]} height={"" + aMatrixCoordinate[i][j][3]}></rect>
      <text className="emptyTextintrinsicName" alignmentBaseline="middle" textAnchor="middle" x={"" + aMatrixCoordinate[i][j][2] / 2} y={"" + aMatrixCoordinate[i][j][3] / 2}></text></g>) :
      x.map((t, l) => t.length == 0 ? (<g transform={'translate(' + aMatrixCoordinate[i][j][l][0] + ',' + aMatrixCoordinate[i][j][l][1] + ')'}><rect className="empty" x="0" y="0" width={"" + aMatrixCoordinate[i][j][l][2]} height={"" + aMatrixCoordinate[i][j][l][3]}></rect></g>) :
        (l == 0 ? (<g transform={'translate(' + aMatrixCoordinate[i][j][l][0] + ',' + aMatrixCoordinate[i][j][l][1] + ')'}><rect className="empty" x="0" y="0" width={"" + aMatrixCoordinate[i][j][l][2]} height={"" + aMatrixCoordinate[i][j][l][3]}></rect></g>) :
          (<g transform={'translate(' + aMatrixCoordinate[i][j][l][0] + ',' + aMatrixCoordinate[i][j][l][1] + ')'}><rect className="empty" x="0" y="0" width={"" + aMatrixCoordinate[i][j][l][2]} height={"" + aMatrixCoordinate[i][j][l][3]}></rect></g>)))))
  return emptyMatrixFigures
}

export function matrixToCoordinate(aMatrx, anOrigin, widthOfFigures, heightOfFigures) {//build a matrix of coordinates with a given matrix, origin, width and height of figures
  let matrixCoordinate = aMatrx.map((e, i) => i == 0 ? e.map((x, j) => Array.of(anOrigin + j * widthOfFigures, anOrigin + i * heightOfFigures, widthOfFigures, heightOfFigures)) :
    e.map((x, j) => j == 0 ? Array.of(anOrigin + j * widthOfFigures, anOrigin + i * heightOfFigures, widthOfFigures, heightOfFigures) :
      Array.of(Array.of(anOrigin + j * widthOfFigures, anOrigin + i * heightOfFigures, widthOfFigures, heightOfFigures / 3),
        Array.of(anOrigin + j * widthOfFigures, anOrigin + (3 * i + 1) * heightOfFigures / 3, widthOfFigures, heightOfFigures / 3),
        Array.of(anOrigin + j * widthOfFigures, anOrigin + (3 * i + 2) * heightOfFigures / 3, widthOfFigures, heightOfFigures / 3))))
  return matrixCoordinate
}


export function removeDuplicatesFromArray(anArray) {
  return [...new Set(anArray.map(o => JSON.stringify(o)))].map(s => JSON.parse(s))
}

export function removeDuplicatesEltsFromArray(anArray) {
  return anArray.reduce((acc, e) => !acc.find(x => x.props.id == e.props.id) ? [e, ...acc] : acc, [])
}

export function constructPositionFromId(anIdOfFirstColumnPosition) {
  let myArray = /(\d+)name\S*line(\d+)/g.exec(anIdOfFirstColumnPosition)
  let line = parseInt(myArray[1], 10)
  let codeLine = parseInt(myArray[2], 10)
  return { line: line, column: 0, rank: 0, codeLine: codeLine }
}

export function constructDescription(aSimdFunction, aDescriptionFile, returnType) {// take a name of a function (which return returnType) and construct a look-like manufacturer description using a file provide by the manufacturer (Intel)
  var objectDescription;
  if (returnType) {
    objectDescription = aDescriptionFile.intrinsic.find(o => (o._name.toLocaleLowerCase() == aSimdFunction.toLocaleLowerCase()) && (returnType.toLocaleLowerCase() == o._rettype.toLocaleLowerCase()));
  }
  else {
    objectDescription = aDescriptionFile.intrinsic.find(o => o._name.toLocaleLowerCase() == aSimdFunction.toLocaleLowerCase());
  }
  let parameter = !objectDescription.hasOwnProperty("parameter") ? "void" : objectDescription.parameter;
  objectDescription = { ...objectDescription, parameter }//we add parameter property if it doesn't yet exist
  let line1 = `${objectDescription._rettype} ${objectDescription._name} (${Array.isArray(objectDescription.parameter) ? objectDescription.parameter.flatMap((e, i) => i < objectDescription.parameter.length - 1 ? [e._type, e._varname + ","] : [e._type, e._varname]).join(" ") : objectDescription.parameter})`;
  let line2 = `Synopsis \n\t\t${line1} \n\t\t#include <${objectDescription.header}>\n\t\tInstruction: ${objectDescription.hasOwnProperty("instruction") ? objectDescription.instruction[0]._name + " " + objectDescription.instruction[0]._form : "sequence"}\n\t\t${objectDescription.hasOwnProperty("CPUID") ? "CPUID Flags: " + objectDescription.CPUID : ""} `;
  let line3 = `Description \n\t\t${objectDescription.description}`;
  let line4 = `Operation \n\t\t${objectDescription.operation.replaceAll('\t', '\t\t').replaceAll('\n', '\n\t\t')}`;
  return [objectDescription, `${line1}\n\n\t${line2}\n\n\t${line3}\n\n\t${line4}`];
}

export function constructDataListTable(aSimdDescriptionFile) {// take a file provide the manufacturer (like Intel) where simd instructions are describe and return a table with the name of simd instructions on others featurest
  return aSimdDescriptionFile.intrinsic.map(e => {
    let parameter = !e.hasOwnProperty("parameter") ? "void" : e.parameter;
    let objectDescription = e;
    objectDescription = { ...objectDescription, parameter }//we add parameter property if it doesn't yet exist
    let line1 = `${objectDescription._rettype} ${objectDescription._name} (${Array.isArray(objectDescription.parameter) ? objectDescription.parameter.flatMap((e, i) => i < objectDescription.parameter.length - 1 ? [e._type, e._varname + ","] : [e._type, e._varname]).join(" ") : objectDescription.parameter})`;
    let line2 = `Synopsis \n\t\t${line1} \n\t\t#include <${objectDescription.header}>\n\t\tInstruction: ${objectDescription.hasOwnProperty("instruction") ? objectDescription.instruction[0]._name + " " + objectDescription.instruction[0]._form : "sequence"}\n\t\t${objectDescription.hasOwnProperty("CPUID") ? "CPUID Flags: " + objectDescription.CPUID : ""} `;
    let line3 = `Description \n\t\t${objectDescription.description}`;
    let line4 = typeof (objectDescription.operation) === "string" ? `Operation \n\t\t${objectDescription.operation.replaceAll('\t', '\t\t').replaceAll('\n', '\n\t\t')}` : `Operation \n\t\t No operation`;
    return [objectDescription._name, objectDescription._rettype, objectDescription.parameter, `${line1}\n\n\t${line2}\n\n\t${line3}\n\n\t${line4}`]
  });
}

export function computeOperandsAndresultElt(aSimdDescriptionFile) {// take a file provide the manufacturer (like Intel) where simd instructions are describe and return and array of objects {name:"nameOfIntrinsicInstruction", retype:"returnType",operands:[], result: [], varnames:[], types:[], sizeOfScalarFiel:0} desscribing each instruction
  return aSimdDescriptionFile.intrinsic.map(e => {
    var obj = {};
    let name = e._name;
    obj = { ...obj, name };
    var regTypeNumber = /(?<=_m|__m|_int|__int)\d+/g;
    var regextractSizeFromDesc = /\d+(?=-bit)/g;// We have notice that the size of scalar unit of a vector instruction can be assimilated to a x-bit expression in the description of tha instruction
    let arrayOfMinimunSizeInDescription=e.description.match(regextractSizeFromDesc);
    const sizeOfScalarField = arrayOfMinimunSizeInDescription? Math.min(...arrayOfMinimunSizeInDescription):1;
    var maxSize = sizeOfScalarField;
    obj = { ...obj, sizeOfScalarField };
    var result = [];
    if (e._rettype) {
      let retType = e._rettype;
      obj = { ...obj, retType };
      let retTypeNumber = e._rettype.match(regTypeNumber);
      retTypeNumber = retTypeNumber ? retTypeNumber[0] : 0;
      maxSize = retTypeNumber > maxSize ? retTypeNumber : maxSize;
      if (retTypeNumber != 0) {
        let size = retTypeNumber / sizeOfScalarField;
        for (let i = 0; i < size; i++) {
          result = [...result, i]
        }
      }
      obj = { ...obj, result };
    }
    var operands = [], varnames = [], types = [];
    if (e.parameter && Array.isArray(e.parameter)) {
      e.parameter.forEach((element, k) => {
        if (element._type) {
          types[k] = element._type.split(" ")[element._type.split(" ").length - 1];
          varnames[k] = element._varname;
          obj = { ...obj, varnames, types};
          let operandNumber = types[k].match(regTypeNumber);
          var operand = [];
          if (operandNumber) {
            let operandSize = operandNumber[0];
            maxSize = operandSize > maxSize ? operandSize : maxSize;
            let size = operandSize / sizeOfScalarField;
            for (let i = 0; i < size; i++) {
              operand = [...operand, i]
            }
            operands = [...operands, operand];
            obj = { ...obj, operands };
          }
          else {
            let fieldArray = types[k].match(/(?<=_m|__m|_int|__int)\w*mask\w*/g);
            let operandSize = (fieldArray || element._varname == "imm8") ? maxSize : sizeOfScalarField;
            let size = operandSize / sizeOfScalarField;
            for (let i = 0; i < size; i++) {
              operand = [...operand, i];
            }
            operands = [...operands, operand];
            obj = { ...obj, operands };
          }
        }
      });
    }
    if (result.length == 0 && e._rettype.match(/(?<=_m|__m|_int|__int)\w*mask\w*/g)) {
      let size = maxSize / sizeOfScalarField;
      for (let i = 0; i < size; i++) {
        result = [...result, i]
      }
      obj = { ...obj, result };
    }
    return obj;
  })
}


export function buildMessage(operators, operands) {
  const globalTab = (Array.isArray(operands) && Array.isArray(operators)) ?
    [...operands, ...operators] : (Array.isArray(operators) ?
      operands : (Array.isArray(operators) ? operators : []));
  var message = globalTab.sort((o1, o2) => o1.rank - o2.rank).map(o => {
    if (o.hasOwnProperty("idOperand")) {

      return document.getElementById(o.idOperand).textContent;
    }
    else if (o.hasOwnProperty("idOperator")) {
      return document.getElementById(o.idOperator).textContent;
    }

    else {
      return "";
    }
  }).join('');
  return message
}
