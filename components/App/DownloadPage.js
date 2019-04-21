import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Card, CardItem, Left, Right, Body, Text, H3, Thumbnail, Icon, Button, Toast, Root } from 'native-base';
import { connect } from 'react-redux';
import { retrieveData, storeData, computeDate, update, transact } from '../Service/Firebase';
import { removeKey, view } from '../Service/Reducer';

const autoBind = require('auto-bind');

class Download extends Component {
    constructor(props){
        super(props)
        this.state={
            data:[],
            render: false
        }
        autoBind(this)
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

    async handleRemove(recipe){
        let data = await retrieveData("downloads");
        data = JSON.parse(data);
        
        Toast.show({
            text: "Removed Recipe",
            duration: 2000,
            buttonText: "CLOSE",
            buttonTextStyle: { color: "red" }
        })

        data = data.filter((item)=> item.key !== recipe.key)
        await this.props.dispatch(removeKey(recipe.key));
        await storeData("downloads",JSON.stringify(data));
        
        data = await retrieveData("downloads");
        this.setState({data: JSON.parse(data)});
        
        this.forceUpdate()
    }

    async handleOpenRecipe(recipe){
        await this.props.dispatch(view());
        this.props.navigation.navigate('ViewRecipe',{recipe});
    }
    
    async componentWillMount(){
        this.setState({render: false})
        let data = await retrieveData("downloads");
        this.setState({data: JSON.parse(data)})
        this.setState({render: true})
    }

    render() {
        return(
            <Root>
                <ScrollView refreshControl={<RefreshControl refreshing={!this.state.render} onRefresh={()=>{this.componentWillMount()}} colors={["darkorchid"]}/>}>
                    {
                    this.state.data.map((recipe,index)=>{
                        return(
                            <Card key={recipe.key} style={styles.card}>
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
                                        <Button transparent onPress={() => this.handleStar(recipe)} disabled={this.state.guest}>
                                            <Icon type='FontAwesome' name='star' style={this.evaluateStar(recipe.key) ? (styles.icon) : (styles.icon1) }/>
                                        </Button>
                                        <Text>{recipe.stars} Stars</Text>
                                    </Left>
                                    <Right>
                                        <Button transparent onPress={() => this.handleRemove(recipe)} disabled={this.state.guest}>
                                            <Icon type='Feather' name='download' style={this.props.state.downloadedKeys.includes(recipe.key) ? (styles.icon) : (styles.icon1) }/>
                                        </Button>
                                    </Right>
                                </CardItem>
                            </Card>
                        )
                    }) 
                    }
                </ScrollView>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    card:{
        maxHeight: 350,
    },
    text:{
        fontFamily: 'geoSansLight',
        fontSize: 24,
        marginLeft: 10
    },  
    icon:{
        color: '#ff5573'
    },
    icon1:{
        color: '#000'
    },
    image:{
        height: 200, 
        width: 300, 
        flex: 1
    },
    slide:{
        flexDirection: 'column',
    },
    h3:{
        fontFamily: "geoSansLightOblique"
    }
})

const mapStateToProps = state => {
    return state
}

const DownloadPage = connect(mapStateToProps)(Download);

export default DownloadPage;