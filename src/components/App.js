import React, {Component} from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/selection/mark-selection.js'
import '../css/App.css';
import styled from 'styled-components'
import ButtonPanel from "./ButtonPanel";
import {generateASM, generateAST} from "../Utils/Parser";
import WaitingScreen from "./WaitingScreen";
import AstVisualizer from "./ASTVisualizer";
import FrontPage from "./FrontPage";
import {compile} from "../Utils/Compiler";
import ErrorHandler from "./ErrorHandler";
import {Pane, Tabs} from "../Utils/Tabs";
import ViewRegister from "./ViewRegister";
import ViewIntrinsics from "./ViewIntrinsics";
import {createBrowserHistory} from 'history';
import * as qs from 'qs';
import ParametersPage from "./ParametersPage";
import * as _ from "lodash";
import simdFunction from './simdFunction.json';
import * as myLib from "../ASMComponents/myLibrary.js";
//const WaitingScreen = React.lazy(() => import('./WaitingScreen'));

const codeSample=[{name:"PrefixSum", code:`__m128i PrefixSum(__m128i curr) {
    __m128i Add = _mm_slli_si128(curr, 4); 
    curr = _mm_add_epi32(curr, Add);   
    Add = _mm_slli_si128(curr, 8);      
    return _mm_add_epi32(curr, Add);       
  }`},{name:"interleave_uint8_with_zeros_avx_lut",code:`__m256i interleave_uint8_with_zeros_avx_lut(__m256i word) {
    const __m256i m = _mm256_set_epi8(85, 84, 81, 80, 69, 68,
                 65, 64, 21, 20, 17, 16, 5, 4, 1, 0, 85, 84, 
                 81, 80, 69, 68, 65, 64, 21, 20, 17, 16, 5, 
                 4, 1, 0);
    __m256i lownibbles =
        _mm256_shuffle_epi8(m, _mm256_and_si256(word,
              _mm256_set1_epi8(0xf)));
    __m256i highnibbles = _mm256_and_si256(word, 
            _mm256_set1_epi8(0xf0));
     highnibbles = _mm256_srli_epi16(highnibbles,4);
     highnibbles = _mm256_shuffle_epi8(m, highnibbles);
     highnibbles =  _mm256_slli_epi16(highnibbles, 8);
    return _mm256_or_si256(lownibbles,highnibbles);
  }`},{name:"avx512_pcg_state_setseq_64",code:`typedef struct avx512_pcg_state_setseq_64 { // Internals are *Private*.
    __m512i state;      // (8x64bits) RNG state.  All values are possible.
    __m512i inc;        // (8x64bits)Controls which RNG sequences (stream) is
                        // selected. Must *always* be odd. You probably want
                        // distinct sequences
    __m512i multiplier; // set to _mm512_set1_epi64(0x5851f42d4c957f2d);
  } avx512_pcg32_random_t;
  
  __m256i avx512_pcg32_random_r(avx512_pcg32_random_t *rng) {
    __m512i oldstate = rng->state;
    rng->state = _mm512_add_epi64(_mm512_mullo_epi64(rng->multiplier, rng->state),
                                  rng->inc);
    __m512i xorshifted = _mm512_srli_epi64(
        _mm512_xor_epi64(_mm512_srli_epi64(oldstate, 18), oldstate), 27);
    __m512i rot = _mm512_srli_epi64(oldstate, 59);
    return _mm512_cvtepi64_epi32(_mm512_rorv_epi32(xorshifted, rot));
  }`},{name:"Delta",code:`__m128i Delta(__m128i curr, __m128i prev) {
    return _mm_sub_epi32(curr, _mm_alignr_epi8(curr, prev, 12));
  }`},{name:"sse_xorshift128plus",code:`#include <stdint.h>
  /*
   Return a 128-bit random "number"
   */
   __m128i sse_xorshift128plus( __m128i *part1,  __m128i *part2) {
      __m128i s1 = *part1;
      const __m128i s0 = *part2;
      *part1 = *part2;
      s1 = _mm_xor_si128(*part2, _mm_slli_epi64(*part2, 23));
      *part2 = _mm_xor_si128(
              _mm_xor_si128(_mm_xor_si128(s1, s0),
                      _mm_srli_epi64(s1, 18)), _mm_srli_epi64(s0, 5));
      return _mm_add_epi64(*part2, s0);
  }`}]
