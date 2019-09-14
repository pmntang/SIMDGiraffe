import React, {Component} from "react";
import * as _ from "lodash";
import * as myLib from "./myLibrary.js";
import "../css/VectorRegister.css";
import "../css/ViewOnSvg.css";
import 'array-flat-polyfill';
import 'underscore';
/*
function myLib.matrixToCoordinate(aMatrx, anOrigin, widthOfFigures, heightOfFigures){//build a matrix of coordinates with a given matrix, origin, width and height of figures
  let matrixCoordinate= aMatrx.map((e,i)=>i==0?e.map((x,j)=>Array.of(anOrigin+j*widthOfFigures,anOrigin+i*heightOfFigures, widthOfFigures, heightOfFigures)):
                                e.map((x,j)=>j==0?Array.of(anOrigin+j*widthOfFigures,anOrigin+i*heightOfFigures, widthOfFigures, heightOfFigures):
                                                  Array.of(Array.of(anOrigin+j*widthOfFigures,anOrigin+i*heightOfFigures,widthOfFigures,heightOfFigures/3), 
                                                           Array.of(anOrigin+j*widthOfFigures,anOrigin+(3*i+1)*heightOfFigures/3,widthOfFigures,heightOfFigures/3),
                                                           Array.of(anOrigin+j*widthOfFigures,anOrigin+(3*i+2)*heightOfFigures/3,widthOfFigures,heightOfFigures/3))))
      return matrixCoordinate
}
*/

function widthOfSvg(aMatrix, aWidthOfFigures){
  return ""+aMatrix[0].length*aWidthOfFigures
}
function heightOfSvg(aMatrix, aHeightOfFigures){
  return ""+aMatrix.length*aHeightOfFigures
}
function linkPosition(position1, position2, classId, aMatrixOfCoordinates, aMatrixOfPosition){
  let locationPos1=_.isEqual(aMatrixOfPosition[position1.line][position1.column][0][0],position1)?0:2
  let locationPos2=_.isEqual(aMatrixOfPosition[position2.line][position2.column][0][0], position2)?0:2
  let classLine=locationPos1==0&&locationPos2==0?"inin":(locationPos1==0&&locationPos2==3?"inout":"outin")
  let idLine="l"+position1.line+"c"+position1.column+"r"+position1.rank+"z"+position1.codeLine+"l"+position2.line+"c"+position2.column+"r"+position2.rank+"z"+position2.codeLine
  let line= <line id={idLine} className={classLine+"classid"+classId} x1={aMatrixOfCoordinates[position1.line][position1.column][locationPos1][0]+aMatrixOfCoordinates[position1.line][position1.column][locationPos1][2]*0.5} 
  y1={aMatrixOfCoordinates[position1.line][position1.column][locationPos1][1]+aMatrixOfCoordinates[position1.line][position1.column][locationPos1][3]*0.5} 
  x2={aMatrixOfCoordinates[position2.line][position2.column][locationPos2][0]+aMatrixOfCoordinates[position2.line][position2.column][locationPos2][2]*0.5}
  y2={aMatrixOfCoordinates[position2.line][position2.column][locationPos2][1]+aMatrixOfCoordinates[position2.line][position2.column][locationPos2][3]*0.5}></line>
  return line
}

function linkPositionAtPositions(aPosition,classId,arrayOfPositions,aMatrixOfCoordinates,aMatrixOfPosition){
  let linksToPositions=arrayOfPositions.filter(e=>!_.isEqual(e, aPosition)).map(e=>linkPosition(aPosition, e,classId, aMatrixOfCoordinates, aMatrixOfPosition))
  return linksToPositions
}
/*
function linkPositionOfTwoArrays(fisrtArray, sndArray, aMatrixOfCoordinates, aMatrixOfPosition){
  let firstElt=fisrtArray.find(e=>!sndArray.some(x=>_.isEqual(x,e))); console.log("firstElt", firstElt)
  let link=firstElt?linkPosition(firstElt, sndArray[0],aMatrixOfCoordinates, aMatrixOfPosition):null
  sndArray=firstElt?[firstElt,...sndArray]:sndArray 
  return [link, sndArray]
}

function linkPositionsOfPathPosition(anObjectPosition,aMatrixOfCoordinates, aMatrixOfPosition){console.log("obj1", anObjectPosition)
  let link=linkPositionOfTwoArrays(anObjectPosition.listOfPathDown, anObjectPosition.linkedPositionsDown,aMatrixOfCoordinates, aMatrixOfPosition)[0]
  anObjectPosition.linkedPositionsDown=linkPositionOfTwoArrays(anObjectPosition.listOfPathDown, anObjectPosition.linkedPositionsDown,aMatrixOfCoordinates, aMatrixOfPosition)[1];console.log("obj2", anObjectPosition)
  return [link, anObjectPosition]
}*/

