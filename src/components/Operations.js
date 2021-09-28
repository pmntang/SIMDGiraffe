import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/Operations.css';
import simdFunction from '../utilities/simdFunction.json';
import Operands from './Operands';
import Operator from './Operator';



class Operations extends Component {
    constructor(props) {
        super(props);


    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }


    render() {
        const rectOprHeight = 35, xPrefixWidth=65;
        return (

        
                <svg id="operations" className="operations" width="100%" height="100%" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <Operator xPrefixWidth={xPrefixWidth} rectOprHeight={rectOprHeight} linkingIndex={this.props.linkingIndex} handleOperatorClick={this.props.handleOperatorClick}/>
                    <Operands xPrefixWidth={xPrefixWidth} translation={rectOprHeight + rectOprHeight / 2} currentInstruction={this.props.currentInstruction}
                        linkingIndex={this.props.linkingIndex} handleOperandClick={this.props.handleOperandClick} />
                </svg>
    
        )
    }
}

export default Operations