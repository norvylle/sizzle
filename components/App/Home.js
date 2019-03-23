import React, { Component } from 'react';
import { Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Card, CardItem, Left, Right, Thumbnail, Body, Icon, Button, Toast, Root } from 'native-base';

const database = require("../Service/database.json")
let recipes = database.recipes;
let users = database.users;

const autoBind = require('auto-bind');

export default class HomePage extends Component {
    constructor(props){
        super(props)
        this.state = {
            showToast: false,
            active: false,
        }
        autoBind(this);
    }

    handleStar(id){
        if(!recipes[id].isStarred){
            users[0].starred.push(id)
            recipes[id].stars += 1;
            this.forceUpdate()
        }else{
            users[0].starred.splice(id,1)
            recipes[id].stars -= 1;
        }
        recipes[id].isStarred = !recipes[id].isStarred;
        this.forceUpdate()
    }

    handleDownload(id){
        recipes[id].isDownloaded = !recipes[id].isDownloaded;
        this.forceUpdate()
        if(recipes[id].isDownloaded){
            Toast.show({
                text: "Downloading...",
                duration: 3000
            })
        }
    }

    render() {
        return(
            <Root>
                <ScrollView>
                    <Text style={styles.text}>What's Hot!</Text>                
                    <ScrollView horizontal={true}>
                    {
                        recipes.map((item) =>{
                            return(
                                <Card key={item.id} style={styles.card}>
                                    <CardItem>
                                        <Left>
                                            <Thumbnail source={{uri: users[item.userId].icon}}/>
                                            <Body>
                                                <Text>{item.title}</Text>
                                                <Text note>{users[item.userId].firstName} {users[item.userId].lastName}</Text>
                                            </Body>
                                        </Left>
                                        <Right>
                                            <Text>8h ago</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem cardBody>
                                        <Image source={{uri: item.image}} style={styles.image}/>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                        <Button transparent onPress={() => this.handleStar(item.id)}>
                                            <Icon type='FontAwesome' name='star' style={ item.isStarred ? (styles.icon) : (styles.icon1) }/>
                                        </Button>
                                        <Text>{item.stars} Stars</Text>
                                        </Left>
                                        <Body>
                                            <Text>{item.calories} cal{'\n'}per{'\n'}100 g</Text>
                                        </Body>
                                        <Right>
                                        <Button transparent onPress={() => this.handleDownload(item.id)}>
                                            <Icon type='Feather' name='download' style={ item.isDownloaded ? (styles.icon) : (styles.icon1) }/>
                                        </Button>
                                        </Right>
                                    </CardItem>
                                </Card>
                            )
                        })
                    }
                    </ScrollView>
                    <Text style={styles.text}>Let's Get Fit!</Text>                
                    <ScrollView horizontal={true}>
                    {
                        recipes.map((item) =>{
                            return(
                                <Card key={item.id} style={styles.card}>
                                    <CardItem>
                                        <Left>
                                            <Thumbnail source={{uri: users[item.userId].icon}}/>
                                            <Body>
                                                <Text>{item.title}</Text>
                                                <Text note>{users[item.userId].firstName} {users[item.userId].lastName}</Text>
                                            </Body>
                                        </Left>
                                        <Right>
                                            <Text>8h ago</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem cardBody>
                                        <Image source={{uri: item.image}} style={styles.image}/>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                        <Button transparent onPress={() => this.handleStar(item.id)}>
                                            <Icon type='FontAwesome' name='star' style={ item.isStarred ? (styles.icon) : (styles.icon1) }/>
                                        </Button>
                                        <Text>{item.stars} Stars</Text>
                                        </Left>
                                        <Body>
                                            <Text>{item.calories} cal{'\n'}per{'\n'}100 g</Text>
                                        </Body>
                                        <Right>
                                        <Button transparent onPress={() => this.handleDownload(item.id)}>
                                            <Icon type='Feather' name='download' style={ item.isDownloaded ? (styles.icon) : (styles.icon1) }/>
                                        </Button>
                                        </Right>
                                    </CardItem>
                                </Card>
                            )
                        })
                    }
                    </ScrollView>
                    <Text style={styles.text}>Vegan Life.</Text>                
                    <ScrollView horizontal={true}>
                    {
                        recipes.map((item) =>{
                            return(
                                <Card key={item.id} style={styles.card}>
                                    <CardItem>
                                        <Left>
                                            <Thumbnail source={{uri: users[item.userId].icon}}/>
                                            <Body>
                                                <Text>{item.title}</Text>
                                                <Text note>{users[item.userId].firstName} {users[item.userId].lastName}</Text>
                                            </Body>
                                        </Left>
                                        <Right>
                                            <Text>8h ago</Text>
                                        </Right>
                                    </CardItem>
                                    <CardItem cardBody>
                                        <Image source={{uri: item.image}} style={styles.image}/>
                                    </CardItem>
                                    <CardItem>
                                        <Left>
                                        <Button transparent onPress={() => this.handleStar(item.id)}>
                                            <Icon type='FontAwesome' name='star' style={ item.isStarred ? (styles.icon) : (styles.icon1) }/>
                                        </Button>
                                        <Text>{item.stars} Stars</Text>
                                        </Left>
                                        <Body>
                                            <Text>{item.calories} cal{'\n'}per{'\n'}100 g</Text>
                                        </Body>
                                        <Right>
                                        <Button transparent onPress={() => this.handleDownload(item.id)}>
                                            <Icon type='Feather' name='download' style={ item.isDownloaded ? (styles.icon) : (styles.icon1) }/>
                                        </Button>
                                        </Right>
                                    </CardItem>
                                </Card>
                            )
                        })
                    }
                    </ScrollView>
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