const funcSample=[{head:
{name:"_mm_add_epi8",
 operandBitCount: [128, 128],
 operandType: ["__m128i", "__m128i"],
 resultBitCount: 128,
 resultType: "__m128i",
 fieldOperandCount:[16, 16],
 fieldResultCount: 16
},
operand:[ [3, 8, 9, 10, 6, 7, 8, 1, 8, 10, 17, 9, 5, 7, 23, 77 ],
          
          [11,2, 4, 76, 56,3, 26,12,11,32, 3,  7,45, 9, 24, 87 ]
        ],
LinkingIndex:[[[[15,1,null]],[[15,2,"+"]]],[[[14,1,null]],[[14,2,"+"]]],[[[13,1,null]],[[13,2,"+"]]],[[[12,1,null]],[[12,2,"+"]]],[[[11,1,null]],[[11,2,"+"]]],[[[10,1,null]],[[10,2,"+"]]],[[[9,1,null]],[[9,2,"+"]]],[[[8,1,null]],[[8,2,"+"]]],[[[7,1,null]],[[7,2,"+"]]],[[[0,1,null]],[[0,2,"+"]]],[[[0,1,null]],[[0,2,"+"]]],[[[0,1,null]],[[0,2,"+"]]],[[[0,1,null]],[[0,2,"+"]]],[[[0,1,null]],[[0,2,"+"]]],[[[6,1,null]],[[6,2,"+"]]],[[[5,1,null]],[[5,2,"+"]]],[[[4,1,null]],[[4,2,"+"]]],[[[3,1,null]],[[3,2,"+"]]],[[[2,1,null]],[[2,2,"+"]]],[[[1,1,null]],[[1,2,"+"]]],[[[0,1,null]],[[0,2,"+"]]]],
result: []
}]

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


class App extends Component {
    constructor(props) {
        super(props);
        let savedState =false//localStorage.getItem('app-state');
        this.history = createBrowserHistory();
        this.rawAsm=[];
        //this.chooseCode = this.chooseCode.bind(this);
        this.state = {//initial state of the application, the next state depends on it
            code: `#include <x86intrin.h>\n\n__m128i PrefixSum(__m128i curr) {\n  __m128i Add = _mm_slli_si128(curr, 4); \n  curr = _mm_add_epi32(curr, Add);   \n  Add = _mm_slli_si128(curr, 8);    \n  return _mm_add_epi32(curr, Add);       \n}`,
            codeWasModifiedSinceLastCompile: true,
            intrinsicDescrition:"",
            disableButtons: false,
            status: 'compiles',
            compiling: false,
            ast: {},
            clangAst: {},
            asm: [],
            rawAsm:[],
            error: [],
            visualize: false,
            parametersChosen: false
        };
        if (this.props.match.params.code) {
            this.state.code = qs.parse(this.props.match.params.code).code; 
        }
        else if (savedState) {
            // React wants us to mutate the state or it will lose the right reference...
            _.assign(this.state, JSON.parse(savedState));
            this.state.visualize = false;
            this.state.parametersChosen = false;
        }
        this.cm = React.createRef();
        
    }
    
    componentDidMount(){

    }

    componentDidUpdate() {
        localStorage.setItem("app-state", JSON.stringify(this.state));
        if(this.shouldcallviz) {
            this.shouldcallviz = false;
            this.visualize();
        }
        else if(this.shouldcallvizSIMD){
                this.shouldcallvizSIMD=false;
                this.visualizeSIMD(this.state.intrinsicDescrition.name);
        }
    }

    handleClear = (clearCode = true) => {
        this.setState(({code}) => ({
            code: clearCode === true ? '' : code
        }));
    };
  
    visualize = () => {
        this.setState({compiling: true});
        if (this.state.codeWasModifiedSinceLastCompile) {
            this.setState((state) => {
                Object.keys(state.ast).forEach(k => delete state.ast[k]);
                Object.assign(state.ast, generateAST(this.cm.current.editor));
            });
            compile(this.state.code, (error, asm, ast) => {//this.cm.current.editor.getValue()
                if (error.length === 0) {
                    asm = generateASM(asm);
                    this.setState((state) => {
                        state.rawAsm.concat(asm);
                        state.asm.splice(0, state.asm.length);
                        asm.forEach(e => {
                            state.asm.push(e)
                        });

                        return {
                            compiling: false,
                            status: 'compiles',
                            error,
                            clangAst: ast,
                            codeWasModifiedSinceLastCompile: false,
                            visualize: true,
                            parametersChosen: true
                        }
                    });
                }
                else {
                    this.setState((state) => {
                        state.asm.splice(0, state.asm.length);
                        return {compiling: false, status: 'error', error, clangAst: {}}
                    });
                }
            })
        }
        else {
            this.setState({compiling: false, visualize: true})
        }
    };

    visualizeSIMD = (instructionName) => {

        
        this.shouldcallvizSIMD=true;

    }

