import React, { Component } from 'react';
import { Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Card, CardItem, Left, Right, Thumbnail, Body, Icon, Button, Toast, Root } from 'native-base';
import { recipes } from '../Service/Database';
import { loadAssets } from '../Service/Assets';

const autoBind = require('auto-bind');

export default class HomePage extends Component {
    constructor(props){
        super(props)
        this.state = {
            showToast: false,
            image: false,
        }
        autoBind(this);
    }

    handleStar(id){
        if(!recipes[id].isStarred){
            recipes[id].stars += 1;
            this.forceUpdate()
        }else{
            recipes[id].stars -= 1;
        }
        recipes[id].isStarred = !recipes[id].isStarred;
        this.forceUpdate()
    }

    handleDownload(id){
        recipes[id].isDownloaded = !recipes[id].isDownloaded;
        this.forceUpdate()
        Toast.show({
            text: "Downloading...",
            duration: 3000
        })
    }

    handleImage(){
        this.setState({})
    }

    async componentWillMount(){
        await loadAssets();
    }

    render() {
        return(
            <Root>
            <ScrollView>
            <Text style={styles.text}>What's Hot!</Text>
            {
                recipes.map((item) =>{
                    return(
                        <Card key={item.id}>
                            <CardItem>
                                <Left>
                                    <Thumbnail source={{uri: item.icon}} onLoad={()=>this.handleImage}/>
                                    <Body>
                                        <Text>{item.title}</Text>
                                        <Text note>{item.user}</Text>
                                    </Body>
                                </Left>
                                <Right>
                                    <Text>8h ago</Text>
                                </Right>
                            </CardItem>
                            <CardItem cardBody>
                                <Image source={{uri: item.image}} style={{height: 200, width: null, flex: 1}}/>
                            </CardItem>
                            <CardItem>
                                <Left>
                                <Button transparent onPress={() => this.handleStar(item.id)}>
                                    <Icon type='FontAwesome' name='star' style={ item.isStarred ? (styles.icon) : (styles.icon1) }/>
                                </Button>
                                <Text>{item.stars} Stars</Text>
                                </Left>
                                <Body>
                                    <Text>{item.calories} calories per 100 grams</Text>
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
            </Root>
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