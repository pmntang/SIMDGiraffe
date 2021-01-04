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
        strokeDasharray="4 4 4 4"
        style={{fill:"red", stroke:"green" , strokeWidth:"4"}}
        >
        <animateTransform attributeName="transform"
                          attributeType="XML"
                          type="rotate" fill="freeze"
                          from="0" to="360" dur="14s"/>
  </rect>

  <ellipse cx="0" cy="0"
           rx="4" ry="4"
           style={{fill:"blue", stroke:"none" , strokeWidth:"4"}}/>

</g>

<g transform="translate(400,150)">
  <rect x="-50" y="-25"
        width="100" height="50"
        strokeDasharray="8 8 8 8"
        style={{fill:"yellow", stroke:"green" , strokeWidth:"4"}}   >
        <animateTransform attributeName="transform"
                          attributeType="XML"
                          type="rotate" fill="freeze"
                          from="0" to="360" dur="14s"/>
  </rect>
  <ellipse cx="0" cy="0"
           rx="4" ry="4"
           style={{fill:"blue", stroke:"none" , strokeWidth:"4"}}/>
           
  
</g>
</svg>
       
   )
    }

}



export default ViewScalar;