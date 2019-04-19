import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, Tabs, Tab, Icon, Card, CardItem, Left, Right, Body, H3, Spinner, Thumbnail} from 'native-base';
import ActionButton from 'react-native-action-button'
import { connect } from 'react-redux';
import { add, edit, view } from '../Service/Reducer';
import { searchMulti, remove, deletePicture, snapshotToArray, computeDate, update, transact } from '../Service/Firebase';

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
        this.props.navigation.navigate('Recipe');
    }

    handleMealPlan(){
        this.props.navigation.navigate('NewMealPlan');
    }

    handleEditRecipe(index){
        this.props.dispatch(edit());
        this.props.navigation.navigate('Recipe',{recipe: this.state.recipes[index]})
    }

    async handleDeleteRecipe(index, recipe){
        await remove({link: "recipes/"+recipe.key})
        .then(()=>{console.log("DB REMOVE success")})
        await deletePicture(recipe.url)
        .then(()=>{console.log("STORE REMOVE success")})
        this.state.recipes.splice(index,1)
        this.forceUpdate()
    }

    async handleOpenRecipe(recipe){
        await this.props.dispatch(view());
        this.props.navigation.navigate('ViewRecipe',{recipe});
    }

    async handleStar(recipe){
        if(this.props.state.user.starred.includes(recipe.recipeName_username)){ //unstar
            this.props.state.user.starred.splice(this.props.state.user.starred.indexOf(recipe.recipeName_username),1);
            
            await update({link: "users/"+this.props.state.user.key, data: { starred: this.props.state.user.starred }})
            .then(async ()=>{
                await transact("recipes/"+recipe.key+"/stars")
                .transaction((stars)=>{
                    return stars-1;
                },(error, committed, snapshot)=>{
                    if(error){
                        Alert.alert("Sizzle","An error occurred. Try again later.");
                    }else if(!committed){
                        Alert.alert("Sizzle","An error occurred. Try again later.");
                    }else{
                        console.log(snapshot.val());
                    }
                }).catch((error)=>{
                    Alert.alert("Sizzle","An error occurred. Try again later.");
                })
            }).catch((error)=>{
                Alert.alert("Sizzle","An error occurred. Try again later.");
            })

        }else{ //star
            this.props.state.user.starred.push(recipe.recipeName_username);

            await update({link: "users/"+this.props.state.user.key, data: { starred: this.props.state.user.starred }})
            .then(async ()=>{
                await transact("recipes/"+recipe.key+"/stars")
                .transaction(function(stars){
                    return stars+1;
                },function(error, committed, snapshot){
                    if(error){
                        Alert.alert("Sizzle","An error occurred. Try again later.");
                    }else if(!committed){
                        Alert.alert("Sizzle","An error occurred. Try again later.");
                    }else{
                        console.log(snapshot.val());
                    }
                }).catch((error)=>{
                    Alert.alert("Sizzle","An error occurred. Try again later.");
                })
            }).catch((error)=>{
                Alert.alert("Sizzle","An error occurred. Try again later.");
            })

        }
        this.forceUpdate()
    }

    evaluateStar(recipeName_username){
        if(this.props.state.user.starred.includes(recipeName_username)){
            return true
        }else{
            return false
        }
    }

    async componentWillMount(){
        searchMulti({link: "recipes", child: "username", search: this.props.state.user.username})
        .on("value",function(snapshot){
           this.setState({recipes: snapshotToArray(snapshot), renderRecipes: true})
        }.bind(this))
        // searchSingle({link: "meals", child: "username", search: this.props.state.user.username})
        // .once("value",function(snapshot){
        //  this.setState({meals: snapshotToArray(snapshot), renderMeals: true})
        // }.bind(this)) //get meals
        
    }

    render() {
        return(
        <View>
            <View style={styles.heading}>
                <View style={{width: "25%"}}>
                    <Image source={{uri: this.props.state.user.image}} style={styles.userImage}/>
                </View>
                <View style={styles.userDetails}>
                    <Text style={styles.name}>{(this.props.state.user.firstName+" "+this.props.state.user.lastName).length < 21 ? this.props.state.user.firstName+" "+this.props.state.user.lastName : (this.props.state.user.firstName+" "+this.props.state.user.lastName).substr(0,17)+"..." }</Text>
                    <Text style={styles.bio}>{this.props.state.user.username}</Text>
                </View>
                <View style={{width: "20%"}}>
                    <Button bordered rounded large dark onPress={()=>this.handleSettings()} style={styles.settings}>
                        <Icon type='MaterialCommunityIcons' name='settings'/>
                    </Button>
                </View>
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
                                                <Thumbnail source={{uri: recipe.userUrl}} style={{borderWidth: 1, borderColor: "black"}}/>
                                                <Body>
                                                    <H3 style={styles.h3}>{recipe.recipeName}</H3>
                                                    <Text note>{recipe.username}</Text>
                                                </Body>
                                            </Left>
                                            <Right>
                                                <Text>{computeDate(new Date(recipe.dateAdded))}</Text>
                                            </Right>
                                        </CardItem>
                                        <TouchableOpacity onPress={()=>{this.handleOpenRecipe(recipe)}}>
                                            <CardItem cardBody>
                                                <Image source={{uri: recipe.url}} style={styles.image}/>
                                            </CardItem>
                                        </TouchableOpacity>
                                        <CardItem>
                                            <Left>
                                                <Button transparent onPress={() => this.handleStar(recipe)}>
                                                    <Icon type='FontAwesome' name='star' style={ this.evaluateStar(recipe.recipeName_username) ? (styles.icon) : (styles.icon1) }/>
                                                </Button>
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
                            {
                                this.props.state.user.starred.filter((item)=>item !== "dummy").map((item,index)=>{
                                    return(
                                        <Text key={index}>{item}</Text>
                                    )
                                })
                            }
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
        alignItems: "center",
        justifyContent: 'center',
    },
    settings:{
        alignItems: 'center',
        justifyContent: 'center'
    },  
    image:{
        height: 200, 
        width: 300, 
        flex: 1
    },
    name:{
        fontSize: 20
    },
    bio:{
        fontSize: 12 
    },
    scroll:{
        height: '85%',
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
        borderColor: "black",
        alignSelf: "center"
    },
    userDetails:{
        flexDirection: "column",
        width: "55%"
    },
    icon:{
        color: '#ff5573'
    },
    icon1:{
        color: '#000'
    },
    h3:{
        fontFamily: "geoSansLightOblique"
    }
})

const mapStateToProps = state => {
    return state
}

const ProfilePage = connect(mapStateToProps)(Profile);

export default ProfilePage;