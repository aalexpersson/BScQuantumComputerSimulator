import React, { useState, ReactNode, useEffect, useRef } from 'react';
import './circuitboard.css';
import './toolbar.css';
import Toolbar from './toolbar';
import {DndContext} from '@dnd-kit/core';
import axios from 'axios';
import Circuitboard from './circuitboard';
import './slider.css'

function App() {
  // This matrix doesn't contain actual elements, just information about what the circuit looks like.
  const [circuit, setCircuit] = useState([["I","I","I","I"], ["I","I","I","I"], ["I","I","I","I"], ["I","I","I","I"], ["I","I","I","I"], ["I","I","I","I"]]);
  // Initializing this because it complains about type otherwise, there is probably a better way to do it.
  const [states, setStates] = useState([{"step":0, "state":[]}]);

  const [stepNumber, setStepNumber] = useState(0)
  const onChange = (e:any) => {
    setStepNumber(e.target!.value)
    console.log(stepNumber)
  }

  useEffect(() => {
    // This effect will be triggered whenever the circuit state changes
    sendCircuit();
  }, [circuit]);

  // TODO implement setCircuit (aka add + and - buttons).

  return (
    <div className="App">
      <DndContext onDragEnd={handleDragEnd}>
        <Toolbar />
        <Circuitboard {...circuit}/> {/*shallow copy of circuit to circuitboard, solve for it to be in circuitboard later*/}
        {/*<button onClick={sendCircuit}>send circuit</button>*/}
        <div className='slider-container'>
          <input
            type='range'
            min={1}
            max={4}
            defaultValue={4}
            step={1}
            className='range'
            onChange={onChange}
          />
          <div className='step-numbers'>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
          </div>
        </div>
        <States />
      </DndContext>
    </div>
  );
  
  

function handleDragEnd(event:any){
    const {active, over} = event;
    console.log(over.id[0]);
    if(active.id == "C_down"){
      if(over.id[0] == 5){
        alert("No gate to control.");
        return;
      }
      if(circuit[parseInt(over.id[0]) + 1][parseInt(over.id[1])] == "I"){
        alert("No gate to control.");
        return;
      }
    }

    console.log("Placed gate on position " + over.id[1] + " on qubit line " + over.id[0]);

    // These nested maps replace the gate at the given position.
    const newCircuit = circuit.map((line, i) => {
      if(i === (Number(over.id[0]))) {
        return (line.map((gate, j) => {
          if(j === (Number(over.id[1]))){
            return (active.id);
          } else{
            return (gate);
          }
        }));
      } else {
        return line;
      } 
    });
    setCircuit(newCircuit);
    
  }
  

  async function sendCircuit() {
    console.log("Sending circuit: " + convertToOldVersion(circuit));
    const response = await axios.post('http://localhost:8000/simulate',
        {circuit_matrix: convertToOldVersion(circuit)})
  .then(function(response: any){
    console.log(response);
    setStates(response.data.state_list);
  })}

  function convertToOldVersion(newCircuit:string[][]){
    for(let i = 0; i < newCircuit.length - 1; i++){
      for(let j = 0; j < newCircuit[0].length; j++){
        if(newCircuit[i][j] == "C_down"){
          newCircuit[i][j] = "CNOT-1";
          newCircuit[i + 1][j] = "CNOT-2";
          //newCircuit = swapMatrixItem(newCircuit, i + 1, j, "CNOT-2")
        }
      }
    }
    return newCircuit;
  }

  function getState(step: number) {
    let allStates: string[] = [];

    states.map((timeStep) => (
      allStates.push(JSON.stringify(timeStep.state))
    ))

    return allStates[step];
  }

  function States() {
    return (
      <section className="states">
        <h2>{getState(stepNumber)}</h2>
      </section>
    );
}


  /*function swapMatrixItem(matrix:string[][], y:number, x:number, newItem:string){
    const newMatrix = matrix.map((line, i) => {
      if(i === y) {
        return (line.map((gate, j) => {
          if(j === x){
            return (newItem);
          } else{
            return (gate);
          }
        }));
      } else {
        return line;
      } 
    });
  }*/
}



export default App;
