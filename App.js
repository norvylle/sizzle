import { TitlePage, CreatePage, HomePage, DownloadPage, ProfilePage, SearchPage, SettingsPage, NewRecipePage, AvatarPage, ProfilePicturePage, PasswordPage, EmailPage, EditDetailsPage, NewMealPlanPage, ViewMealPlanPage, ViewRecipePage, CookPage, HelpPage } from './components/Export';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator, createAppContainer} from 'react-navigation';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'native-base';
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
        ViewRecipe:{
            screen: ViewRecipePage,
            navigationOptions: {
                headerStyle:{
                    backgroundColor: '#ff5733',
                }
            }
        },
        Cook:{
            screen: CookPage, 
            navigationOptions:{ 
                header:null,
            }
        }
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
        },
        ViewRecipe:{
            screen: ViewRecipePage,
            navigationOptions: {
                headerStyle:{
                    backgroundColor: '#ff5733',
                }
            }
        },
        Cook:{
            screen: CookPage,
            navigationOptions:{         
                header:null,
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
        },
        ViewRecipe:{
            screen: ViewRecipePage,
            navigationOptions: {
                headerStyle:{
                    backgroundColor: '#ff5733',
                }
            }
        },
        Cook:{
            screen: CookPage, 
            navigationOptions:{         
                header:null,     
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
                headerTitle: "Settings",
                headerStyle:{
                    backgroundColor: '#ff5733',
                },
                headerTitleStyle:{
                   color: "#fff",
                }
            }
        },
        Help:{
            screen: HelpPage,
            navigationOptions: {
                headerTitle: "Help",
                headerStyle:{
                    backgroundColor: '#ff5733',
                },
                headerTitleStyle:{
                   color: "#fff",
                }
            }
        },
        Recipe:{
            screen: NewRecipePage,
            navigationOptions:{
                headerTitle: "Recipe",
                headerStyle:{
                    backgroundColor: '#ff5733',
                },
                headerTitleStyle:{
                    color: "#fff",
                }
            }
        },
        EditDetails:{
            screen: EditDetailsPage,
            navigationOptions: {
                headerTitle: "Edit Account",
                headerStyle:{
                    backgroundColor: '#ff5733',
                },
                headerTitleStyle:{
                    color: "#fff",
                }
            }
        },
        Password:{
            screen: PasswordPage,
            navigationOptions: {
                headerTitle: "Change Password",
                headerStyle:{
                    backgroundColor: '#ff5733',
                },
                headerTitleStyle:{
                    color: "#fff",
                }
            }
        },
        Email:{
            screen: EmailPage,
            navigationOptions: {
                headerTitle: "Change Email",
                headerStyle:{
                  backgroundColor: '#ff5733',
                },
                headerTitleStyle:{
                    color: "#fff",
                }
            }
        },
        ProfilePicture:{
            screen: ProfilePicturePage,
            navigationOptions: {
                headerTitle: "Change Profile Picture",
                headerStyle:{
                    backgroundColor: '#ff5733',
                },
                headerTitleStyle:{
                    color: "#fff",
                }
            }
        },
        ViewRecipe:{
            screen: ViewRecipePage,
            navigationOptions: {
                headerStyle:{
                    backgroundColor: '#ff5733',
                }
            }
        },
        Cook:{
            screen: CookPage, 
            navigationOptions:{         
                header:null,
            }
        },
        ViewMealPlan:{
            screen: ViewMealPlanPage,
            navigationOptions: {
                headerStyle:{
                    backgroundColor: '#ff5733',
                }
            }
        },
        NewMealPlan:{
            screen: NewMealPlanPage,
            navigationOptions: {
                headerTitle: "Meal Plan",
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

const GuestStack = createBottomTabNavigator(
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
        }
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
            },
            headerTitleStyle:{
                color: '#fff',
            },
        }
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
        initialRouteName: 'Home',
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
        },
        Avatar:{
            screen: AvatarPage
        },
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
        App: AppStack,
        Guest: GuestStack,
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