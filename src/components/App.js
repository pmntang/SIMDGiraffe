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
import {createBrowserHistory} from 'history';
import * as qs from 'qs';
import ParametersPage from "./ParametersPage";
import * as _ from "lodash";
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
  }`},{name:"find_structural_bits_64", code:`void find_structural_bits_64(
        const uint8_t *buf, size_t idx, uint32_t *base_ptr, uint32_t &base,
        uint64_t &prev_iter_ends_odd_backslash, uint64_t &prev_iter_inside_quote,
        uint64_t &prev_iter_ends_pseudo_pred, uint64_t &structurals,
        uint64_t &error_mask,
        utf8_checker<ARCHITECTURE> &utf8_state) {
      simd_input<ARCHITECTURE> in(buf);
      utf8_state.check_next_input(in);
      /* detect odd sequences of backslashes */
      uint64_t odd_ends = find_odd_backslash_sequences(
          in, prev_iter_ends_odd_backslash);
    
      /* detect insides of quote pairs ("quote_mask") and also our quote_bits
       * themselves */
      uint64_t quote_bits;
      uint64_t quote_mask = find_quote_mask_and_bits(
          in, odd_ends, prev_iter_inside_quote, quote_bits, error_mask);
    
      /* take the previous iterations structural bits, not our current
       * iteration,
       * and flatten */
      flatten_bits(base_ptr, base, idx, structurals);
    
      uint64_t whitespace;
      find_whitespace_and_structurals(in, whitespace, structurals);
    
      /* fixup structurals to reflect quotes and add pseudo-structural
       * characters */
      structurals = finalize_structurals(structurals, whitespace, quote_mask,
                                         quote_bits, prev_iter_ends_pseudo_pred);
    }`},{name:"find_structural_bits",code:`int find_structural_bits(const uint8_t *buf, size_t len, simdjson::ParsedJson &pj) {
        if (len > pj.byte_capacity) {
          std::cerr << "Your ParsedJson object only supports documents up to "
                    << pj.byte_capacity << " bytes but you are trying to process "
                    << len << " bytes" << std::endl;
          return simdjson::CAPACITY;
        }
        uint32_t *base_ptr = pj.structural_indexes;
        uint32_t base = 0;
        utf8_checker<ARCHITECTURE> utf8_state;
      
        /* we have padded the input out to 64 byte multiple with the remainder
         * being zeros persistent state across loop does the last iteration end
         * with an odd-length sequence of backslashes? */
      
        /* either 0 or 1, but a 64-bit value */
        uint64_t prev_iter_ends_odd_backslash = 0ULL;
        /* does the previous iteration end inside a double-quote pair? */
        uint64_t prev_iter_inside_quote =
            0ULL; /* either all zeros or all ones
                   * does the previous iteration end on something that is a
                   * predecessor of a pseudo-structural character - i.e.
                   * whitespace or a structural character effectively the very
                   * first char is considered to follow "whitespace" for the
                   * purposes of pseudo-structural character detection so we
                   * initialize to 1 */
        uint64_t prev_iter_ends_pseudo_pred = 1ULL;
      
        /* structurals are persistent state across loop as we flatten them on the
         * subsequent iteration into our array pointed to be base_ptr.
         * This is harmless on the first iteration as structurals==0
         * and is done for performance reasons; we can hide some of the latency of
         * the
         * expensive carryless multiply in the previous step with this work */
        uint64_t structurals = 0;
      
        size_t lenminus64 = len < 64 ? 0 : len - 64;
        size_t idx = 0;
        uint64_t error_mask = 0; /* for unescaped characters within strings (ASCII
                                    code points < 0x20) */
      
        for (; idx < lenminus64; idx += 64) {
          find_structural_bits_64(&buf[idx], idx, base_ptr, base,
                                  prev_iter_ends_odd_backslash,
                                  prev_iter_inside_quote, prev_iter_ends_pseudo_pred,
                                  structurals, error_mask, utf8_state);
        }
        /* If we have a final chunk of less than 64 bytes, pad it to 64 with
         * spaces  before processing it (otherwise, we risk invalidating the UTF-8
         * checks). */
        if (idx < len) {
          uint8_t tmp_buf[64];
          memset(tmp_buf, 0x20, 64);
          memcpy(tmp_buf, buf + idx, len - idx);
          find_structural_bits_64(&tmp_buf[0], idx, base_ptr, base,
                                  prev_iter_ends_odd_backslash,
                                  prev_iter_inside_quote, prev_iter_ends_pseudo_pred,
                                  structurals, error_mask, utf8_state);
          idx += 64;
        }
      
        /* is last string quote closed? */
        if (prev_iter_inside_quote) {
          return simdjson::UNCLOSED_STRING;
        }
      
        /* finally, flatten out the remaining structurals from the last iteration
         */
        flatten_bits(base_ptr, base, idx, structurals);
      
        pj.n_structural_indexes = base;
        /* a valid JSON file cannot have zero structural indexes - we should have
         * found something */
        if (pj.n_structural_indexes == 0u) {
          return simdjson::EMPTY;
        }
        if (base_ptr[pj.n_structural_indexes - 1] > len) {
          return simdjson::UNEXPECTED_ERROR;
        }
        if (len != base_ptr[pj.n_structural_indexes - 1]) {
          /* the string might not be NULL terminated, but we add a virtual NULL
           * ending character. */
          base_ptr[pj.n_structural_indexes++] = len;
        }
        /* make it safe to dereference one beyond this array */
        base_ptr[pj.n_structural_indexes] = 0;
        if (error_mask) {
          return simdjson::UNESCAPED_CHARS;
        }
        return utf8_state.errors();
      }`}]

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
        let code=codeSample.find(codeObject=>codeObject.name.toLocaleLowerCase()==codeName.toLocaleLowerCase())
        if(!code) return;
        var newcode = "#include <x86intrin.h>\n\n"+code.code;
        this.setState({code:newcode});
        this.restart()
        this.shouldcallviz = true;
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
                 <Pane label="Register Matrix">
                    <ViewRegister cm={this.cm} asm={this.state.asm}
                                   onGoToParameters={() => this.setState({parametersChosen: false})}/>
                </Pane>
                <Pane label="AST">
                    <AstVisualizer cm={this.cm} ast={this.state.ast}/>
                </Pane>
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
                        codeSample={codeSample}
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

