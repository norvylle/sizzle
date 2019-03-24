import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Form, Item, Button, Icon, Left, Right, Radio, Text, Card, Body, Thumbnail } from 'native-base';
import { usda } from '../Service/secret';

const autoBind = require('auto-bind');
const axios = require('axios');

export default class SearchPage extends Component {
    constructor(props){
        super(props)
        this.state={
            text: "",
            searched:"",
            selected: 0,
            data: null,
        }
        autoBind(this)
    }

    handleSearch(){
        if(this.state.text === ""){
            Alert.alert("Sizzle","Please enter search on empty field");
        }else if(this.state.selected === 0){
            // Alert.alert("Sizzle","Recipes coming soon");
        }
        else{  
            axios.get(usda.search,
                {
                    params:{
                        api_key: usda.api_key,
                        format: "json",
                        max: 20,
                        q: this.state.text,
                    }
                }
            )
            .then(function(response){
                if(response.status === 200){
                    this.setState({data: response.data,searched: this.state.text})
                    console.log("INGREDIENT: Search success.")
                }
            }.bind(this))
            .then(function(error){
                if(error != undefined){
                    console.log("Error: "+error);
                }
            })
        }
    }


    render() {
        return(
            <View>
                <Form>
                    <Item style={styles.item}>
                        <Input placeholder="Search" value={this.state.text} onChangeText={(text)=>this.setState({text: text})}/>
                        <Button rounded bordered warning onPress={this.handleSearch}>
                            <Icon type="Octicons" name="search"/>
                        </Button>
                    </Item>
                    <Item>
                        <Item style={styles.half}>
                            <Left style={styles.left}>
                                <Radio onPress={()=>this.setState({selected: 0})} selected={this.state.selected === 0}/>
                            </Left>
                            <Text style={styles.right}>Recipe</Text>
                        </Item>
                        <Item style={styles.half}> 
                            <Left style={styles.left}>
                                <Radio onPress={()=>this.setState({selected: 1})} selected={this.state.selected === 1}/>
                            </Left>
                            <Text style={styles.right}>Ingredient</Text>
                        </Item>
                    </Item>
                </Form>
                <ScrollView>
                    {
                        this.state.data === null ? null : 
                        this.state.data.list.item.map((item)=>{
                            return(
                                <Card key={item.ndbno}>
                                    <Body>
                                            <Text>{item.name}</Text>
                                            <Text note>{item.group}</Text>
                                    </Body>
                                </Card>
                            )
                        })
                    }
                    {
                        this.state.data === null ? null :
                        (<Text style={{paddingBottom: 120, textAlign: "center", color: "gray"}}>Showing 1-50 of "{this.state.searched}"</Text>)   
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item:{
        flexDirection: "row",
        paddingTop: 10
    },
    half:{
        width: "50%",
        height: 50
    },
    left:{
        width: "40%"
    },
    right:{
        width: "60%"
    },
})