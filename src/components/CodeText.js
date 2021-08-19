import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import '../styles/CodeText.css';
import simdFunction from '../utilities/simdFunction.json';

const myDataListTab = myLib.constructDataListTable(simdFunction);
const options=myDataListTab.map((e, i) => <option key={`${e[0]}-${i}`} value={e[0]}></option>)

const returnTypeAndParam = simdFunction.intrinsic.reduce((acc, cur) => {
    if (cur._rettype) {
        acc = acc.indexOf(cur._rettype) == -1 ? [...acc, cur._rettype] : [...acc];
    }
    if (cur.parameter && Array.isArray(cur.parameter)) {
        cur.parameter.forEach(element => {
            if (element._type) {
                acc = acc.indexOf(element._type) == -1 ? [...acc, element._type] : [...acc];
            }
            return acc
        });

    }
    return acc
}, []);
const operandsAndResults = myLib.computeOperandsAndresultElt(simdFunction);
const _mName = simdFunction.intrinsic.find((e, i) => {
    var ex = ""
    if (e._rettype) {
        ex = e._rettype == "_m512" ? e._rettype : ex;
    }
    if (e.parameter && Array.isArray(e.parameter)) {
        e.parameter.forEach(element => {
            if (element._type) {
                ex = element._type == "_m512" ? element._type : ex;
            }
        });

    }
    if (ex) return e;
    return ex;
});
class CodeText extends Component {
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
     
        var  handleOnchange = this.props.handleOnchange, value = this.props.value;
        const description = myDataListTab.find(e => e[0] == value)[3];
        return (

            <div className='instruction-choice-and-explanation'>

                <label htmlFor="instruction-name-search"><span className="button">Choose SIMD Instruction</span></label><br />
                <input type="search" id="instruction-name-search" name="instruction-name-search" autoComplete="on"
                    aria-label="Search the name of simd instruction" list="myDataListTab" defaultValue={value}
                    onChange={(e) => handleOnchange(e)}></input>
                <datalist id="myDataListTab">
                    {options}
                </datalist>
                <div className="plain-text-explanation">
                    {description}
                </div>

            </div>
        )
    }
}

export default CodeText