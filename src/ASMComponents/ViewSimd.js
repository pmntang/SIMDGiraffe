import React, {Component} from "react";
import * as _ from "lodash";
import * as myLib from "./myLibrary.js";
import "../css/VectorRegister.css";
import "../css/ViewOnSvg.css";
import 'array-flat-polyfill';
import 'underscore';


class ViewSimd extends React.Component {
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
        <React.Fragment>

        </React.Fragment>
   )
    }
    componentDidUpdate() {
     // console.log("iss",document.querySelector('rect[class$="id1"]'))
    }
}



export default ViewSimd;