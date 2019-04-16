import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert, } from 'react-native';
import { Text, Button, Tabs, Tab, Icon, Card, CardItem, Left, Right, Body, H2, Spinner, Label} from 'native-base';
import ActionButton from 'react-native-action-button'
import { connect } from 'react-redux';
import { add, edit } from '../Service/Reducer';
import { searchMulti, remove, deletePicture, searchSingle} from '../Service/Firebase';

const database = require("../Service/database.json")

const autoBind = require('auto-bind');

class Profile extends Component {
    constructor(props){
        super(props)
        this.state={
            active: false,
            renderRecipes: false,
            renderMeals: false,
            renderStarred: false,
            noErrors: true,
            recipes: [],
            meals: [],
            starred: [],
            user: {
                image: "",
                firstName: "",
                lastName: ""
            }
        }
        autoBind(this)
    }

    handleSettings(){
        this.props.navigation.navigate('Settings')
    }

    async handleRecipe(){
        await this.props.dispatch(add());
        this.props.navigation.navigate('Recipe')
    }

    handleMealPlan(){}

    handleEditRecipe(index){
        this.props.dispatch(edit());
        this.props.navigation.navigate('Recipe',{index: index, recipe: this.state.recipes[index]})
    }

    async handleDeleteRecipe(index, recipe){
        this.state.recipes.splice(index,1)
        await remove({link: "recipes/"+recipe.key})
        .then(()=>{console.log("DB REMOVE success")})
        await deletePicture({link: this.props.state.user.username+"/recipes", child: recipe.recipeName})
        .then(()=>{console.log("STORE REMOVE success")})
        this.forceUpdate()
    }

    
    componentWillUpdate(){
        if(this.props.state.mode === "POST_EDIT"){
            this.state.recipes[this.props.navigation.state.params.index] = this.props.navigation.state.params.recipe;
        }
    }

    async componentWillMount(){
        searchMulti({link: "recipes", child: "username", search: this.props.state.user.username})
        .on("value",function(snapshot){
           this.setState({recipes: snapshotToArray(snapshot), renderRecipes: true})
        }.bind(this))
        await this.setState({user: this.props.state.user})
        // searchSingle({link: "meals", child: "username", search: this.props.state.user.username})
        // .once("value",function(snapshot){
        //  this.setState({meals: snapshotToArray(snapshot), renderMeals: true})
        // }.bind(this))
        // await searchMulti({link: "users", child: "username", search: this.props.state.user.username})
        // .on("value",(snapshot) =>this.setState({recipes: snapshot})) //get user on Login
        
    }

    render() {
        return(
        <View>
            <View style={styles.heading}>
                <Image source={{uri: this.state.user.image}} style={styles.userImage}/>
                <Text style={styles.name}>{this.state.user.firstName} {this.state.user.lastName}</Text>
                <Button bordered rounded dark onPress={()=>this.handleSettings()} style={styles.settings}>
                    <Icon type='MaterialCommunityIcons' name='settings'/>
                </Button>
            </View>
            <View style={styles.scroll}>
                <Tabs>
                    <Tab heading="My Recipes" tabStyle={styles.tabs} textStyle={styles.tabsText} activeTabStyle={styles.activeTabs} activeTextStyle={styles.activeTabsText}>
                        <ScrollView snapToEnd={false}>
                            {
                                !this.state.renderRecipes ?
                                (this.state.noErrors ? <Spinner color="blue" style={{paddingTop: 50}}/> : null) :
                                this.state.recipes.map((recipe,index)=>{
                                    return(<Card key={recipe.key} style={styles.card}>
                                        <CardItem>
                                            <Left>
                                                <Body>
                                                    <H2>{recipe.recipeName}</H2>
                                                </Body>
                                            </Left>
                                        </CardItem>
                                        <CardItem cardBody>
                                            <Image source={{uri: recipe.url}} style={styles.image}/>
                                        </CardItem>
                                        <CardItem>
                                            <Left>
                                                <Text>{recipe.stars} Stars</Text>
                                            </Left>
                                            <Body/><Body/>
                                            <Right style={{flexDirection: "row", alignContents: "flex-end"}}>
                                                <Button transparent onPress={() => this.handleEditRecipe(index)} style={styles.buttonRight}>
                                                    <Icon active type="Feather" name="edit" />
                                                </Button>
                                                <Button transparent danger onPress={() => Alert.alert("Sizzle","Delete "+recipe.recipeName+"?",[{ text: 'Cancel',style: 'cancel',},{text: 'OK', onPress: () => this.handleDeleteRecipe(index,recipe)},],{cancelable: true})} style={styles.buttonRight}>
                                                    <Icon active name="trash" />
                                                </Button>
                                            </Right>
                                        </CardItem>
                                    </Card>)
                                })
                            }
                        <Text style={{paddingBottom: 60}}/>
                        </ScrollView>
                    </Tab>
                    <Tab heading="My Meals" tabStyle={styles.tabs} textStyle={styles.tabsText} activeTabStyle={styles.activeTabs} activeTextStyle={styles.activeTabsText}>
                        <ScrollView>
                        </ScrollView>
                    </Tab>
                    <Tab heading="Starred" tabStyle={styles.tabs} textStyle={styles.tabsText} activeTabStyle={styles.activeTabs} activeTextStyle={styles.activeTabsText}>
                        <ScrollView>
                            
                        </ScrollView>
                    </Tab>
                </Tabs>
            </View>
             <ActionButton buttonColor="rgba(231,76,60,1)">
                <ActionButton.Item buttonColor='#9b59b6' title="New Recipe" onPress={() => this.handleRecipe()}>
                    <Icon type="MaterialCommunityIcons" name="silverware-spoon" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' title="New Meal Plan" onPress={() => this.handleMealPlan()}>
                    <Icon type="SimpleLineIcons" name="notebook" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>
        </View>
        );
    }
}

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

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
    heading:{
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 20,
        alignItems: "center",
        justifyContent: 'center'
    },
    settings:{
        marginLeft: 50,
        alignItems: 'center'
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
    },
    card:{
        maxHeight: 350,
    },
    buttonRight:{
        alignSelf: "flex-end",
        marginLeft: 10
    },
    actionButtonIcon: {
        fontSize: 24,
        height: 22,
        color: 'white',
    },
    userImage:{
        borderWidth: 1,
        height: 70, 
        width: 70,
        borderRadius: 35,
        backgroundColor: "white",
        borderColor: "black"
    },
    userDetails:{
        flexDirection: "column"
    }
})

const mapStateToProps = state => {
    return state
}

const ProfilePage = connect(mapStateToProps)(Profile);

export default ProfilePage;