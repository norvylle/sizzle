import React from 'react';
import TitlePage from './components/TitlePage';
import CreatePage from './components/CreatePage';
import HomePage from './components/Home';
import { createStackNavigator, createSwitchNavigator} from 'react-navigation';

const AppStack = createStackNavigator({ 
  Home: HomePage 
},{
  navigationOptions: {
    headerTitle: "Home",
  }
});

const AuthStack = createStackNavigator({ 
  Login: TitlePage,
  Create: CreatePage
},{ 
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
});

export default  createSwitchNavigator({
    Auth: AuthStack,
    App: AppStack,
  },
  {
    initialRouteName: 'Auth',
  },
);