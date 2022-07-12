import React, { Component } from 'react'
import * as myLib from '../utilities/myLibrary.js'
import '../styles/CodeText.css'
import simdFunction from '../utilities/simdFunction.json'
import parse from 'html-react-parser'

const myDataListTab = myLib.constructDataListTable(simdFunction)
const options = myDataListTab.map((e, i) => <option key={`${e[0]}+${i}`} value={e[0]}>{e[0]}</option>)

const operandsAndResults = myLib.computeOperandsAndresultElt(simdFunction)
const _mName = simdFunction.intrinsic.find((e, i) => {
  let ex = ''
  if (e._rettype) {
    ex = e._rettype == '_m512' ? e._rettype : ex
  }
  if (e.parameter && Array.isArray(e.parameter)) {
    e.parameter.forEach(element => {
      if (element._type) {
        ex = element._type == '_m512' ? element._type : ex
      }
    })
  }
  if (ex) return e
  return ex
})
class CodeText extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor (props) {
    super(props)
  }

  componentDidMount () {

  }

  componentDidUpdate () {

  }

  componentWillUnmount () {

  }

  render () {
    // eslint-disable-next-line react/prop-types
    const handleOnchange = this.props.handleOnchange; const value = this.props.value
    const description = myDataListTab.find(e => e[0] == value)[3]// console.log("description",description);
    return (

           <div className='instruction-choice-and-explanation'>

                <label htmlFor="instruction-name-search"><span className="button">Choose SIMD Instruction</span></label><br />
                <input type="search" id="instruction-name-search" name="instruction-name-search" autoComplete="on"
                    aria-label="Search the name of simd instruction" list="myDataListTab" defaultValue={value}
                    onChange={(e) => handleOnchange(e)}></input>
                <datalist id="myDataListTab">
                    {options}
                </datalist>
               {this.props.isVisible && <div className="plain-text-explanation">
                   {description}
                </div>}

            </div>
    )
  }
}

export default CodeText
