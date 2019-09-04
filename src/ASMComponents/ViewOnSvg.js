import React, {Component} from "react";
import * as _ from "lodash";
import "../css/VectorRegister.css";
import 'array-flat-polyfill';
import 'underscore';

function matrixToCoordinate(aMatrx, anOrigin, widthOfFigures, heightOfFigures){//build a matrix of coordinates with a given matrix, origin, width and height of figures
  let matrixCoordinate= aMatrx.map((e,i)=>i==0?e.map((x,j)=>Array.of(anOrigin+j*widthOfFigures,anOrigin+i*heightOfFigures, widthOfFigures, heightOfFigures)):
                                e.map((x,j)=>j==0?Array.of(anOrigin+j*widthOfFigures,anOrigin+i*heightOfFigures, widthOfFigures, heightOfFigures):
                                                  Array.of(Array.of(anOrigin+j*widthOfFigures,anOrigin+i*heightOfFigures,widthOfFigures,heightOfFigures/3), 
                                                           Array.of(anOrigin+j*widthOfFigures,anOrigin+(3*i+1)*heightOfFigures/3,widthOfFigures,heightOfFigures/3),
                                                           Array.of(anOrigin+j*widthOfFigures,anOrigin+(3*i+2)*heightOfFigures/3,widthOfFigures,heightOfFigures/3))))
      return matrixCoordinate
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

class ViewOnSvg extends React.Component {
    constructor(props) {
        super(props);
        this.registers="instructionsByRegisterBySteps(props.instructions)"
        this.matrix="renameRegister(buildMatrixRegInt(this.registers, props.instructions))"

        this.state = {
            position: "this.positionInit",
            tableBody:"this.tableBodyInit",
            listOfPath:[],
            arrayOfCurrentPositions:"this.arrayOfSelectePositionsInit"
    };
    }

    componentDidMount() { 
        console.log("figure", this.props.figures)
    }
      componentWillUnmount() {

      }
    
     

    render(){
      

        return( 
        
            
                <svg width="100%" height="100%" id="svgTable" className="svgVisualization">{positionsAndCoordinateToFigures(this.props.matrixPosition, matrixToCoordinate(this.props.renameInstrunctionMatrix, 0, 200, 75))}</svg>

   )
    }
    componentDidUpdate(prevProps) {

    }
}



export default ViewOnSvg;