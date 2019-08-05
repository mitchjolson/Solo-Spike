import React, { Component } from 'react';
import { connect } from 'react-redux';


// DO NOT MODIFY THIS FILE FOR BASE MODE!

class AnimalListItem extends Component {
    // Renders the list of animals

    handleDelete = () => {
        this.props.dispatch({ type: 'DELETE_ANIMAL', payload: this.props.classData.id});
    }

    render() {
        return (
            <tr>
                <td>{this.props.classData.species_name}</td>
                <td>{this.props.classData.class_name}</td>
                <td><button onClick={this.handleDelete}>Delete</button></td>
            </tr>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState
});

export default connect(mapReduxStateToProps)(AnimalListItem);
