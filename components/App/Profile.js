import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Thumbnail, Tabs, Tab, Picker, Icon } from 'native-base';
import { loadAssets } from '../Service/Assets';
import { users } from '../Service/Database';

const autoBind = require('auto-bind');

export default class ProfilePage extends Component {
    constructor(props){
        super(props)
        autoBind(this)
    }

    handlePress(){
        this.props.navigation.navigate('Settings')
    }

    async componentWillMount(){
        await loadAssets();
    }

    render() {
        return(
        <View>
            <View style={styles.header}>
                <Thumbnail large source={{uri: users.icon}}/>
                <View style={styles.details}>
                    <Text style={styles.name}>{users.firstName} {users.lastName}</Text>
                    <Text style={{paddingTop:10}}/>
                    <Text style={styles.follow}>{users.following} Following {users.followers} Followers</Text>
                </View>
                <Button rounded onPress={this.handlePress}>
                    <Icon type='MaterialCommunityIcons' name='settings'/>
                </Button>
            </View>
            <View style={styles.scroll}>
                <Tabs>
                    <Tab heading="My Recipes" tabStyle={styles.tabs} textStyle={styles.tabsText} activeTabStyle={styles.activeTabs} activeTextStyle={styles.activeTabsText}>
                        <ScrollView>
                        </ScrollView>
                    </Tab>
                    <Tab heading="Starred" tabStyle={styles.tabs} textStyle={styles.tabsText} activeTabStyle={styles.activeTabs} activeTextStyle={styles.activeTabsText}>
                        <ScrollView>
                        </ScrollView>
                    </Tab>
                    <Tab heading="Cooked" tabStyle={styles.tabs} textStyle={styles.tabsText} activeTabStyle={styles.activeTabs} activeTextStyle={styles.activeTabsText}>
                        <ScrollView>
                        </ScrollView>
                    </Tab>
                </Tabs>
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    activeTabs:{
        backgroundColor:'#fff'
    },
    activeTabsText:{
        color: '#ff5733'
    },
    button:{
        alignSelf: 'stretch',
    },
    detailsText:{
        fontFamily: 'Roboto'
    },
    follow:{
        flexDirection:'column',
        marginLeft: 20,
        fontSize: 16
    },
    header:{
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 20
    },
    name:{
        flexDirection:'column',
        marginLeft: 20,
        fontSize: 20
    },
    scroll:{
        height: '83%',
        marginTop: 10
    },
    tabs:{
        backgroundColor: '#ff5733'
    },
    tabsText:{
        color: '#fff'
    }
})