 function cleanExpression(s){ //just supress superfluous space and other invisible characters
     return (s.replace(/\s{1,}/g, ' ')).trim();
 }

function extractExpression(s){     //this function extract the different expressions of a given c code, by expression we mean a piece of code situated after a ';' or a '{' and ended either by ';' or by '}'.This extract the expressions at the "same level"
    s=cleanExpression(s);
    var accoladeIndication=0;
     var expresions=[];
     const delimiters=new Set([';', '}']);
     var i=s.indexOf('{')+1,lengthS=s.lastIndexOf('}'); // we first determine the begining and the ending of the piece of c code
     var  semicolonPosition=i;
     while(i<lengthS){
         if (s[i]==='{'){
             accoladeIndication++; //indicates if we are not inside an expression
         }
         if (s[i]==='}'){
             accoladeIndication--;
         }
         
        if(delimiters.has(s[i]) && accoladeIndication === 0){ // if the caracter is a delimiter of expression and if we are not inside an expression
            expresions.push((s.slice(semicolonPosition+1, i)).trim()) //we extract the expression begining from the last delimiter to this delimiter
            semicolonPosition=i; // we save the position of this delimiter
        }
         i++;
     }
     return expresions;
 }



function extractParameter(s){     //this function extract the different effective parameter of a c function (call function)
     s=cleanExpression(s);
     var semicolonIndication=0; 
     var expresions=[];
     const delimiters=new Set([',']);
     var i=0,lengthS=s.length; // we first determine the begining and the ending of the parameter previously extracted
     var  semicolonPosition=i;
     while(i<lengthS){
         if (s[i]==='('){
             semicolonIndication++; //indicates if we are not inside an expression
         }
         if (s[i]===')'){
             semicolonIndication--;
          }
         
        if(delimiters.has(s[i]) && semicolonIndication === 0){ // if the caracter is a delimiter of expression and if we are not inside an expression
            expresions.push((s.slice(semicolonPosition, i)).trim()) //we extract the expression begining from the last delimiter to this delimiter
            semicolonPosition=i+1; // we save the position of this delimiter
        }
         i++;
         if(i===lengthS){
             expresions.push((s.slice(semicolonPosition, i)).trim()) //to take the last string
         }
     }
     return expresions;
 }



function processCCode(cCode){
        var tab=[];
        if(simpleExpression(cCode)){
            tab=Array.of(cCode);
            return tab;
    }
        if(regexFunctionDeclar.test(cCode)){
            var t=extractExpression(cCode);
            t.push('body');
            tab=Array.of(regexFunctionDeclar.exec(cCode)[2], ['returntype',[regexFunctionDeclar.exec(cCode)[1]]],t.reverse());
                for(var j=1; j<tab[2].length; j++){
                    if (simpleExpression(tab[2][j])){
                        tab[2][j]=Array.of(tab[2][j]);
                        continue;
                    }
                    else{
                        tab[2][j]=processCCode(tab[2][j]);                        
                    }
                    
                }
            return tab;
    }
 
        if(regexFunctioncall.test(cCode)){
            var paramString = regexFunctioncall.exec(cCode)[2]
            var t=extractParameter(paramString);
            t.push('parameters');
            tab=Array.of(regexFunctioncall.exec(cCode)[1], t.reverse());
                for(var j=1; j<tab[1].length; j++){
                     if (simpleExpression(tab[1][j])){
                        tab[1][j]=Array.of(tab[1][j]);
                        continue;
                    }
                    else{
                        tab[1][j]=processCCode(tab[1][j]);                        
                    }

                }
            return tab;
    }
        if(regexAssignExpr.test(cCode)){
            var regArray = regexAssignExpr.exec(cCode)
            tab=Array.of('=',[regArray[2],[regArray[1]]], [regArray[3]]);
                 if (!simpleExpression(tab[2][0])){
                      //  tab[2][0]=tab[2][0];
                  //  }
              //   else
                  //   {
                         tab[2][0]=processCCode(tab[2][0]);                         
                     }


            return tab;
    }
        if(regexReturnExpr.test(cCode)){
            tab=Array.of('return',[regexReturnExpr.exec(cCode)[1]]);
            if (simpleExpression(tab[1][0])){
                        tab[1][0]=Array.of(tab[1][0]);
                    }
                 else
                     {
                         tab[1][0]=processCCode(tab[1][0]);                         
                     }


            return tab;
    }
    
    
}



function simpleExpression(s){
    return !(regexFunctionDeclar.test(s)||regexAssignExpr.test(s)||regexFunctioncall.test(s)||regexReturnExpr.test(s));
}


