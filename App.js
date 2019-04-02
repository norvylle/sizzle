import { TitlePage, CreatePage, HomePage, DownloadPage, ProfilePage, SearchPage, SettingsPage, NewRecipePage } from './components/Export';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator, createAppContainer} from 'react-navigation';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Icon, } from 'native-base';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './components/Service/Reducer';


const styles = StyleSheet.create({
    icon: {
      color: '#fff',
      fontSize: 20
    },
})


const HomeStack = createStackNavigator(
  {
    Home:{
      screen: HomePage,
      navigationOptions: {
        headerTitle: "Home",
        headerStyle:{
          backgroundColor: '#ff5733',
        },
        headerTitleStyle:{
          color: '#fff',
        }
      }
    },  
  },
  {
    initialRouteName: 'Home',
    headerLayoutPreset: 'center', 
  }
);

const SearchStack = createStackNavigator(
  { 
    Search:{
      screen: SearchPage,
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
  },
  {
    initialRouteName: 'Search',
    headerLayoutPreset: 'center'
  }
);

const DownloadStack = createStackNavigator(
  { 
    Download:{
      screen: DownloadPage,
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
  },
  {
    initialRouteName: 'Download',
    headerLayoutPreset: 'center'
  }
);

const ProfileStack = createStackNavigator(
  { 
    Profile:{
      screen: ProfilePage,
      navigationOptions: {
        headerStyle:{
          backgroundColor: '#ff5733',
        }
      }
    },
    Settings:{
      screen: SettingsPage,
      navigationOptions: {
        headerStyle:{
          backgroundColor: '#ff5733',
        }
      }
    },
    Recipe:{
      screen: NewRecipePage,
      navigationOptions:{
        headerTitle: "Add Recipe",
        headerStyle:{
          backgroundColor: '#ff5733',
        },
        headerTitleStyle:{
          color: "#fff",
        }
      }
    }
  },
  {
    initialRouteName: 'Profile',
    headerLayoutPreset: 'center'
  }
);

const AppStack = createBottomTabNavigator(
  {
    Home:{
      screen: HomeStack,
      navigationOptions:{
        tabBarIcon: (<Icon type='Octicons' name='home' style={styles.icon}/>)
      }
    },
    Search:{
      screen: SearchStack,
      navigationOptions:{
        tabBarIcon: (<Icon type='Feather' name='search' style={styles.icon}/>)
      }
    },
    Downloads:{
      screen: DownloadStack,
      navigationOptions:{
        tabBarIcon: (<Icon type='Feather' name='download' style={styles.icon}/>)
      }
    },
    Profile:{
      screen: ProfileStack,
      navigationOptions:{
        tabBarIcon: (<Icon type='MaterialIcons' name='person' style={styles.icon}/>)
      }
    }
  },
  {
    initialRouteName: 'Profile',
    tabBarOptions:{
      activeBackgroundColor: '#da634a',
      labelStyle:{
        color: '#fff'
      },
      style:{
        backgroundColor: '#ff5733',
      },
      headerTitleStyle:{
        color: '#fff',
      },
    }
  }
);

const AuthStack = createStackNavigator(
  { 
    Login:{
      screen: TitlePage
    },
    Create:{
      screen: CreatePage
    }
  },
  { 
    headerMode: 'none',
    initialRouteName: 'Login',
    navigationOptions: {
      headerVisible: false,      
    }
  }
);

const Switch = createSwitchNavigator(
  {
    Auth: AuthStack,
    App: AppStack
  },
  {
    initialRouteName: 'Auth',
  },
);

const AppContainer = createAppContainer(Switch);

const store = createStore(reducer)

export default class App extends Component{
  render(){
    return(
      <Provider store={store}>
        <AppContainer/>
      </Provider>
    )
  }
}