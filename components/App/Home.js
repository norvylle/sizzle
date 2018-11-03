import React, { Component } from 'react';
import { Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Card, CardItem, Left, Right, Thumbnail, Body, Icon, Button } from 'native-base';
import { recipes } from '../Service/Database';

const autoBind = require('auto-bind');

export default class HomePage extends Component {
    constructor(props){
        super(props)
        autoBind(this);
    }

    handleStar(id){
        if(!recipes[id].isStarred){
            recipes[id].stars += 1;
            recipes[id].isStarred = true;
            this.forceUpdate()
        }
    }

    render() {
        return(
            <ScrollView>
            <Text style={styles.text}>What's Hot!</Text>
            {
                recipes.map((item) =>{
                    return(
                        <Card key={item.id}>
                            <CardItem>
                                <Left>
                                    <Thumbnail source={{uri: item.icon}}/>
                                    <Body>
                                        <Text>{item.title}</Text>
                                        <Text note>{item.user}</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            <CardItem cardBody>
                                <Image source={{uri: item.image}} style={{height: 200, width: null, flex: 1}}/>
                            </CardItem>
                            <CardItem>
                                <Left>
                                <Button transparent onPress={() => this.handleStar(item.id)}>
                                    <Icon active type='FontAwesome' name='star' style={ item.isStarred ? (styles.icon) : (styles.icon1) }/>
                                    <Text>  {item.stars} Stars</Text>
                                </Button>
                                </Left>
                                <Right>
                                    <Text>8h ago</Text>
                                </Right>
                            </CardItem>
                        </Card>
                    )
                })
            }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    text:{
        fontFamily: 'geoSansLight',
        fontSize: 24
    },  
    icon:{
        color: '#ff5573'
    },
    icon1:{
        color: '#000'
    }
})