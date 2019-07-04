import React from "react";
import { preRetrieveLinePosition } from "./VectorRegister";
export function retrieveLinePosition(aPosition, aMatrix) {
  let preRetriveMatrixLine = preRetrieveLinePosition(aPosition, aMatrix);
  var ligne1 = <th rowspan="3" scope="rowgroup">{preRetriveMatrixLine[0].name}</th>, ligne2 = null, ligne3 = null;
  for (let j = 1; j < preRetriveMatrixLine.length; j++) {
    if (preRetriveMatrixLine[j]) {
      let statePos = preRetriveMatrixLine[j];
      switch (statePos) {
        case "in":
          {
            ligne1 = <React.Fragment>{ligne1}<td>in</td></React.Fragment>;
            ligne2 = <React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>;
            ligne3 = <React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>;
          }
          break;
        case "out":
          {
            ligne1 = <React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>;
            ligne2 = <React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>;
            ligne3 = <React.Fragment>{ligne3}<td>out</td></React.Fragment>;
          }
          break;
        case "inout":
          {
            ligne1 = <React.Fragment>{ligne1}<td>in</td></React.Fragment>;
            ligne2 = <React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>;
            ligne3 = <React.Fragment>{ligne3}<td>out</td></React.Fragment>;
          }
          break;
      }
    }
    else {
      {
        ligne1 = <React.Fragment>{ligne1}<td className="empty"></td></React.Fragment>;
        ligne2 = <React.Fragment>{ligne2}<td className="empty"></td></React.Fragment>;
        ligne3 = <React.Fragment>{ligne3}<td className="empty"></td></React.Fragment>;
      }
    }
  }
  console.log("2", <tbody><tr>{ligne1}</tr><tr>{ligne2}</tr><tr>{ligne3}</tr></tbody>, "ligne1", ligne1, "ligne2", ligne2, "ligne3", ligne3);
  return <tbody><tr>{ligne1}</tr><tr>{ligne2}</tr><tr>{ligne3}</tr></tbody>;
}
