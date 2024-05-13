import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './style.css';
// Allows this.props.inject to forcefully inject value to field, good for displays
class InputField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            focussed: true, // Always set to true
            value: props.initialValue || '', // Use initialValue prop to set the initial state
            error: props.error || '',
            label: props.label || '',
        };
    }

    componentDidUpdate(prevProps) {
        // If the label prop changes, update the value state to match
        if (prevProps.label !== this.props.label) {
            this.setState({ value: this.props.label });
        }
    }

    onChange = event => {
        const value = event.target.value;
        const error = null;
        this.setState({ value, error: '' });
        return this.props.onChange(value, error);
    }

    render() {
        const { id, type, placeholder, locked, border, inject } = this.props;
        const { focussed, value, error, label } = this.state;
        const fieldClassName = `field ${focussed && 'focussed'} ${locked && 'locked'}`;
        return (
            <div className={fieldClassName}>
                <input 
                    id={id}
                    value={inject} 
                    className=""
                    type={type} 
                    placeholder={focussed ? '' : label}
                    onChange={this.onChange}
                    onFocus={() => !locked && this.setState({ focussed: true })}
                ></input>
                <label htmlFor={id} className={error && 'error'}>
                    {error || label}
                </label>
            </div>
        )
    }
}

export default InputField;
