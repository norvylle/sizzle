import { TitlePage, CreatePage, HomePage, DownloadPage, ProfilePage, SearchPage } from './components/Export';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import React from 'react';

const styles = newFunction()

const HomeStack = createStackNavigator(
  { 
    Home: HomePage 
  },
  {
    initialRouteName: 'Home',
    headerLayoutPreset: 'center',
    navigationOptions: {
      headerTitle: "Home",
      headerStyle:{
        backgroundColor: '#ff5733',
      },
      headerTitleStyle:{
        color: '#fff',
      }
    }
  }
);

const SearchStack = createStackNavigator(
  { 
    Search: SearchPage
  },
  {
    initialRouteName: 'Search',
    headerLayoutPreset: 'center',
    navigationOptions: {
      headerTitle: "Search",
      headerStyle:{
        backgroundColor: '#ff5733',
      },
      headerTitleStyle:{
        color: '#fff',
      }
    }
  }
);

const DownloadStack = createStackNavigator(
  { 
    Download: DownloadPage
  },
  {
    initialRouteName: 'Download',
    headerLayoutPreset: 'center',
    navigationOptions: {
      headerTitle: "Downloads",
      headerStyle:{
        backgroundColor: '#ff5733',
      },
      headerTitleStyle:{
        color: '#fff',
      }
    }
  }
);

const ProfileStack = createStackNavigator(
  { 
    Profile: ProfilePage
  },
  {
    initialRouteName: 'Profile',
    headerLayoutPreset: 'center',
    navigationOptions: {
      // headerTitle: "Settings",
      headerStyle:{
        backgroundColor: '#ff5733',
      },
      headerTitleStyle:{
        color: '#fff',
      }
    }
  }
);

const AppStack = createBottomTabNavigator(
  {
    Home: HomeStack,
    Search: SearchStack,
    Download: DownloadStack,
    Profile: ProfileStack,
  },
  {
    initialRouteName: 'Home',
    tabBarOptions:{
      activeBackgroundColor: '#da634a',
      labelStyle:{
        color: '#fff'
      },
      style:{
        backgroundColor: '#ff5733',
      }
    },
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        if( routeName === 'Home'){
          return (<Icon type='Octicons' name='home' style={styles.icon}/>)
        }else if( routeName === 'Profile'){
          return (<Icon type='MaterialIcons' name='person' style={styles.icon}/>)
        }else if( routeName === 'Download'){
          return (<Icon type='Feather' name='download' style={styles.icon}/>)
        }else if( routeName === 'Search'){
          return (<Icon type='Feather' name='search' style={styles.icon}/>)
        }
      }
    })
  }
);


const AuthStack = createStackNavigator(
  { 
    Login: TitlePage,
    Create: CreatePage
  },
  { 
    headerMode: 'none',
    initialRouteName: 'Login',
    navigationOptions: {
      headerVisible: false,
    }
  }
);

export default  createSwitchNavigator(
  {
    Auth: AuthStack,
    App: AppStack,
  },
  {
    initialRouteName: 'Auth',
  },
);

function newFunction() {
  return StyleSheet.create({
    icon: {
      color: '#fff',
      fontSize: 20
    },
  });
}
