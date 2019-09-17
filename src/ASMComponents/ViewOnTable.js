import React, {Component} from "react";
import * as _ from "lodash";
<<<<<<< HEAD
import "../css/VectorRegister.css";
=======
import * as myLib from "./myLibrary.js";
import "../css/VectorRegister.css";
import "../css/ViewOnTable.css";
>>>>>>> drawnOnSvg
import 'array-flat-polyfill';
import 'underscore';


<<<<<<< HEAD

class ViewOnTable extends React.Component {
    constructor(props) {
        super(props);
        this.registers=instructionsByRegisterBySteps(props.instructions)
        this.matrix=renameRegister(buildMatrixRegInt(this.registers, props.instructions))
        this.renameInstrunctionMatrix=removeSuffix(suffix, removePrefix(prefix, this.matrix))
        this.matrixPosition=matrixToPosition(this.renameInstrunctionMatrix)
        this.processEvent=this.processEvent.bind(this)
        this.positionInit={line:1,column:0, rank:0, codeLine:this.matrix[1][0].line}
        this.arrayOfSelectePositionsInit=[]
        this.tableBodyInit=this.matrix.map((e,i)=>i==0?<tr>{this.positionsToTableColor(this.matrixPosition, this.arrayOfSelectePositionsInit)[i]}</tr>://initialization of a matrix (tableBodyInit)with empty cells except the first line which receives a cell with the name of registers.
                                                 (i==1?this.retrieveUntilAPosition(this.positionInit, this.matrixPosition, this.arrayOfSelectePositionsInit):this.retrieveLine(this.emptyPositionsOfTable(this.matrixPosition)[i]))) //initializeFirstLineMatrix(i, this.renameInstrunctionMatrix):initializeLinesMatrix(i, this.renameInstrunctionMatrix) e.map((x,j)=>j==0?<tr><th className="intrinsicName" rowspan="3" scope="rowgroup"><span className="intrinsicName">{this.matrix[1][0].name.toUpperCase()}</span></th><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>:<tr><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>):
                                                       //(e.map((x,j)=>j==0?<tr><th className="empty"   rowspan="3" scope="rowgroup"><span className="empty"></span></th><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>:<tr><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>))))
        this.state = {
            option:"svg",
            position: this.positionInit,
=======
class ViewOnTable extends React.Component {
    constructor(props) {
        super(props);
        this.registers=props.registers
        this.matrix=props.matrix
        this.renameInstrunctionMatrix=props.renameInstrunctionMatrix
        this.matrixPosition=props.matrixPosition
        this.processEvent=this.processEvent.bind(this)
        this.position=props.position
        this.arrayOfSelectePositionsInit=[]
        this.tableBodyInit=this.matrix.map((e,i)=>i==0?<tr>{this.positionsToTableColor(this.matrixPosition, this.arrayOfCurrentPosition)[i]}</tr>://initialization of a matrix (tableBodyInit)with empty cells except the first line which receives a cell with the name of registers.
                                                 (i==1?this.retrieveUntilAPosition(this.position, this.matrixPosition, this.arrayOfCurrentPosition):this.retrieveLine(this.emptyPositionsOfTable(this.matrixPosition)[i]))) //initializeFirstLineMatrix(i, this.renameInstrunctionMatrix):initializeLinesMatrix(i, this.renameInstrunctionMatrix) e.map((x,j)=>j==0?<tr><th className="intrinsicName" rowspan="3" scope="rowgroup"><span className="intrinsicName">{this.matrix[1][0].name.toUpperCase()}</span></th><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>:<tr><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>):
                                                       //(e.map((x,j)=>j==0?<tr><th className="empty"   rowspan="3" scope="rowgroup"><span className="empty"></span></th><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>:<tr><td ><span className="empty"></span></td><td ><span className="empty"></span></td><td ><span className="empty"></span></td></tr>))))
        this.state = {
            position: this.position,
>>>>>>> drawnOnSvg
            tableBody:this.tableBodyInit,
            listOfPath:[],
            arrayOfCurrentPositions:this.arrayOfSelectePositionsInit
    };
    }
<<<<<<< HEAD

    componentDidMount() { //console.log(positionsAndCoordinateToFigures(this.matrixPosition, matrixToCoordinate(this.renameInstrunctionMatrix, 0, 100, 25)), "tailles",window.innerHeight, window.innerWidth)
        this.displayFullMatrix ()
         this.timerID = setInterval(
          () => this.processPath (),
          500
         );/*
=======
    componentDidMount() { //console.log(positionsAndCoordinateToFigures(this.matrixPosition, matrixToCoordinate(this.renameInstrunctionMatrix, 0, 100, 25)), "tailles",window.innerHeight, window.innerWidth)
        this.displayFullMatrix ()
        this.timerID = setInterval(
          () => this.processPath (),
          500
        );/*
>>>>>>> drawnOnSvg
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
<<<<<<< HEAD
        if (this.hightlightedline) this.hightlightedline.clear();
=======
>>>>>>> drawnOnSvg
        clearInterval(this.timerID);
      }
    
      display() {
        this.setState(function(state){
          let position=state.position
          let tableBody=state.tableBody
          let arrayOfCurrentPositions=state.arrayOfCurrentPositions
<<<<<<< HEAD
          position=advancePosition(position, this.matrix)
          tableBody=tableBody.map((e,i)=>i!=position.line?e:this.retrieveLinePosition(position, arrayOfCurrentPositions))
          if(position.line==1 && position.rank==0){//clearInterval(this.timerID);position=maxPosition(this.matrix);tableBody=state.tableBody
=======
          position=myLib.advancePosition(position, this.matrix)
          tableBody=tableBody.map((e,i)=>i!=position.line?e:this.retrieveLinePosition(position, arrayOfCurrentPositions))
          if(position.line==1 && position.rank==0){//clearInterval(this.timerID);position=myLib.maxPosition(this.matrix);tableBody=state.tableBody
>>>>>>> drawnOnSvg
           tableBody=this.tableBodyInit

          }
        return{position:position,tableBody:tableBody,arrayOfCurrentPositions:arrayOfCurrentPositions}
        });

      }

      displayMatrix() {
        this.setState(function(state){
          let position=state.position
          let tableBody=state.tableBody
          let arrayOfSelectePositions=state.arrayOfCurrentPositions
<<<<<<< HEAD
          position=advancePosition(position, this.matrix)
          tableBody=tableBody.map((e,i)=>i<position.line?e:
                                        (i==position.line?this.retrieveUntilAPosition(position, this.matrixPosition, arrayOfSelectePositions):e))
          if(position.line==1 && position.rank==0){//clearInterval(this.timerID);position=maxPosition(this.matrix);tableBody=state.tableBody
=======
          position=myLib.advancePosition(position, this.matrix)
          tableBody=tableBody.map((e,i)=>i<position.line?e:
                                        (i==position.line?this.retrieveUntilAPosition(position, this.matrixPosition, arrayOfSelectePositions):e))
          if(position.line==1 && position.rank==0){//clearInterval(this.timerID);position=myLib.maxPosition(this.matrix);tableBody=state.tableBody
>>>>>>> drawnOnSvg
           tableBody=this.tableBodyInit

          }
        return{position:position,tableBody:tableBody,arrayOfCurrentPositions:arrayOfSelectePositions}
        });

      }
      processPath(){
        this.setState(function(state){
          let arrayOfCurrentPositions=state.arrayOfCurrentPositions
<<<<<<< HEAD
          arrayOfCurrentPositions=advanceSelectPositions(arrayOfCurrentPositions, this.renameInstrunctionMatrix) 
=======
          arrayOfCurrentPositions=myLib.advanceSelectPositions(arrayOfCurrentPositions, this.renameInstrunctionMatrix) 
>>>>>>> drawnOnSvg
          return {arrayOfCurrentPositions:arrayOfCurrentPositions}
        });
        this.displayFullMatrix()
      }
      processEvent(anEvent){
          let id=anEvent.target.getAttribute("id")
          this.setState(function(state){
          let arrayOfCurrentPositions=state.arrayOfCurrentPositions
<<<<<<< HEAD
          arrayOfCurrentPositions=updateArrayOfCurrentPositions(arrayOfCurrentPositions, id, this.matrix)
=======
          arrayOfCurrentPositions=myLib.updateArrayOfCurrentPositions(arrayOfCurrentPositions, id, this.matrix)
>>>>>>> drawnOnSvg
          return {arrayOfCurrentPositions:arrayOfCurrentPositions}
        })
        this.processPath()
      }

      displayFull (){
        this.setState(function(state){
          let position=state.position
          let tableBody=state.tableBody
          let arrayOfCurrentPositions=state.arrayOfCurrentPositions
          do{
<<<<<<< HEAD
            position=advancePosition(position, this.matrix)
            tableBody=tableBody.map((e,i)=>i!=position.line?e:this.retrieveLinePosition(position, arrayOfCurrentPositions)) 
          }while(!_.isEqual(position, maxPosition(this.matrix))); console.log("tablebidyDM", tableBody)
=======
            position=myLib.advancePosition(position, this.matrix)
            tableBody=tableBody.map((e,i)=>i!=position.line?e:this.retrieveLinePosition(position, arrayOfCurrentPositions)) 
          }while(!_.isEqual(position, myLib.maxPosition(this.matrix)))
>>>>>>> drawnOnSvg
          return{position:position, tableBody:tableBody, arrayOfCurrentPositions:arrayOfCurrentPositions}
        });
      }
      displayFullMatrix (){
        this.setState(function(state){
          let tableBody=state.tableBody
          let arrayOfSelectePositions=state.arrayOfCurrentPositions
          tableBody=this.matrix.map((e,i)=>i==0?<tr>{this.positionsToTableColor(this.matrixPosition, arrayOfSelectePositions)[i]}</tr>:this.retrieveLine(this.positionsToTableColor(this.matrixPosition, arrayOfSelectePositions)[i]))
          return {tableBody:tableBody}
        });
      }


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


<<<<<<< HEAD
    positionsToTableColor(aMatrixPosition, anArrayOfCurrentPositions){//table version of positionsAndCoordinateToFigures
      let matrixTable=aMatrixPosition.map((e,i)=>i==0?e.map((x,j)=>j==0?<th className="name" >{x}</th>: <th className="head" >{x}</th> ):
                                                  e.map((x,j)=>j==0?(<th rowSpan="3" scope="rowgroup" className="intrinsicName">{aMatrixPosition[i][j].name.toUpperCase()}</th>):
                                                                      x.map((t,l)=>t.length==0?(<td className="empty"></td>):
                                                                                                 (l==0?(<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent} id={"inl"+t[0].line+"c"+t[0].column+"r"+t[0].rank+"z"+t[0].codeLine} className={"in"+computeSuffix(t[0], anArrayOfCurrentPositions)}></td>):
                                                                                                   (<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent} id={"outl"+t[0].line+"c"+t[0].column+"r"+t[0].rank+"z"+t[0].codeLine} className={"out"+computeSuffix(t[0], anArrayOfCurrentPositions)}></td> )))))
=======
    positionsToTableColor(aMatrixPosition, anArrayOfCurrentPositions){//table version of positionsAndCoordinateToFigures, animate version
      let matrixTable=aMatrixPosition.map((e,i)=>i==0?e.map((x,j)=>j==0?<th className="name" >{x}</th>: <th className="head" >{x}</th> ):
                                                  e.map((x,j)=>j==0?(<th rowSpan="3" scope="rowgroup" className="intrinsicName">{aMatrixPosition[i][j].name.toUpperCase()}</th>):
                                                                      x.map((t,l)=>t.length==0?(<td className="empty"></td>):
                                                                                                 (l==0?(<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent} id={"inl"+t[0].line+"c"+t[0].column+"r"+t[0].rank+"z"+t[0].codeLine} className={"in"+myLib.computeSuffix(t[0], anArrayOfCurrentPositions)}></td>):
                                                                                                   (<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent} id={"outl"+t[0].line+"c"+t[0].column+"r"+t[0].rank+"z"+t[0].codeLine} className={"out"+myLib.computeSuffix(t[0], anArrayOfCurrentPositions)}></td> )))))
>>>>>>> drawnOnSvg
      return matrixTable
    }


    emptyPositionsOfTable(aMatrixPosition){//table version of emptyPositionsAndCoordinateOfFigures
      let emptyMatrixTable=aMatrixPosition.map((e,i)=>i==0?e.map((x,j)=>j==0?(<th className="name" >{x}</th>): <th className="head" >{x}</th> ):
                                                  e.map((x,j)=>j==0?(<th rowSpan="3" scope="rowgroup" className="emptyIntrinsicName"></th>): x.map(t=><td className="empty"></td>)))
      return emptyMatrixTable
    }

    
     retrieveUntilAPosition(aPosition, aMatrixOfPositions, anArrayOfCurrentPositions){ 
      let aLigne=aMatrixOfPositions[aPosition.line]
      let aLigneOfPositionsTable=this.positionsToTableColor(aMatrixOfPositions, anArrayOfCurrentPositions)[aPosition.line]
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
    retrieveLinePosition(aPosition, arrayOfCurrentPositions){
<<<<<<< HEAD
      //computeSuffix(aPosition, arrayOfCurrentPositions, aListOfPosition)
      let id=buildNonNulPositionsLine(aPosition.line, this.matrix)//this is to know later which cell of the table to adress
=======
      //myLib.computeSuffix(aPosition, arrayOfCurrentPositions, aListOfPosition)
      let id=myLib.buildNonNulPositionsLine(aPosition.line, this.matrix)//this is to know later which cell of the table to adress
>>>>>>> drawnOnSvg
      let id1=id.length>=2?"l"+id[1].line+"c"+id[1].column+"r"+id[1].rank+"z"+id[1].codeLine:null //"l"+id[1].line+"c"+id[1].column+"r"+id[1].rank+"z"+id[1].codeLine
      let id2=id.length>=3?"l"+id[2].line+"c"+id[2].column+"r"+id[2].rank+"z"+id[2].codeLine:null //"l"+id[2].line+"c"+id[2].column+"r"+id[2].rank+"z"+id[2].codeLine
      let id3=id.length>=4?"l"+id[3].line+"c"+id[3].column+"r"+id[3].rank+"z"+id[3].codeLine:null  //"l"+id[3].line+"c"+id[3].column+"r"+id[3].rank+"z"+id[3].codeLine
      let idl=id.length>0?"l"+id[id.length-1].line+"c"+id[id.length-1].column+"r"+id[id.length-1].rank+"z"+id[id.length-1].codeLine:null //"l"+id[id.length-1].line+"c"+id[id.length-1].column+"r"+id[id.length-1].rank+"z"+id[id.length-1].codeLine
<<<<<<< HEAD
      let preRetriveMatrixLine=preRetrieveLinePosition(aPosition, this.renameInstrunctionMatrix)//; console.log(aPosition.line, "preRetriveMatrixLine", preRetriveMatrixLine, "matrix", this.renameInstrunctionMatrix[aPosition.line])
=======
      let preRetriveMatrixLine=myLib.preRetrieveLinePosition(aPosition, this.renameInstrunctionMatrix)//; console.log(aPosition.line, "preRetriveMatrixLine", preRetriveMatrixLine, "matrix", this.renameInstrunctionMatrix[aPosition.line])
>>>>>>> drawnOnSvg
      var ligne1=<th rowSpan="3" scope="rowgroup" className="intrinsicName">{preRetriveMatrixLine[0].name.toUpperCase()}</th>, ligne2=null, ligne3=null;
      for(let j=1; j<preRetriveMatrixLine.length; j++){
        if(preRetriveMatrixLine[j]){
          let statePos=preRetriveMatrixLine[j]
          switch(statePos){
<<<<<<< HEAD
            case "in1":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id1} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
            break;
            case "in2":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id2} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
            break;
            case "in3":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id3} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
            break;
            case "out":{ligne1=<React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={idl}  className={"out"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[buildPosition(aPosition.line, j, this.matrix).length-1], arrayOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
            break
            case "inout1":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id1} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={idl} className={"out"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[buildPosition(aPosition.line, j, this.matrix).length-1], arrayOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
            break
            case "inout2":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id2} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={idl} className={"out"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[buildPosition(aPosition.line, j, this.matrix).length-1], arrayOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
            break
            case "inout3":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id3} className={"in"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent} id={idl} className={"out"+computeSuffix(buildPosition(aPosition.line, j, this.matrix)[buildPosition(aPosition.line, j, this.matrix).length-1], arrayOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
=======
            case "in1":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id1} className={"in"+myLib.computeSuffix(myLib.buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
            break;
            case "in2":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id2} className={"in"+myLib.computeSuffix(myLib.buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
            break;
            case "in3":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id3} className={"in"+myLib.computeSuffix(myLib.buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
            break;
            case "out":{ligne1=<React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleonMouseLeave}  id={idl}  className={"out"+myLib.computeSuffix(myLib.buildPosition(aPosition.line, j, this.matrix)[myLib.buildPosition(aPosition.line, j, this.matrix).length-1], arrayOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
            break
            case "inout1":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id1} className={"in"+myLib.computeSuffix(myLib.buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={idl} className={"out"+myLib.computeSuffix(myLib.buildPosition(aPosition.line, j, this.matrix)[myLib.buildPosition(aPosition.line, j, this.matrix).length-1], arrayOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
            break
            case "inout2":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id2} className={"in"+myLib.computeSuffix(myLib.buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={idl} className={"out"+myLib.computeSuffix(myLib.buildPosition(aPosition.line, j, this.matrix)[myLib.buildPosition(aPosition.line, j, this.matrix).length-1], arrayOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
            break
            case "inout3":{ligne1=<React.Fragment>{ligne1}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent}  id={id3} className={"in"+myLib.computeSuffix(myLib.buildPosition(aPosition.line, j, this.matrix)[0], arrayOfCurrentPositions)}>&#x21D7;</td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent} id={idl} className={"out"+myLib.computeSuffix(myLib.buildPosition(aPosition.line, j, this.matrix)[myLib.buildPosition(aPosition.line, j, this.matrix).length-1], arrayOfCurrentPositions)}>&#x21D9;</td></React.Fragment>}
>>>>>>> drawnOnSvg
            break
          }
        }
        else{
          {ligne1=<React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>; ligne2=<React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>; ligne3=<React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>}
        }
  
      }//console.log("lignes", ligne1, ligne2, ligne3, "aPosition", aPosition, "listOfCurrentPos", arrayOfCurrentPositions)
      return <tbody><tr>{ligne1}</tr><tr>{ligne2}</tr><tr>{ligne3}</tr></tbody> 
    }
    

    render(){//console.log("id document",document.querySelectorAll("td[class*='in']"))
      
<<<<<<< HEAD
        if (this.hightlightedline) this.hightlightedline.clear();//console.log("id document",maxPosition(this.matrix));
        this.hightlightedline=this.highlightCode();
        //const k=this.dhighlightCode().clear();
        return( 

            <div className="registerUsed">{ 
            this.state.option=="svg" && <React.Fragment>
                <div className="controlButton">  </div>
                <div className="visualization"><h6 className="text">Semantic visualization of the execution of the program {this.props.asm[0].name} <br/>Executed on <span className="registers">{this.registers.length} registers</span> in <span className="instructions">{this.props.instructions.length} instructions</span></h6>
                <ViewOnSvg matrixPosition={this.matrixPosition} renameInstrunctionMatrix={this.renameInstrunctionMatrix} />
                </div>
                <div className="presentation" className="text"><h6><strong><span className="description">{this.props.description.find(x=>x.intrinsic.toLowerCase()==this.matrix[this.state.position.line][0].name).intrinsic}</span> : {this.props.description.find(x=>x.intrinsic.toLowerCase()==this.matrix[this.state.position.line][0].name).description}</strong></h6>
              </div></React.Fragment>}
            </div>
=======
        //if (this.hightlightedline) this.hightlightedline.clear();//console.log("id document",myLib.maxPosition(this.matrix));
        //this.hightlightedline=this.highlightCode();
        //const k=this.dhighlightCode().clear();
        return( 

              <table className="visualization"><thead>{this.state.tableBody.map((e,i)=>i==0?e:null)}</thead> {this.state.tableBody.map((e,i)=>i==0?null:e)}</table> 
>>>>>>> drawnOnSvg
   )
    }
    componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
<<<<<<< HEAD
     // if (this.props.userID !== prevProps.userID) {
      //  this.fetchData(this.props.userID);
=======
     // if (myLib.userID !== prevProps.userID) {
      //  this.fetchData(myLib.userID);
>>>>>>> drawnOnSvg
     // }
     //console.log(this.matrix,"this.renameInstrunctionMatrix", matrixToPosition(this.matrix), "this.tableBodyInit", this.tableBodyInit, "test",this.retrieveUntilAPosition(this.state.position, matrixToPosition(this.matrix)), "position",this.state.position)
     //console.log("les positions",this.positionsToTableColor(this.matrixPosition,this.state.arrayOfCurrentPositions ))
    }
}



export default ViewOnTable;