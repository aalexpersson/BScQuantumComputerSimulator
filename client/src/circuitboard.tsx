import React, { useState, ReactNode, useEffect } from 'react';
import './circuitboard.css';
import './toolbar.css';
import Slot from './slot';



function Circuitboard( { circuit, setCircuit, sendCircuit} :{circuit: string[][], setCircuit : (circuit: string[][]) => void, sendCircuit: () => void}){
    const [qubitLines, setQubitLines] = useState<ReactNode[]>([]);

    useEffect(() => {
      console.log("setqubitlines-circuit: " + circuit)
      setQubitLines([
        <div>
          <QubitLine id="0"/>
        </div>,
        <div>
          <QubitLine id="1"/>
        </div>,
        <div>
          <QubitLine id="2"/>
        </div>,
        <div>
          <QubitLine id="3"/>
        </div>,
        <div>
          <QubitLine id="4"/>
        </div>,
        <div>
          <QubitLine id="5"/>
        </div>
      ]);
    }, [circuit, sendCircuit]); // Circuit dependency array to make it only update when circuit is changed

    function QubitLine(props:any) {
        const qubitLineId = Number(props.id);
        const circuitLine = circuit[qubitLineId] || []; // Fallback to an empty array if circuit[qubitLineId] is undefined
      
        return (
            <div className='qubitLine'>
              <h2>|0⟩</h2>
              <hr/>
              <div className='slot-container'>
                {//TODO create records for gateTypes and their corresponding names
                }
                {circuitLine.map((gate, index) => <Slot name={gate} gateType={gate} id={`${qubitLineId}${index}`} key={`${qubitLineId}${index}`} circuit={circuit} setCircuit={setCircuit} sendCircuit={sendCircuit}/>)}
              </div>
            </div>
        );
      }

    return(
    <div>
      <section className="circuit">
        {qubitLines}
      </section>
      {/*<button onClick={addQubit}>+</button>
      <button onClick={removeQubit}>-</button>*/}
    </div>)
  }
  export default Circuitboard;