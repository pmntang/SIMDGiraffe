import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/Explanation.css';
import simdFunction from '../utilities/simdFunction.json';




class Explanation extends Component {
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

        return (


            <div id="explanation" className="explanation">
                <form id="explanationForm" className="explanationForm">
                    <p id="outputParagraph" className="outputParagraph">
                        <label>{this.props.currentResult && `How to compute the field  `}</label>
                        <output id="simdOutput" className="simdOutput" name="outputSimd" form="explanationForm" >
                            <span id="fieldFormul" className="fieldFormul">{this.props.currentResult&&`${this.props.currentResult}:  `}</span><span id="textFormul" className="textFmormul">{this.props.currentResult && `${this.props.currentResult} =`}{`${this.props.butonMsg}`}</span>
                        </output>
                    </p>
                    <p id="buttonParagraph" className="buttonParagraph">
                        <button id="simdButton" className="simdButton" form="explanationForm" type="button" onClick={evt => this.props.handlesimdButtonClick(evt)}>
                            {`Reset the field ${this.props.currentResult}:  `}
                        </button>
                    </p>
                </form>
            </div>




        )
    }
}

export default Explanation