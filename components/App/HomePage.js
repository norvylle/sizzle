import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, CardItem, Toast, Root, Spinner, H3, Text, Thumbnail, Left, Right, Body, Button, Icon} from 'native-base';
import { connect } from 'react-redux';
import { computeDate, retrieveMulti, snapshotToArray, update } from '../Service/Firebase';

const database = require("../Service/database.json")
let recipes = database.recipes;
let users = database.users;

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
        console.log(this.props.state.user)
        //check if recipe on starred list
        // updates
        // update({link: "recipes/"+recipe.key, data: {}}) //update stars on recipe
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
                                                <H3>{recipe.recipeName}</H3>
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
                                                <Icon type='FontAwesome' name='star' style={ true ? (styles.icon) : (styles.icon1) }/>
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
    }
})

const mapStateToProps = state => {
    return state
}

const HomePage = connect(mapStateToProps)(Home);

export default HomePage;