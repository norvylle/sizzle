import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Thumbnail, Tabs, Tab, Icon, Accordion } from 'native-base';
import { loadAssets } from '../Service/Assets';
import { users,recipes } from '../Service/Database';

const autoBind = require('auto-bind');

export default class ProfilePage extends Component {
    constructor(props){
        super(props)
        autoBind(this)
    }

    handlePress(){
        this.props.navigation.navigate('Settings')
    }

    loadHeaders(index,expanded){
        return(
            <View style={styles.header}>
            <Text style={{fontWeight: "600"}}>{recipes[index].title}</Text>
            {expanded ? <Icon style={{ fontSize: 18 }} name="remove-circle" />
            : <Icon style={{ fontSize: 18 }} name="add-circle" />}
            </View>
        );
    }

    loadContents(index){
        return(
            <Text style={styles.content}>
                Creator: {users[recipes[index].userId].firstName} {users[recipes[index].userId].lastName+"\n"}
                Stars: {recipes[index].stars+"\n"}
                Calories: {recipes[index].calories}
            </Text>
        );
    }

    async componentWillMount(){
        await loadAssets();
    }

    render() {
        return(
        <View>
            <View style={styles.heading}>
                <Thumbnail large source={{uri: users[0].icon}}/>
                <View style={styles.details}>
                    <Text style={styles.name}>{users[0].firstName} {users[0].lastName}</Text>
                    <Text style={{paddingTop:10}}/>
                    <Text style={styles.follow}>{users[0].following} Following {users[0].followers} Followers</Text>
                </View>
                <Button bordered rounded dark onPress={this.handlePress}>
                    <Icon type='MaterialCommunityIcons' name='settings'/>
                </Button>
            </View>
            <View style={styles.scroll}>
                <Tabs>
                    <Tab heading="My Recipes" tabStyle={styles.tabs} textStyle={styles.tabsText} activeTabStyle={styles.activeTabs} activeTextStyle={styles.activeTabsText}>
                        <ScrollView>
                            <Accordion dataArray={users[0].recipes} 
                            renderHeader={this.loadHeaders} renderContent={this.loadContents}/>
                            <Button bordered full>
                                <Text>Add</Text>
                            </Button>
                        </ScrollView>
                    </Tab>
                    <Tab heading="My Meals" tabStyle={styles.tabs} textStyle={styles.tabsText} activeTabStyle={styles.activeTabs} activeTextStyle={styles.activeTabsText}>
                        <ScrollView>
                            <Text>Coming Soon!</Text>
                            <Button bordered full>
                                <Text>Add</Text>
                            </Button>
                        </ScrollView>
                    </Tab>
                    <Tab heading="Starred" tabStyle={styles.tabs} textStyle={styles.tabsText} activeTabStyle={styles.activeTabs} activeTextStyle={styles.activeTabsText}>
                        <ScrollView>
                            <Accordion dataArray={users[0].starred} 
                            renderHeader={this.loadHeaders} renderContent={this.loadContents}/>
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
    content:{
        backgroundColor: "#e3f1f1", 
        padding: 10,
    },
    detailsText:{
        fontFamily: 'Roboto'
    },
    follow:{
        flexDirection:'column',
        marginLeft: 20,
        fontSize: 16
    },
    heading:{
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 20
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#A9DAD6',
        alignItems: 'center'
    },
    image:{
        height: 200, 
        width: 300, 
        flex: 1
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