function retrieveAnObjectPosition(anObjectPosition,aMatrixOfCoordinates, aMatrixOfPosition, aMatrix){
 let linkOfPosition=anObjectPosition.aCurrentPositionDown.map(e=>linkPositionAtPositions(e,anObjectPosition.anElementId+"numPos"+anObjectPosition.idPosition, myLib.nextPositions(e, aMatrix),aMatrixOfCoordinates, aMatrixOfPosition)).flat();console.log("beforarobjectposition", JSON.parse(JSON.stringify(linkOfPosition[0].props.className)))
 linkOfPosition=myLib.removeDuplicatesEltsFromArray(linkOfPosition)
 anObjectPosition.linkedPositionsDown=myLib.removeDuplicatesFromArray([...anObjectPosition.linkedPositionsDown,...anObjectPosition.aCurrentPositionDown]) 
 anObjectPosition.aCurrentPositionDown=myLib.removeDuplicatesFromArray(anObjectPosition.aCurrentPositionDown.map(e=>myLib.nextPositions(e, aMatrix)).flat());console.log("arobjectposition", JSON.parse(JSON.stringify(linkOfPosition)))
 return [linkOfPosition, anObjectPosition]
}

function removeIfAbsentId(anArrayOfObjectPositions,anArrayOfLinks){
 return anArrayOfLinks.reduce((acc,e)=>anArrayOfObjectPositions.find(x=>x.idPosition==e.props.className.slice(-1))?[e,...acc]:acc, [])
}

class ViewOnSvg extends React.Component {
    constructor(props) {
        super(props);
        this.registers=props.registers
        this.matrix=props.matrix
        this.renameInstrunctionMatrix=props.renameInstrunctionMatrix
        this.matrixPosition=props.matrixPosition
        this.processEvent=this.processEvent.bind(this)
        this.position=props.position
        this.arrayOfSelectePositionsInit=[]
        this.heightOfFigures=75
        this.widthOfFigures=150
        this.matrixCoordinate=myLib.matrixToCoordinate(this.renameInstrunctionMatrix, 0, this.widthOfFigures, this.heightOfFigures)

        this.state = {
            position:this.position,
            arrayOfCurrentPositions:this.arrayOfSelectePositionsInit,
            widthOfSvg:widthOfSvg(this.matrix, this.widthOfFigures),
            heightOfSvg:heightOfSvg(this.matrix, this.heightOfFigures),
            links:[]
    };
    }
    
    componentDidMount() {// console.log(this.matrixCoordinate[1][1])
      this.timerID = setInterval(
        () => this.processPathLink(),
        1500
      );
    }
    
    
    componentWillUnmount() {
      clearInterval(this.timerID);
      }
    
    positionsAndCoordinateToFigures(aMatrixPosition, aMatrixCoordinate){// build a matrix of figures (svg elements) with a given matrix of positions and a matrix of coordinates (with appropriate classNames)
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
      
    positionsAndCoordinateToFiguresColor(aMatrixPosition, aMatrixCoordinate, anArrayOfCurrentPositions){// build a matrix of figures (svg elements) with a given matrix of positions and a matrix of coordinates (with appropriate classNames)
        let matrixFigures=aMatrixPosition.map((e,i)=>i==0?e.map((x,j)=>j==0?(<g transform={'translate('+aMatrixCoordinate[i][j][0]+','+aMatrixCoordinate[i][j][1]+')'}><rect className="name" x="0" y="0" width={""+aMatrixCoordinate[i][j][2]} height={""+aMatrixCoordinate[i][j][3]}></rect>
                                                                                                                                                       <text className="textname" alignmentBaseline="middle" textAnchor="middle" x={""+aMatrixCoordinate[i][j][2]/2} y={""+aMatrixCoordinate[i][j][3]/2}>{x}</text></g>):
                                                                            (<g transform={'translate('+aMatrixCoordinate[i][j][0]+','+aMatrixCoordinate[i][j][1]+')'}><rect className="head" x="0" y="0" width={""+aMatrixCoordinate[i][j][2]} height={""+aMatrixCoordinate[i][j][3]}></rect>
                                                                            <text className="texthead" alignmentBaseline="middle" textAnchor="middle" x={""+aMatrixCoordinate[i][j][2]/2} y={""+aMatrixCoordinate[i][j][3]/2}>{x}</text></g>) ):
                                                         e.map((x,j)=>j==0?(<g transform={'translate('+aMatrixCoordinate[i][j][0]+','+aMatrixCoordinate[i][j][1]+')'}><rect className="intrinsicName" x="0" y="0" width={""+aMatrixCoordinate[i][j][2]} height={""+aMatrixCoordinate[i][j][3]}></rect>
                                                                            <text className="textintrinsicName" alignmentBaseline="middle" textAnchor="middle" x={""+aMatrixCoordinate[i][j][2]/2} y={""+aMatrixCoordinate[i][j][3]/2}>{x.name.toUpperCase()}</text></g>):
                                                                            x.map((t,l)=>t.length==0?(<g transform={'translate('+aMatrixCoordinate[i][j][l][0]+','+aMatrixCoordinate[i][j][l][1]+')'}><rect className="empty" x="0" y="0" width={""+aMatrixCoordinate[i][j][l][2]} height={""+aMatrixCoordinate[i][j][l][3]}></rect></g>):
                                                                                (l==0?(<g transform={'translate('+aMatrixCoordinate[i][j][l][0]+','+aMatrixCoordinate[i][j][l][1]+')'}><rect onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent} id={"l"+t[0].line+"c"+t[0].column+"r"+t[0].rank+"z"+t[0].codeLine} className={"in"+t[0].line+t[0].rank+myLib.computeSuffix(t[0], anArrayOfCurrentPositions)} x="0" y="0" width={""+aMatrixCoordinate[i][j][l][2]} height={""+aMatrixCoordinate[i][j][l][3]}></rect></g>):
                                                                                (<g transform={'translate('+aMatrixCoordinate[i][j][l][0]+','+aMatrixCoordinate[i][j][l][1]+')'}><rect onClick= {this.processEvent} onMouseEnter={this.processEvent} onMouseLeave={this.processEvent} id={"l"+t[0].line+"c"+t[0].column+"r"+t[0].rank+"z"+t[0].codeLine} className={"out"+t[0].line+t[0].rank+myLib.computeSuffix(t[0], anArrayOfCurrentPositions)} x="0" y="0" width={""+aMatrixCoordinate[i][j][l][2]} height={""+aMatrixCoordinate[i][j][l][3]}></rect></g>)))))
        return matrixFigures
      }
      processPath(){
        this.setState(function(state){
          let arrayOfCurrentPositions=state.arrayOfCurrentPositions
          arrayOfCurrentPositions=myLib.advanceSelectPositions(arrayOfCurrentPositions, this.renameInstrunctionMatrix)//;console.log("arrayOfCurrentPositionsnn", JSON.parse(JSON.stringify(arrayOfCurrentPositions)))
          return {arrayOfCurrentPositions:arrayOfCurrentPositions}
        });
      }


