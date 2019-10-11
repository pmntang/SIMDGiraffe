import React, {Component} from "react";
import * as _ from "lodash";
import "../css/VectorRegister.css";
import "../css/ViewOnTable.css";
import "../css/ViewOnSvg.css";
import 'array-flat-polyfill';
import * as myLib from "./myLibrary.js";
import './ViewOnTable';
import './ViewOnSvg';
import 'underscore';
import ViewOnSvg from "./ViewOnSvg";
import ViewOnTable from "./ViewOnTable";

const prefix=["vp", "v","p"]
const suffix=["dqa","ps", "sb", "ss","pd","sd","ud","q","w", "b", "d","s"]//"dq",

class VectorRegister extends React.Component {
    constructor(props) {
        super(props);
        this.registers=myLib.instructionsByRegisterBySteps(props.instructions)
        this.matrix=myLib.renameRegister(myLib.buildMatrixRegInt(this.registers, props.instructions))
        this.renameInstrunctionMatrix=myLib.removeSuffix(suffix, myLib.removePrefix(prefix, this.matrix))
        this.matrixPosition=myLib.matrixToPosition(this.renameInstrunctionMatrix)
        //this.processEvent=this.processEvent.bind(this)
        this.positionInit={line:1,column:0, rank:0, codeLine:this.matrix[1][0].line}
        this.arrayOfSelectePositionsInit=[]
        this.state = {
            position: this.positionInit,
           // tableBody:this.tableBodyInit,
            listOfPath:[],
            arrayOfCurrentPositions:this.arrayOfSelectePositionsInit
    };
    }

    componentDidMount() { //console.log(positionsAndCoordinateToFigures(this.matrixPosition, matrixToCoordinate(this.renameInstrunctionMatrix, 0, 100, 25)), "tailles",window.innerHeight, window.innerWidth)
      /* // this.displayFullMatrix ()
         this.timerID = setInterval(
          () => this.processPath (),
          500
         );
        this.timerID = setInterval(
         () => this.display(),
         1500
        );*/
    }/*
      componentDidUpdate(prevProps, prevState, snapshot){
        const list = this.listRef.current;
        console.log(document.getElementsByTagName("p"));
      }*/



    render(){

        return( 
        
            <div className="registerUsed"> 
                
                <div className="controlButton">  </div>
                 <ViewOnSvg registers={this.registers} matrix={this.matrix} asm={this.props.asm} instructions={this.props.instructions}
                 renameInstrunctionMatrix={this.renameInstrunctionMatrix} matrixPosition={this.matrixPosition} cm={this.props.cm}
                  position={this.state.position} arrayOfCurrentPositions={this.state.arrayOfCurrentPositions} description={this.props.description}/>
 
            </div>
   )
    }
    componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
     // if (this.props.userID !== prevProps.userID) {
      //  this.fetchData(this.props.userID);
     // }
     //console.log(this.matrix,"this.renameInstrunctionMatrix", myLib.matrixToPosition(this.matrix), "this.tableBodyInit", this.tableBodyInit, "test",this.retrieveUntilAPosition(this.state.position, myLib.matrixToPosition(this.matrix)), "position",this.state.position)
     //console.log("les positions",this.positionsToTableColor(this.matrixPosition,this.state.arrayOfCurrentPositions ))
    }
}



export default VectorRegister;