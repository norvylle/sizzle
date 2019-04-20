import React, { Component } from 'react';
import { StyleSheet, Image, Linking, ScrollView, View, Alert } from 'react-native';
import { Text, Spinner, H2, List, ListItem, Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { yummly } from '../Service/secret'
import { calculateBadges } from '../Service/Firebase'

const autoBind = require('auto-bind');
const axios = require('axios');

class ViewRecipe extends Component{
    constructor(props){
        super(props)
        this.state={
            getDone: false,
            data: null,
            badges: []
        }
        autoBind(this)
    }

    async componentWillMount(){
        if(this.props.state.view === "YUMMLY"){
            await axios.get(yummly.get+this.props.navigation.state.params.id+"?",
                {
                    params:{
                        _app_id: yummly.id,
                        _app_key: yummly.api_key,
                    }
                }
            ).then(async function(response){
                try {
                    if(response.data.errors.error[0].status === 400){
                        Alert.alert("Sizzle","An error occurred.");
                        this.props.navigation.pop();
                        return
                    }
                }catch (error) {
                    await this.setState({data: response.data})
                    this.setState({getDone: true})
                    console.log("RECIPE: GET success.")
                }
            }.bind(this))
            this.setState({badges: calculateBadges(this.state.data.nutritionEstimates,this.props.state.user.birthday,this.props.state.user.sex,"YUMMLY")})
        }else if(this.props.state.view === null){//USER
            await this.setState({data: this.props.navigation.state.params.recipe})
            await this.setState({badges: calculateBadges(this.state.data.values,this.props.state.user.birthday,this.props.state.user.sex,"USER")})
            this.setState({getDone: true})
        }else{//EDAMAM
            await this.setState({data: this.props.navigation.state.params.recipe})
            this.setState({getDone: true})
        }
    }

    handleCook(recipe){
        this.props.navigation.navigate('Cook',{recipe});
    }

    render(){
        if(!this.state.getDone){
            return(
            <View style={styles.viewSpin}>
                <Spinner color="blue" size="large"/>
                <Text>Loading...</Text>
            </View>
            )
        }
        else if(this.props.state.view === "YUMMLY"){
            return(
            <ScrollView >
                <View style={{marginLeft: 10}}>
                    <H2 style={styles.h2}>{this.state.data.name}</H2>
                    <Text note>{this.state.data.source.sourceDisplayName}</Text>
                </View>
                <Image source={{uri: this.state.data.images[0].hostedLargeUrl}} style={styles.image}/>
                <List style={styles.list}>
                    <ListItem itemDivider itemHeader>
                        <Text style={styles.header}>Ingredients</Text>
                    </ListItem>
                    {
                        this.state.data.ingredientLines.map((item,index)=>{
                            return(
                                <ListItem key={index}>
                                    <Text>{item}</Text>
                                </ListItem>
                            )
                        })
                    }
                </List>
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
                <Button full info iconRight onPress={()=>{Linking.openURL(this.state.data.source.sourceRecipeUrl)}} style={styles.button}>
                    <Text>Open Recipe</Text>
                    <Icon active type="Feather" name="link"/>
                </Button>
            </ScrollView>
            )
        }else if(this.props.state.view === "EDAMAM"){
            return(
                <ScrollView >
                    <View style={{marginLeft: 10}}>
                        <H2 style={styles.h2}>{this.state.data.label}</H2>
                        <Text note>{this.state.data.source}</Text>
                    </View>
                    <Image source={{uri: this.state.data.image}} style={styles.image}/>
                    <List style={styles.list}>
                        <ListItem itemDivider itemHeader>
                            <Text style={styles.header}>Ingredients</Text>
                        </ListItem>
                        {
                            this.state.data.ingredientLines.map((item,index)=>{
                                return(
                                    <ListItem key={index}>
                                        <Text>{item}</Text>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    <List style={styles.list}>
                        <ListItem itemDivider itemHeader>
                            <Text style={styles.header}>Badges</Text>
                        </ListItem>
                        {
                            this.state.data.healthLabels.map((item,index)=>{
                                return(
                                    <ListItem key={index}>
                                        <Text>{item}</Text>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    <Button full info iconRight onPress={()=>{Linking.openURL(this.state.data.shareAs)}} style={styles.button}>
                        <Text>Open Recipe</Text>
                        <Icon active type="Feather" name="link"/>
                    </Button>
                </ScrollView>
            )
        }else{
            return(
                <ScrollView>
                    <View style={{marginLeft: 10}}>
                        <H2 style={styles.h2}>{this.state.data.recipeName}</H2>
                        <Text note>{this.state.data.username}</Text>
                    </View>
                    <Image source={{uri: this.state.data.url}} style={styles.image}/>
                    <List style={styles.list}>
                        <ListItem itemDivider itemHeader>
                            <Text style={styles.header}>Ingredients</Text>
                        </ListItem>
                        {
                            this.state.data.ingredients.map((item,index)=>{
                                return(
                                    <ListItem key={index}>
                                        <Text>{item.qty} {item.unit} of {item.ingredient.name}</Text>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
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
                    <Button full danger iconRight onPress={()=>{this.handleCook(this.state.data)}} style={styles.button}>
                        <Text>Cook Recipe</Text>
                        <Icon active type="MaterialCommunityIcons" name="silverware-spoon"/>
                    </Button>
                </ScrollView>
            )
        }
    }
}

const styles = StyleSheet.create({
    viewSpin:{
        alignContent: "center",
        justifyContent: "center"
    },
    image:{
        width: 360,
        height: 240,        
        borderWidth: 2,
        alignSelf: "center"        
    },
    list:{
        marginVertical: 10
    },
    view:{
        height: "100%"
    },
    h2:{
        fontFamily: "geoSansLightOblique"
    },
    header:{
        fontFamily: "Roboto",
        fontSize: 18
    },
    button:{
        marginVertical: 10
    }
})

const mapStateToProps = state => {
    return state
}

const ViewRecipePage = connect(mapStateToProps)(ViewRecipe);

export default ViewRecipePage;