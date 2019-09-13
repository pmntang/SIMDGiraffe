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
            option:"svg",
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
      componentWillUnmount() {
        if (this.hightlightedline) this.hightlightedline.clear();
        //clearInterval(this.timerID);
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
    render(){
      
        if (this.hightlightedline) this.hightlightedline.clear();//console.log("id document",maxPosition(this.matrix));
        this.hightlightedline=this.highlightCode();
        //const k=this.dhighlightCode().clear();
        return( 
        
            <div className="registerUsed"> 
                
                <div className="controlButton">  </div>
                <div className="visualization"><h6 className="text">Semantic visualization of the execution of the program {this.props.asm[0].name} <br/>Executed on <span className="registers">{this.registers.length} registers</span> in <span className="instructions">{this.props.instructions.length} instructions</span></h6>
                {(this.state.option=="table" && <ViewOnTable registers={this.registers} matrix={this.matrix} 
                renameInstrunctionMatrix={this.renameInstrunctionMatrix} matrixPosition={this.matrixPosition} 
                position={this.state.position} arrayOfCurrentPositions={this.state.arrayOfCurrentPositions}/>)
                 ||
                 (this.state.option=="svg" && <ViewOnSvg registers={this.registers} matrix={this.matrix} 
                 renameInstrunctionMatrix={this.renameInstrunctionMatrix} matrixPosition={this.matrixPosition}
                  position={this.state.position} arrayOfCurrentPositions={this.state.arrayOfCurrentPositions}/>)}
                </div>
                <div className="presentation" className="text"><h6><strong><span className="description">{this.props.description.find(x=>x.intrinsic.toLowerCase()==this.matrix[this.state.position.line][0].name).intrinsic}</span> : {this.props.description.find(x=>x.intrinsic.toLowerCase()==this.matrix[this.state.position.line][0].name).description}</strong></h6>
              </div>
 
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