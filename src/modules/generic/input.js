import React, { Component } from 'react'
import { ListGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import './style.css'

// generic custom input

class InputField extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: null,
          focussed: (props.locked && props.focussed) || false,
            value: props.value || '',
            error: props.error || '',
            label: props.label || '',
        };
      }
      onChange = event => {
        const { id } = this.props;
        const value = event.target.value;
        this.setState({ value, error: '' });
        return this.props.onChange(value);
      }
      componentDidUpdate(prevProps) {
        // Check if the error prop has changed
        if (this.props.error !== prevProps.error) {
            // Update the internal state to reflect the new error message
            this.setState({ error: this.props.error });
        }
    }
    render() {
        const {id, type, placeholder, locked} = this.props;
        const { focussed, value, error, label } = this.state;
        const fieldClassName = `field ${(locked ? focussed : focussed || value) && 'focussed'} ${locked && !focussed && 'locked'}`;
        return (
            <div className={fieldClassName}>
                <input 
                id={id}
                value={value} 
                className=''  
                type={type} 
                placeholder={focussed ? '' : label}
                onChange={this.onChange}
                onFocus={() => !locked && this.setState({ focussed: true })}
                onBlur={() => !locked && this.setState({ focussed: false })}
                ></input>
                <label htmlFor={id} className={error && 'error'}>
                    {error || label}
                </label>
            </div>
        )
    }
}

export default InputField