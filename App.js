import { TitlePage, CreatePage, HomePage, DownloadPage, ProfilePage, SearchPage, SettingsPage } from './components/Export';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Icon, Root,Text } from 'native-base';
import { Font, AppLoading } from 'expo';
import React, { Component } from 'react';


const styles = loadStyles()


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
    Profile: ProfilePage,
    Settings: SettingsPage
  },
  {
    initialRouteName: 'Profile',
    headerLayoutPreset: 'center',
    navigationOptions: {
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
    Downloads: DownloadStack,
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
        }else if( routeName === 'Downloads'){
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

const MainSwitch = createSwitchNavigator(
  {
    Auth: AuthStack,
    App: AppStack
  },
  {
    initialRouteName: 'Auth',
  },
);


function loadStyles() {
  return StyleSheet.create({
    icon: {
      color: '#fff',
      fontSize: 20
    },
  });
}

export default class App extends Component{
  constructor(props){
    super(props)
    this.state={
      loading: true
    }
  }

  async componentWillMount(){
    await Font.loadAsync({
      'fantastic': require('./assets/fonts/fantastic.ttf'),
      'geoSansLight': require('./assets/fonts/geoSansLight.ttf'),
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
      'Feather': require("@expo/vector-icons/fonts/Feather.ttf"),
      'FontAwesome': require("@expo/vector-icons/fonts/FontAwesome.ttf"),
      'MaterialIcons': require("@expo/vector-icons/fonts/MaterialIcons.ttf"),
      'MaterialCommunityIcons': require("@expo/vector-icons/fonts/MaterialCommunityIcons.ttf"),
      'Octicons': require('@expo/vector-icons/fonts/Octicons.ttf'),
    });
    this.setState({loading: false})
  }

  render(){
    if(this.state.loading){
      return(
        <Root>
          <AppLoading/>
        </Root>
      )
    }
    return(
      <Root>
        <MainSwitch/>
      </Root>
    )
  }

}