function identifyNatureOfExpr(s){
var regex=/^\s*(?:void|char|uint8_t|short|int|long|float|double|signed|unsigned|Bool|Complex|__m128|__m128d|__m128i|__m256|__m256d|__m256i|__m512|__m512d|__m512i)\s+(?:[_$a-zA-Z][_$a-zA-Z0-9]*)\s*\(\s*(?:void|char|uint8_t|short|int|long|float|double|signed|unsigned|Bool|Complex|__m128|__m128d|__m128i|__m256|__m256d|__m256i|__m512|__m512d|__m512i)\s+(?:[_$a-zA-Z][_$a-zA-Z0-9]*)\s*(?:,(?:void|char|uint8_t|short|int|long|float|double|signed|unsigned|Bool|Complex|__m128|__m128d|__m128i|__m256|__m256d|__m256i|__m512|__m512d|__m512i)\s+(?:[_$a-zA-Z][_$a-zA-Z0-9]*)\s*)*\s*(?:\)\s*(?=\{))/;
}


var regexFunctionDeclar=/^\s*([_$a-zA-Z][_$a-zA-Z0-9]*)\s+([_$a-zA-Z][_$a-zA-Z0-9]*)\s*\(\s*(?:[_$a-zA-Z][_$a-zA-Z0-9]*)\s+\*?(?:[_$a-zA-Z][_$a-zA-Z0-9]*)\s*(?:,(?:[_$a-zA-Z][_$a-zA-Z0-9]*)\s+\*?(?:[_$a-zA-Z][_$a-zA-Z0-9]*)\s*)*\s*(?:\)\s*(?=\{))/, regexFunctioncall=/^\s*([_$a-zA-Z][_$a-zA-Z0-9]*)\s*\((.*)(?=\)$|\)(?=;))/, regexReturnExpr=/^\s*return\s+(.*)/,regexAssignExpr=/^\s*(?:([_a-zA-Z][\._a-zA-Z0-9]*)\s+)?([\*_$a-zA-Z][\._a-zA-Z0-9]*)\s*=\s*(.*)/;

var ss1='__m256i avx512_pcg32_random_r(avx512_pcg32_random_t *rng) {  __m512i oldstate = *rng.state; *rng.state = _mm512_add_epi64(_mm512_mullo_epi64(*rng.multiplier, *rng.state),*rng.inc);  __m512i xorshifted = _mm512_srli_epi64(   _mm512_xor_epi64(_mm512_srli_epi64(oldstate,        18), oldstate), 27);  __m512i rot = _mm512_srli_epi64(oldstate, 59);  return _mm512_cvtepi64_epi32(_mm512_rorv_epi32(xorshifted,    rot));}   ', s='_mm512_srli_epi64(_mm512_xor_epi64(_mm512_srli_epi64(oldstate, 18), oldstate), 27);';

var debugString = 'int a=c+d; }';

var ssa= `__m256i interleave_uint8_with_zeros_avx_lut(__m256i word) {   __m256i m = _mm256_set_epi8(85, 84, 81, 80, 69, 68,              65, 64, 21, 20, 17, 16, 5, 4, 1, 0, 85, 84,                81, 80, 69, 68, 65, 64, 21, 20, 17, 16, 5, 
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
}`

var ssb= `__m256i interleave_uint8_with_zeros_avx_lut(__m256i word) { int a=b+6;
}`
let ssimple = ''
//ss=extractExpression(ss1);
//console.log(regexFunctionDeclar.exec(ss1), extractExpression(ss1))
//console.log(processCCode(ssimple))
//console.log(extractParameter(regexFunctioncall.exec(extractParameter(regexFunctioncall.exec(s)[2])[0])[2]));
//console.log(extractParameter(regexFunctioncall.exec(ssimple)[2]))
console.log(processCCode(ssa))
//console.log(regexAssignExpr.exec('(*rng).state = _mm512_add_epi64(_mm512_mullo_epi64((*rng).multiplier, (*rng).state),(*rng).inc)'))

/*var regex1=/^\s*([_$a-zA-Z][_$a-zA-Z0-9]*)\s*\((.*)(?:\)\s*(?=\s|;))/, ss=cleanExpression(ss1);

var ssa=regex1.exec(s)[2], s4='je suis) malade)  ', s5='je suis malade );', s6='je suis malade )  ', r4=/^(.*)(?=\)$|\)(?=;))/;//(?:\)\s*(?=\s|;))/;




var ss2=extractParameter(ssa);


console.log( 'ici',ssa, ss2, 'la bas', extractExpression(ss),regexAssignExpr.exec(extractExpression(ss)[2]));
//console.log(processCCode(ss));
*/