    restart = () => {
        this.setState((state) => {
            Object.keys(state.ast).forEach(k => delete state.ast[k]);
            state.asm.splice(0, state.asm.length);
            return {
                compiling: false,
                codeWasModifiedSinceLastCompile: true,
                clangAst: {},
                error: [],
                visualize: false,
                parametersChosen: false
            }
        });
    };
    addCode = () => {
        this.setState((state) => {
            Object.keys(state.ast).forEach(k => delete state.ast[k]);
            state.asm.splice(0, state.asm.length);
            return {
                compiling: false,
                codeWasModifiedSinceLastCompile: true,
                clangAst: {},
                error: [],
                visualize: false,
                parametersChosen: false
            }
        });
    };
    
    chooseCode = (codeName) => {
        var newCode,functionDescription, intrinsicDescrition;
        if(funcSample.some(e=>e.head.name.toLocaleLowerCase()==codeName.toLocaleLowerCase())){
            console.log("e,", simdFunction.intrinsic[0] );
            console.log("test", simdFunction.intrinsic.find(anIntrinsic=>!anIntrinsic.hasOwnProperty("operation")));
            functionDescription=simdFunction.intrinsic.find(anIntrinsic=>anIntrinsic._name.toLocaleLowerCase()==codeName.toLocaleLowerCase());
            intrinsicDescrition=myLib.constructDescription(functionDescription._name, simdFunction);
            newCode = intrinsicDescrition[1];  //functionDescription.operation;
            this.setState((state)=>({code:newCode, intrinsicDescrition:intrinsicDescrition[0]}));
        }
        else{
            let code=codeSample.find(body=>body.name.toLocaleLowerCase()==codeName.toLocaleLowerCase())
            if(!code) return;
            newCode = "#include <x86intrin.h>\n\n"+code.code;
            this.setState({code:newCode});
            this.restart()
            this.shouldcallviz = true;
            this.shouldcallvizSIMD=false;
        }
    }
   

    onParametersChosen() {
        this.setState({parametersChosen: true});
    }

    getShareLink = () => {
        //We need to specify the whole URL since we are in dev and bitly cannot work with localhost links.
        return 'https://pmntang.github.io/SIMDGiraffe/#/link/' + qs.stringify({code: this.state.code})
        //return window.location.origin + "#/link" + qs.stringify(this.state)
    };

    getCodeMirror() {
        const {code} = this.state;

        return (
            <CodeMirror
                ref={this.cm}
                value={code}
                options={{
                    mode: 'text/x-csrc',
                    theme: 'material',
                    lineNumbers: true,
                    lineWrapping: true,
                    gutters: ["CodeMirror-lint-markers"],
                }}
                onBeforeChange={(editor, data, code) => {
                    this.restart();
                    this.history.push(this.history.location.pathname);
                    if (code === '') {
                        this.handleClear(true);
                        this.setState({codeWasModifiedSinceLastCompile: true});
                    } else {
                        this.setState({code, codeWasModifiedSinceLastCompile: true});
                    }
                }}
                onPaste={() => {
                    this.restart();
                    this.setState({codeWasModifiedSinceLastCompile: true});
                    this.handleClear(false)
                }}
            />
        )
    }

    render() {

        const {disableButtons, status, compiling, error, visualize, parametersChosen} = this.state;

        let rightPage = <FrontPage/>;

        if (compiling) {
            rightPage = <WaitingScreen/>;
        }
        else if (error.length > 0) {
            rightPage = <ErrorHandler cm={this.cm} error={error}/>
        }
        else if (visualize && parametersChosen) {
            rightPage = <Tabs selected={0}>
                 <Pane label="Visualize SIMD Codes">
                    <ViewRegister cm={this.cm} asm={this.state.asm}
                                   onGoToParameters={() => this.setState({parametersChosen: false})}/>
                </Pane>  
                <Pane label="Visualize Intrinsics">
                    <ViewIntrinsics cm={this.cm} asm={this.state.asm} simdFunction={simdFunction}
                                    onGoToParameters={() => this.setState({parametersChosen: false})}/>
                </Pane>
            {/*    <Pane label="AST">
                    <AstVisualizer cm={this.cm} ast={this.state.ast}/>
        </Pane>*/}
            </Tabs>
        }
        else if (visualize) {
            rightPage = <ParametersPage asm={this.state.asm} onComplete={this.onParametersChosen.bind(this)}/>
        }

        return (
            <Container>
                <LeftContainer>
                 <ButtonPanel 
                        visualize={this.visualize}
                        restart={this.restart}
                        addCode={this.addCode}
                        chooseCode={this.chooseCode}
                        getShareLink={this.getShareLink}
                        disabled={disableButtons}
                        status={status}
                        codeSample={[...codeSample,...funcSample]}
                    />
                    {
                        this.getCodeMirror()
                    }
                </LeftContainer>
                
                <RightContainer>
                    {rightPage}
                </RightContainer>
            </Container>
        );
    }
}

export default App;

