import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/Explanation.css';
import simdFunction from '../utilities/simdFunction.json';




class Explanation extends Component {
    constructor(props) {
        super(props);
        this.currentResult = null;
        this.butonMsg = null;



    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.value !== prevProps.value) {
            this.currentResult = this.props.currentResult
            this.butonMsg = myLib.readLinkingIndexMsg(this.props.linkingIndex);
        }

    }

    componentWillUnmount() {

    }


    render() {
        this.butonMsg = myLib.readLinkingIndexMsg(this.props.linkingIndex);
        this.currentResult = this.props.currentResult;

        console.log("this.props.value", this.props.value, "this.currentResult", this.currentResult, "this.props.currentResult", this.props.currentResult, "this.butonMsg", this.butonMsg)
        return (


            <div id="explanation" className="explanation">
                <form id="explanationForm" className="explanationForm">
                    <p id="outputParagraph" className="outputParagraph">
                        <label>{this.currentResult && `How to compute the field  `}</label>
                        <output id="simdOutput" className="simdOutput" name="outputSimd" form="explanationForm" >
                            <span id="fieldFormul" className="fieldFormul">{this.currentResult && `${this.currentResult}:  `}</span><span id="textFormul" className="textFmormul">{this.currentResult && `${this.currentResult} =`}{`${this.butonMsg}`}</span>
                        </output>
                    </p>
                    <p id="buttonParagraph" className="buttonParagraph">
                        {this.currentResult && <button id="simdButton" className="simdButton" form="explanationForm" type="button" onClick={evt => this.props.handlesimdButtonClick(evt)}>
                            {`Reset the field ${this.currentResult}:  `}
                        </button>}
                    </p>
                </form>
            </div>




        )
    }
}

export default Explanation