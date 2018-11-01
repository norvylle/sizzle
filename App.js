import { TitlePage, CreatePage, HomePage } from './components/Export';
import { createStackNavigator, createSwitchNavigator} from 'react-navigation';

const AppStack = createStackNavigator({ 
  Home: HomePage 
},{
  initialRouteName: 'Home',
  navigationOptions: {
    headerTitle: "Home",
  }
});

const AuthStack = createStackNavigator({ 
  Login: TitlePage,
  Create: CreatePage
},{ 
  headerMode: 'none',
  initialRouteName: 'Login',
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