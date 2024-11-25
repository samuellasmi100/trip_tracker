import { createStore, applyMiddleware } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import createRootReducer from './reducers'


export default function configureAppStore (preloadedState) {
  const middleware = [thunkMiddleware]
  const enhancers = [applyMiddleware(...middleware)]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(createRootReducer(), preloadedState, composedEnhancers)

  return store
}