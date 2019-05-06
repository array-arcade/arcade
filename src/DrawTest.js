import React from "react";
import CanvasDraw from "react-canvas-draw";
import { Button } from "@material-ui/core";

export class DrawTest extends React.Component {
  render() {
    return (
      <div>
        <CanvasDraw
          ref={canvasDraw => {this.saveableCanvas = canvasDraw}}
          hideGrid="true"
          brushRadius="3"
          canvasHeight="70vh"
          canvasWidth="100vw"
          lazyRadius="10"
          brushColor=" #000000"
          style={{
            boxShadow:
              "0 13px 27px -5px rgba(20, 20, 63, 0.1),    0 2px 3px -2px rgba(1, 200, 1, 0.3)"
          }}
        />
        <Button onClick={() => CanvasDraw.clear()}>Clear</Button>
        <Button size="medium" color="primary" fullWidth={true}>
          Submit
        </Button>
      </div>
    );
  }
}
