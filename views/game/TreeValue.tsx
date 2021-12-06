import React from 'react'
import ValueWithControls from '../helpers/ValueWithControls'

interface TreeValueProps {
  registerNumber: number;
  needed: number;
  stored: number;
  canEdit: boolean;
}

export default function TreeValue (props: TreeValueProps) {
  const actionType = 'CHANGE_REGISTER'
  const storedPayloadAdd = {
    registerNumber: props.registerNumber,
    register: {
      needed: props.needed,
      stored: props.stored + 1
    }
  }
  const storedPayloadSubstract = {
    registerNumber: props.registerNumber,
    register: {
      needed: props.needed,
      stored: props.stored - 1 < 0 ? 0 : props.stored - 1
    }
  }
  const neededPayloadAdd = {
    registerNumber: props.registerNumber,
    register: {
      stored: props.stored,
      needed: props.needed + 1
    }
  }
  const neededPayloadSubstract = {
    registerNumber: props.registerNumber,
    register: {
      stored: props.stored,
      needed: props.needed - 1 < 0 ? 0 : props.needed - 1
    }
  }
  return (
    <div className="single-register-data">
      <ValueWithControls
        current={props.stored}
        canEdit={props.canEdit}
        actionType={actionType}
        actionPayloadAdd={storedPayloadAdd}
        actionPayloadSubstract={storedPayloadSubstract}
      />
      <ValueWithControls
        current={props.needed}
        canEdit={props.canEdit}
        actionType={actionType}
        actionPayloadAdd={neededPayloadAdd}
        actionPayloadSubstract={neededPayloadSubstract}
      />
    </div>
  )
}
