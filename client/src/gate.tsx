import React, { useState, ReactNode, useEffect } from 'react';
import './gate.css';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

function Gate(props:any) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: props.id,
      });
      const style = {
        transform: CSS.Translate.toString(transform),
        width: 50,
        height: 50
        
      };
      
      return (
        <button className="gate" ref={setNodeRef} style={style} {...listeners} {...attributes}>
          <h1>{props.name}</h1>
        </button>
      );
  }

export default Gate;