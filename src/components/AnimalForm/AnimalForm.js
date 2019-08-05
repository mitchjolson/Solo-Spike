import React, { Component } from 'react';
import { connect } from 'react-redux';

// DO NOT MODIFY THIS FILE FOR BASE MODE!

class AnimalForm extends Component {

    state = {
        species_name: '',
        class_id: '1',
    }

    handleChangeSpecies = (event) => {
        this.setState({ species_name: event.target.value });
    }
    handleChangeClass = (event) => {
        this.setState({ class_id: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.dispatch({type: 'CREATE_ANIMAL', payload: this.state});
    }

    // Renders the list of animals
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <h4>Add Animal</h4>
                    <label>Species</label>
                    <input type='text' onChange={(event) => this.handleChangeSpecies(event)} />
                    <label>Class</label>
                    <select required type='form' onChange={(event) => this.handleChangeClass(event)}>
                        <option value='1'>Mammal</option>
                        <option value='2'>Bird</option>
                        <option value='3'>Fish</option>
                        <option value='4'>Reptile</option>
                        <option value='5'>Amphibian</option>
                    </select>
                    <button type="submit">Submit</button>
                </form>
                <br/>
            </div>
        );
    }
}

// Makes our reducers available in our component
const mapReduxStateToProps = (reduxState) => ({
    reduxState
});

export default connect(mapReduxStateToProps)(AnimalForm);