      processEventLink(anEvent){
        let id=anEvent.target.getAttribute("id")
        this.setState(function(state){
        let arrayOfCurrentPositions=state.arrayOfCurrentPositions
        let links=state.links
        arrayOfCurrentPositions=myLib.updateArrayOfCurrentPositions(arrayOfCurrentPositions, id, this.matrix)
        return {arrayOfCurrentPositions:arrayOfCurrentPositions}
      })
      this.processPath()
      }

      processPathLink(){
        this.setState(function(state){
          let arrayOfCurrentPositions=state.arrayOfCurrentPositions
          let links=state.links
          links=[...arrayOfCurrentPositions.map(e=>retrieveAnObjectPosition(e,this.matrixCoordinate, this.matrixPosition, this.matrix)[0]).flat(),...links]
          links=myLib.removeDuplicatesEltsFromArray(links)
          arrayOfCurrentPositions=arrayOfCurrentPositions.map(e=>retrieveAnObjectPosition(e,this.matrixCoordinate, this.matrixPosition, this.matrix)[1]); console.log("aray2",JSON.parse(JSON.stringify(arrayOfCurrentPositions)),"link", links )
          return {arrayOfCurrentPositions:arrayOfCurrentPositions, links:links}
        });
      }

      processEvent(anEvent){
        let id=anEvent.target.getAttribute("id")
        let position=myLib.extractPositionFromId(id)
        this.setState(function(state){
        let arrayOfCurrentPositions=state.arrayOfCurrentPositions
        let links=state.links 
        let idPosition=myLib.minFreePosition(arrayOfCurrentPositions)
        arrayOfCurrentPositions=myLib.updateArrayOfCurrentPositions(arrayOfCurrentPositions, id, this.matrix)   
        links=links.concat(linkPositionAtPositions(position,id+"numPos"+idPosition, myLib.nextPositions(position, this.matrix),this.matrixCoordinate, this.matrixPosition))
        links=myLib.removeDuplicatesEltsFromArray(links)
        links=removeIfAbsentId(arrayOfCurrentPositions, links)
        return {arrayOfCurrentPositions:arrayOfCurrentPositions, links:links}
      })
    }
     

    render(){//console.log("links",this.state.links)
      var figures=this.positionsAndCoordinateToFiguresColor(this.matrixPosition, this.matrixCoordinate, this.state.arrayOfCurrentPositions)
      var line=<line className="test" x1="0" y1="0" x2="300" y2="300"  ></line>

        return( 
        
            
                <svg width={this.state.widthOfSvg} height={this.state.heightOfSvg} id="svgTable" className="svgVisualization">{figures}{this.state.links}</svg>

   )
    }
    componentDidUpdate(prevProps) {

    }
}



export default ViewOnSvg;