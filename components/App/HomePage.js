import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, CardItem, Toast, Root, Spinner, H3, Text, Thumbnail, Left, Right, Body, Button, Icon} from 'native-base';
import { connect } from 'react-redux';
import { computeDate, retrieveMulti, snapshotToArray, transact, update } from '../Service/Firebase';
import { view } from '../Service/Reducer';

const autoBind = require('auto-bind');

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            showToast: false,
            active: false,
            db: null,
            renderdb: false,
            noErrors: true,
        }
        autoBind(this);
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

    handleDownload(recipe){
        Toast.show({
            text: "Downloading...",
            duration: 3000
        })
    }
    
    async handleOpenRecipe(recipe){
        await this.props.dispatch(view());
        this.props.navigation.navigate('ViewRecipe',{recipe});
    }

    async componentWillMount(){
        retrieveMulti({link: "recipes", limit: 20}) //fix to get latest
        .on("value",function(snapshot){
           this.setState({db: snapshotToArray(snapshot).reverse(), renderdb: true})
        }.bind(this))
    }        

    render() {
        return(
            <Root>
                <ScrollView>
                    {
                        !this.state.renderdb ?
                        (this.state.noErrors ? <Spinner color="blue" style={{paddingTop: 50}}/> : null) :
                        this.state.db.map((recipe) =>{
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
                                            <Button transparent onPress={() => this.handleStar(recipe)}>
                                                <Icon type='FontAwesome' name='star' style={ this.evaluateStar(recipe.key) ? (styles.icon) : (styles.icon1) }/>
                                            </Button>
                                            <Text>{recipe.stars} Stars</Text>
                                        </Left>
                                        <Right>
                                            <Button transparent onPress={() => this.handleDownload(recipe)}>
                                                <Icon type='Feather' name='download' style={ true ? (styles.icon) : (styles.icon1) }/>
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

const HomePage = connect(mapStateToProps)(Home);

export default HomePage;