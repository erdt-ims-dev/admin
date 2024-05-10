import React from 'react';
import { BasicStyles } from 'common';
import Colors from 'common/Colors';
import { Spinner } from 'react-bootstrap';

export default class Stack extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
        <Spinner animation="border" role="status" style={{ position: 'absolute', top: '50%', left: '50%', }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
}