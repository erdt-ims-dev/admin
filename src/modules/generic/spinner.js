import React from 'react';
import {BasicStyles} from 'common'
import Colors from 'common/Colors'
import { Spinner } from 'react-bootstrap'
export default class Stack extends React.Component {
  constructor(props) {
    super(props);
  }

  // White background spinner, covers the entire screen

  render() {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  }
}
