import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { View, Text, H2, H3, Spinner, Card, CardItem, Left, Right, Body, Thumbnail, Button, Icon, List, ListItem } from 'native-base';
import { computeDate, transact, update, calculateBadges } from '../Service/Firebase'
import { viewYummlyMeal, viewEdamam, view } from '../Service/Reducer';

const autoBind = require('auto-bind');

class  ViewMealPlan extends Component{
    constructor(props){
        super(props)
        this.state={
            data: null,
            getDone: false,
            badges: []
        }
        autoBind(this)
    }

    async handleOpenYummly(recipe){
        await this.props.dispatch(viewYummlyMeal());
        this.props.navigation.navigate('ViewRecipe',{recipe});
    }

    async showHealthLabels(labels){
        let str = "Health Labels\n"
        await labels.forEach((item)=>{
            str = str+"• "+item+"\n";
        })
        Alert.alert("Sizzle",str);
    }

    async handleOpenEdamam(recipe){
        await this.props.dispatch(viewEdamam());
        this.props.navigation.navigate('ViewRecipe',{recipe})
    }

    async handleOpenUserRecipe(recipe){
        await this.props.dispatch(view());
        this.props.navigation.navigate('ViewRecipe',{recipe})
    }
    
    async handleStar(recipe){
        if(this.props.state.user.starred.includes(recipe.key)){ //unstar
            this.props.state.user.starred.splice(this.props.state.user.starred.indexOf(recipe.key),1);
            
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
            this.props.state.user.starred.push(recipe.key);

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

    evaluateStar(key){
        if(this.props.state.user.starred.includes(key)){
            return true
        }else{
            return false
        }
    }

    async componentWillMount(){
        await this.setState({data: this.props.navigation.state.params.meal})
        this.setState({badges: calculateBadges(this.state.data.totals,this.props.state.user.birthday,this.props.state.user.sex)})
        this.setState({getDone: true})
    }

    render(){
        if(!this.state.getDone){
            return(
            <View style={styles.viewSpin}>
                <Spinner color="blue" size="large"/>
                <Text>Loading...</Text>
            </View>
            )
        }else{
            return(
                <ScrollView>
                    <View style={styles.view}>
                        <H2 style={styles.h2}>{this.state.data.mealPlanName}</H2>
                        <Text note>{this.state.data.username}</Text>
                    </View>
                    <Text note style={styles.header}>Recipe/s</Text>
                    <ScrollView style={styles.scroll} horizontal={true}>
                        {
                            this.state.data.recipes.map((recipe, index)=>{
                                if(recipe.type === "YUMMLY"){
                                    return(
                                        <Card key={index} style={styles.card}>
                                            <CardItem style={{marginBottom: 10}}>
                                                <Left style={{width: "80%"}}>
                                                    <Thumbnail source={{uri: "https://static.yummly.co/api-logo.png"}} style={styles.thumbnail}/>
                                                    <Body>
                                                        <H3 style={styles.h2}>{recipe.recipe.recipeName.length > 15 ? recipe.recipe.recipeName.slice(0,13)+"..." : recipe.recipe.recipeName}</H3>
                                                        <Text note>{recipe.recipe.sourceDisplayName}</Text>
                                                    </Body>
                                                </Left>
                                                <Right>
                                                    <Button transparent onPress={() =>{Alert.alert("Sizzle","Rated by Yummly\n\n5 Stars - Outstanding\n4 Stars - Really Liked It\n3 Stars - Liked It/Average\n2 Stars - Not great/Just Okay\n1 Star - Didn't Like It")} }>
                                                        <Icon type='Feather' name='info' style={styles.icon}/>
                                                    </Button>
                                                </Right>
                                            </CardItem>
                                            <TouchableOpacity onPress={()=>{this.handleOpenYummly(recipe.recipe)}}>
                                                <CardItem cardBody>
                                                    <Image source={{uri: recipe.recipe.imageUrlsBySize[90]}} style={styles.userImage}/>
                                                </CardItem>
                                            </TouchableOpacity>
                                            <CardItem>
                                                <Left>
                                                    <Text>{recipe.recipe.rating}/5 stars</Text>
                                                </Left>
                                                <Right>
                                                    <Text>{recipe.recipe.totalTimeInSeconds/60} mins. cooking time.</Text>
                                                </Right>
                                            </CardItem>
                                        </Card>
                                    )
                                }else if(recipe.type === "EDAMAM"){
                                    return(
                                        <Card key={index} style={styles.card}>
                                            <CardItem style={{marginBottom: 10}}>
                                                <Left style={{width: "80%"}}>
                                                    <Thumbnail source={{uri: "https://developer.edamam.com/images/logo-dev.png"}} style={styles.thumbnail}/>
                                                    <Body>
                                                        <H3 style={styles.h2}>{recipe.recipe.label.length > 15 ? recipe.recipe.label.slice(0,13)+"..." : recipe.recipe.label}</H3>
                                                        <Text note>{recipe.recipe.source}</Text>
                                                    </Body>
                                                </Left>
                                                <Right>
                                                    <Button transparent onPress={() =>this.showHealthLabels(recipe.recipe.healthLabels)}>
                                                        <Icon type='Feather' name='info' style={styles.icon}/>
                                                    </Button>
                                                </Right>
                                            </CardItem>
                                            <TouchableOpacity onPress={()=>{this.handleOpenEdamam(recipe.recipe)}}>
                                                <CardItem cardBody>
                                                    <Image source={{uri: recipe.recipe.image}} style={styles.userImage}/>
                                                </CardItem>
                                            </TouchableOpacity>
                                            <CardItem>
                                                <Left>
                                                    <Text>{recipe.recipe.yield} Servings</Text>
                                                </Left>
                                            </CardItem>
                                        </Card>
                                    )
                                }else{
                                    return(
                                        <Card key={index} style={styles.card}>
                                            <CardItem>
                                                <Left>
                                                    <Thumbnail source={{uri: recipe.recipe.userUrl}} style={{borderWidth: 1, borderColor: "black"}}/>
                                                    <Body>
                                                        <H3 style={styles.h2}>{recipe.recipe.recipeName.length > 15 ? recipe.recipe.recipeName.slice(0,13)+"..." : recipe.recipe.recipeName}</H3>
                                                        <Text note>{recipe.recipe.username}</Text>
                                                    </Body>
                                                </Left>
                                                <Right>
                                                    <Text>{computeDate(new Date(recipe.recipe.dateAdded))}</Text>
                                                </Right>
                                            </CardItem>
                                            <TouchableOpacity onPress={()=>{this.handleOpenUserRecipe(recipe.recipe)}}>
                                                <CardItem cardBody>
                                                    <Image source={{uri: recipe.recipe.url}} style={styles.userImage}/>
                                                </CardItem>
                                            </TouchableOpacity>
                                            <CardItem>
                                                <Left>
                                                    <Button transparent onPress={() => this.handleStar(recipe.recipe)}>
                                                        <Icon type='FontAwesome' name='star' style={ this.evaluateStar(recipe.recipe.key) ? (styles.icon) : (styles.icon1) }/>
                                                    </Button>
                                                    <Text>{recipe.recipe.stars} Stars</Text>
                                                </Left>
                                            </CardItem>
                                        </Card>
                                    )
                                }
                            })
                        }
                        <Text style={{paddingBottom: 100}}/>
                    </ScrollView>
                    <List style={styles.list}>
                        <ListItem itemDivider itemHeader>
                            <Text style={styles.header}>Badges</Text>
                        </ListItem>
                        {
                            this.state.badges.map((item,index)=>{
                                return(
                                    <ListItem key={index}>
                                        <Text>{item}</Text>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    <Text style={{paddingBottom: 20, opacity: 0}}/>
                </ScrollView>
            )
        }
    }
}

const styles = StyleSheet.create({
    h2:{
        fontFamily: "geoSansLightOblique"
    },
    view:{
        marginLeft: 10, 
        marginBottom: 10
    },
    scroll:{
        borderTopWidth: 0.75,
        borderTopColor: "#e5e8e8",
        height: "auto"
    },
    header:{
        alignSelf: "center",
        marginTop: 20
    },
    thumbnail:{
        height: 15
    },
    icon:{
        color: '#ff5573'
    },
    icon1:{
        color: '#000'
    },
    userImage:{
        height: 200, 
        width: 300, 
        flex: 1
    },
    card:{
        height: 350,
    },
})

const mapStateToProps = state => {
    return state
}

const ViewMealPlanPage = connect(mapStateToProps)(ViewMealPlan);

export default ViewMealPlanPage;