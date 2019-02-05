

var test =[0,[1, [3,[7 ,[15], [16] ], [8 ,[17], [18]]], [4, [9 ,[19], [20]], [10, [21] ,[22]]]], [2, [5, [11, [23], [24]], [12, [25], [26]]], [6 ,[13, [27], [28]], [14, [29], [30]]]]];

var tab=[0,["a"],[10],[1,[2]],[3,[7]],[4,[5],[6]]], x0=100, y0=10;


var width=1920, heigth=1080, radius=15,firsTranslation="translate(960, 50)",first=true,x0t=200, y0t=20, angt=0, coefCox=0, x0=0, y0=0;
var coefCoy=20,coefAng=0 ; //x0=500, y0=25, pasx=120, pasy=35;
window.onload = function init() {

drawnSvgCircle(-100, 100,10, 'r1', global);

drawnSvgCircle(-150, 170,10, 'r2', global);
    var c1={}, c2={}; c1.abs=-100; c2.abs=-150; c1.ord=100; c2.ord=170;c1.svgElt=global; c2.svgElt=global;
    linkContext(c1,c2);
    
    pictureTree(tab,initialContext);

//drawnSvgLine(100, 100, 150, 170, global);
  
};

        var ns="http://www.w3.org/2000/svg", style="fill:none;stroke:#000000;font-size:20px;font-weight:bold;";
        var displayzone=document.getElementById("display"), svg=document.createElementNS(ns,"svg");
      svg.setAttribute( "width", ""+width);
      svg.setAttribute( "height", ""+heigth); 
      svg.setAttribute("id", "svg");
      displayzone.appendChild(svg);
      var global=document.createElementNS(ns, "g");
      global.setAttribute("id", "global");
      global.setAttribute("transform", firsTranslation);
      global.setAttribute("style", style);
      svg.appendChild(global);
      var initialContext={};
      initialContext.level=0; initialContext.abs=x0; initialContext.ord=y0; initialContext.svgElt=global;


function pictureTree(ast, globalContext){
   if(ast.length >= 1){
       drawnSvgCircle(globalContext.abs, globalContext.ord, radius, ast[0], globalContext.svgElt);
       console.log(globalContext.abs, globalContext.ord,  'ast:  '+ast[0], 'niveau  '+globalContext.level);
   }
    if(ast.length > 1){ 
        for(var i=1; i<ast.length; i++){
            var localContext={};
            localContext.level=globalContext.level+1; localContext.abs=Math.ceil(i*(width/ast.length)-width/2); localContext.ord=localContext.level*100;localContext.svgElt=document.createElementNS(ns, "g");
            var translation="translate("+localContext.abs+","+localContext.ord+")";
            linkContext(localContext, globalContext);
            localContext.svgElt.setAttribute("id",("local"+i)+localContext.level);
            localContext.svgElt.setAttribute("transform", translation);
            localContext.abs=0;localContext.ord=0;
            pictureTree(ast[i], localContext);
           // console.log(localContext.abs, localContext.ord);

        }
    }
}
        

function getNestedChildren(arr, root) {
    const empty = [];
    const childrenOf = {};

    // build a dictionary containing all nodes keyed on parent
    arr.forEach((node) => {
        if (!childrenOf[node.headerId]) childrenOf[node.headerId] = [];
        childrenOf[node.headerId].push(node);
    });

    // attach children to their parents and decorate with level
    const iterateHash = (parent, level) => {
        const nodes = childrenOf[parent] || empty;
        return nodes.map((node) => {
            const children = iterateHash(node.workId, level + 1);
            // remove the first argument {} to mutate arr
            return Object.assign({}, node, { level, children });
        });
    };

    return iterateHash(root, 0);
}

console.log( getNestedChildren(tab, 8) )



function refreshAbscissa(x, y){
    return (-2-1*x)+(2+1*y)
}

function refreshOrdinate(x,y){
    return (1*x)+(2+1*y)
}

function pictureRighttree(ast,g){
    var gr=document.createElementNS(ns, "g");
    //I can put an if or case here on the depth of the tree, and move to xt, yt and angle fixed values to improve the display of the tree (in fact avoid stacking).
    var xt=depth(ast)*coefCox*x0t+x0t, yt=reverseDepth(ast)*coefCoy*y0t+y0t,ang=depth(ast)*coefAng*angt+angt; 
    var cr=drawnSvgCircle(0, 0, radius, ast[2][0], gr)[0], tr=drawnSvgCircle(0, 0, radius, ast[2][0], gr)[1];
    var lr=drawnSvgLine(0, 0, -xt, -yt, gr), yto=-yt, ango=-ang;
    gr.setAttribute("transform", "translate("+xt+","+yt+") rotate("+ango+", 0, "+yto+")");
    gr.appendChild(cr);
    gr.appendChild(tr);
    gr.appendChild(lr);
    g.appendChild(gr);
    return gr;
}
                    
function pictureLefttree(ast,g){
    var gl=document.createElementNS(ns, "g");
    //I can put an if or case here on the depth of the tree, and move to xt, yt and angle fixed values to improve the display of the tree (in fact avoid stacking).
    var xt=depth(ast)*coefCox*x0t+x0t, yt=reverseDepth(ast)*coefCoy*y0t+y0t,ang=depth(ast)*coefAng*angt+angt; 
    var cl=drawnSvgCircle(0, 0, radius, ast[1][0], gl)[0], tl=drawnSvgCircle(0, 0, radius, ast[1][0], gl)[1];
    var ll=drawnSvgLine(0, 0, xt,-yt, gl), yto=-yt, xto=-xt; //ango=-ang;
    gl.setAttribute("transform", "translate("+xto+","+yt+") rotate("+ang+", 0, "+yto+")");
    gl.appendChild(cl);
    gl.appendChild(tl);
    gl.appendChild(ll);
    g.appendChild(gl);
    yt=yt+coefCoy*yt; ang=ang+coefAng*ang; xt=xt+coefCox*xt;
    return gl;
}


function drawnSvgCircle(abs, ord, rad, root, parentElt){
    var circle=document.createElementNS(ns, "circle");
    circle.setAttribute("cx", ""+abs);
    circle.setAttribute("cy", ""+ord);
    circle.setAttribute("r", ""+rad);
    parentElt.appendChild(circle);
    var text=document.createElementNS(ns, "text");
    text.setAttribute("x", ""+abs);
    text.setAttribute("y", ""+ord);
    text.textContent=""+root;
    parentElt.appendChild(text);
 }

function linkContext(c1, c2){
    var line=document.createElementNS(ns,"line");
    line.setAttribute("x1", ""+c1.abs);
    line.setAttribute("x2", ""+c2.abs);
    line.setAttribute("y1", ""+c1.ord);
    line.setAttribute("y2", ""+c2.ord);
    if(!(c1.svgElt==c2.svgElt))
        {
            c2.svgElt.appendChild(c1.svgElt);
        }
    c2.svgElt.appendChild(line);
}
function drawnSvgLine(abs1, ord1, abs2,ord2, parentElt){
    var line=document.createElementNS(ns,"line");
    line.setAttribute("x1", ""+abs1);
    line.setAttribute("x2", ""+abs2);
    line.setAttribute("y1", ""+ord1);
    line.setAttribute("y2", ""+ord2);
    parentElt.appendChild(line);
 }

function depth(ast){
    var d=0;
d=(ast.length===1)?1:1+Math.max(depth(ast[1]),depth(ast[2]));
return d;
}

function reverseDepth(ast){
    var d=0;
    d=(depth(ast)===0)?0:(1/depth(ast));
    return d;
}



console.log(depth(test), reverseDepth(test));