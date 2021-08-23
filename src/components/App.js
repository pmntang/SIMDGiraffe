import React, { Component } from 'react';
import * as myLib from '../utilities/myLibrary.js';
import simdFunction from '../utilities/simdFunction.json';
import styled from 'styled-components'
import logo from '../assets/logo.png';
import '../styles/App.css';
import CodeText from './CodeText';
import Visualization from './Visualization';

const Container = styled.div`
  display: flex;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh
  width: 50vw;
  overflow: auto;
`

const RightContainer = styled.div`
  width: 50vw;
  height: 100vh;
  overflow: hidden;
`
const myDataListTab = myLib.constructDataListTable(simdFunction);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "_mm_add_epi8" };
    this.handleOnchange = this.handleOnchange.bind(this)
  }

  componentDidMount() {
    

  }

  componentDidUpdate() {

  }

  componentWillUnmount() {

  }
  handleOnchange(e) {
    if (myDataListTab.find(o => o[0] == e.target.value)) {
      this.setState(prevState => ({
        value: e.target.value
      }));
    }

  }



  render() {
    return (
      <div id="displayZone" className="displayZone"><CodeText handleOnchange={this.handleOnchange} value={this.state.value} />
        <Visualization value={this.state.value} />
      </div>
    );
  }

}

export default App;
