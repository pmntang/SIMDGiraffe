import React, {Component} from "react";
import * as _ from "lodash";
import * as myLib from "./myLibrary.js";
import "../css/VectorRegister.css";
import "../css/ViewOnSvg.css";
import 'array-flat-polyfill';
import 'underscore';


class ViewScalar extends React.Component {
    constructor(props) {
      super(props);
  

        this.state = {

    };
    }
    
    componentDidMount() {// console.log(this.matrixCoordinate[1][1])

    }
    
    
    componentWillUnmount() {

      }
    
   
   


    render(){         

    //const k=this.dhighlightCode().clear();
     
            
        return( 
        
          
          <svg width="100%" height="100%" version="1.1"
     xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
 <g transform="translate(150,150)">
  <rect x="0" y="0"
        width="100" height="50"
        style={{fill:"blue", stroke:"green" , strokeWidth:"4"}}
        >
  </rect>
  <text x="50" y="25" dominantBaseline="middle" textAnchor="middle"
   style={{ strokeWidth:"2", fontSize:"3rem"}}>F</text>


</g>


</svg>
       
   )
    }

}



export default ViewScalar;