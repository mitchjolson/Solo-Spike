import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import Axios from 'axios';
import { takeEvery, put } from 'redux-saga/effects';



import cron from 'node-cron';


// Cron can be used to schedule tasks
// second, minute, hour, day of month, month, day of week

cron.schedule('*/1 * * * * *', () => {
    console.log('Running this task every 1 seconds');
}, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });

cron.schedule('*/5 * * * * *', () => {
    console.log('Running this task every 5 seconds');  
}, {
        scheduled: false,
        timezone: "America/Sao_Paulo"
    });




// Your saga should listen for the action type of `GET_ZOO_ANIMALS`
function* rootSaga() {
    yield takeEvery('GET_ZOO_ANIMALS', getAnimals);
    yield takeEvery('CREATE_ANIMAL', postAnimal);
    yield takeEvery('DELETE_ANIMAL', deleteAnimal);
}

function* deleteAnimal(action) {
    try {
        yield Axios.put(`/zoo/${action.payload}`);
        yield getAnimals();
    } catch (error) {
        console.log('Error deleting animal', error);
    }
}

function* getAnimals() {
    try {
        const response = yield Axios.get('/zoo')
        yield put ({type: 'SET_ZOO_ANIMALS', payload: response.data})
    } catch (error) {
        console.log('Error retrieving list of animals', error);
    }
}

function* postAnimal(action){
    try {
        yield Axios.post('/zoo', action.payload)
        yield put ({type:'GET_ZOO_ANIMALS'})
    } catch (error) {
        console.log('Error creating new animal', error)
    }
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Used to store class and number of unique animals in that class
const zooAnimals = (state = [], action) => {
    switch (action.type) {
        case 'SET_ZOO_ANIMALS':
            return action.payload;
        default:
            return state;
    }
}

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        zooAnimals,
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, 
    document.getElementById('root'));
registerServiceWorker();
