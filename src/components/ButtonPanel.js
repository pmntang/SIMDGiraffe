import React, {Component} from 'react';
import styled from 'styled-components';
import CodeStatus from "./CodeStatus";
import {Popover, PopoverBody} from 'reactstrap';
import {BitlyClient} from 'bitly';
import {InputGroup, InputGroupAddon, Button, Input} from 'reactstrap';
import {CopyToClipboard} from 'react-copy-to-clipboard';



const ButtonPanelContainer = styled.div`
  background: #1F292E;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Top = styled.div`
  padding: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
`

const Buttons = styled.div`
    width: 100%;
    display: flex;
  > button {
    border: none;
    background: none;
    color: #fff;
    font-size: 18px;
    padding: 8px;
    text-shadow: -1px -1px 1px rgba(255,255,255,.1), 1px 1px 1px rgba(0,0,0,.5);

    @media (max-width: 700px) {
      font-size: 10px;
    }
  }

  > button:hover {
    color: #fff;
    cursor: pointer;
  }

  > button:disabled {
    color: #919191;
  }

  > button:active {
    color: #fff;
    text-shadow: none;
  }
  
  > #sharePopover {
    margin-left:auto;
    opacity: 0.6;
  }
  
  > #sharePopover:hover {
    opacity: 1;
  }
`

export default class ButtonPanel extends Component {

    constructor(props) {
        super(props);
        this.bitly = new BitlyClient('e17981e1eef5e2ec83995b478b899564448b9496', {});

        this.toggleShare = this.toggleShare.bind(this);
        
        this.state = {
            popoverOpen: false,
            shareLink: 'Loading...'
        };

        this.textAreaRef = React.createRef();
    }
 
    toggleShare() {
        let longUrl = this.props.getShareLink();
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
        this.bitly
            .shorten(longUrl)
            .then((result) => {
                this.setState({
                    shareLink: result.url
                });
            })
            .catch((error) => {
                this.setState({
                    shareLink: longUrl
                });
                console.error(error);
            });

            
    }
      // <button onClick={restart}>Restart</button>
    render() {
        let {visualize, restart, addCode, chooseCode, disabled = false, status} = this.props;
        var style={color:"white"}
        return (
            <ButtonPanelContainer>
                <Top>
                    <Buttons>
                        <button disabled={disabled} onClick={visualize}><span className="button">Visualize</span></button>
                        <button onClick={restart}><span className="button">Stop</span></button>
                        <button onClick={addCode}><span className="button">Add Code</span></button>
                        <p style={style}><br/><br/>
                        <label htmlFor="chooseCode"><span className="button">Choose Code</span></label><br/>
                        <select name="chooseCode" id="chooseCode" onChange={(e)=>chooseCode(e.target.value)} >
                          {this.props.codeSample.map(e=><option value={e.name}>{e.name}</option>)}
                        </select>
                        </p>
                        <button id='sharePopover' onClick={this.toggleShare}><i className="fas fa-share-square"></i>
                        </button>
                    </Buttons>


                    <Popover placement="left" isOpen={this.state.popoverOpen} target="sharePopover"
                             toggle={this.toggleShare}>
                        <PopoverBody>
                            <InputGroup>
                                <Input readOnly ref={this.textAreaRef} value={this.state.shareLink}/>
                                <InputGroupAddon addonType="prepend">

                                    <CopyToClipboard text={this.state.shareLink}
                                                     onCopy={() => this.setState({popoverOpen: false})}>
                                        <Button color="info"> <i className="far fa-copy"></i> </Button>
                                    </CopyToClipboard>


                                </InputGroupAddon>
                            </InputGroup>
                        </PopoverBody>
                    </Popover>
                </Top>
                <CodeStatus status={status}/>
            </ButtonPanelContainer>
        );
    }
}