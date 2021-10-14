import createSagaMiddleware from 'redux-saga'
import saga from './redux/sagas'
import {reducers} from './redux/reducers'
import { applyMiddleware, createStore } from 'redux'

const sagaMiddleware = createSagaMiddleware();

export default createStore(
        reducers,
        applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(saga);