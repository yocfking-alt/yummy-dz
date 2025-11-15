import React from 'react';
import { AppRegistry } from 'react-native';
import HomeScreen from './HomeScreen';

const App = () => <HomeScreen />;

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root')
});
