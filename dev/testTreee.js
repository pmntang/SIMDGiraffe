

var test =[0,[1, [3,[7 ,[15], [16] ], [8 ,[17], [18]]], [4, [9 ,[19], [20]], [10, [21] ,[22]]]], [2, [5, [11, [23], [24]], [12, [25], [26]]], [6 ,[13, [27], [28]], [14, [29], [30]]]]];




var width=1920, heigth=1080, radius=20,firsTranslation="translate(960, 50)",first=true,x0t=200, y0t=20, angt=0, coefCox=0;
var coefCoy=20,coefAng=0 ; //x0=500, y0=25, pasx=120, pasy=35;
window.onload = function init() {

pictureTree(test, global);

  
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
 


function pictureTree(ast, g){
    if ((first)&&!(ast.length===0)){
        drawnSvgCircle(0, 0, radius, ast[0], global);
        first=false;
     }
    var l
    if (!(ast[1].length===0)){
        l=ast[1].length;
        switch (l){
            case 1:pictureLefttree(ast,g);
                break;
            case 3:{
                pictureLefttree(ast, g);
                pictureTree(ast[1], pictureLefttree(ast, g));

            }
                break;
        }
    }
    if (!(ast[2].length===0)){
         l=ast[2].length;
        switch (l){
            case 1:pictureRighttree(ast,g);
                break;
            case 3:{
            pictureRighttree(ast,g);
            pictureTree(ast[2], pictureRighttree(ast,g));
            
        }
                break;
    }
}
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
    var tab=[];
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
    tab.push(circle);
    tab.push(text);
    return tab;
 }

function drawnSvgLine(abs1, ord1, abs2,translat, parentElt){
    var line=document.createElementNS(ns,"line");
    line.setAttribute("x1",""+abs1);
    line.setAttribute("x2", ""+abs2);
    line.setAttribute("y1", ""+ord1);
    line.setAttribute("y2", ""+translat);
    parentElt.appendChild(line);
    return line;
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