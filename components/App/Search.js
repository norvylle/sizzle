import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Input, Form, Item, Button, Icon, Left, Radio, Text, Card, Body, Spinner, InputGroup } from 'native-base';
import { usda } from '../Service/secret';
import { searchSingle } from '../Service/Firebase';

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
            searching: false,
            clickedInfo: false,
        }
        autoBind(this)
    }

    async handleSearch(){
        if(this.state.text === ""){
            Alert.alert("Sizzle","Please enter search on empty field");
            return
        }

        this.setState({searching: true, data:null});
        Keyboard.dismiss();

        if(this.state.selected === 0){
            // searchSingle({link: "users",child: "username",search: this.state.text})
            // .then((snapshot)=>{
            //     console.log(snapshot)
            // })
            this.setState({searching: false});
        }
        else{    
            await axios.get(usda.search,
                {
                    params:{
                        api_key: usda.api_key,
                        ds: "Standard Reference",
                        format: "json",
                        max: 50,
                        q: this.state.text,
                    }
                }
            )
            .then(function(response){
                if(response.status === 200){
                    try {
                        if(response.data.errors.error[0].status === 400){
                            Alert.alert("Sizzle","Your searched returned 0 results. Try again.");
                        }
                    }catch (error) {
                        this.setState({data: response.data, searched: this.state.text})
                        console.log("INGREDIENT: Search success.")
                    }
                }
            }.bind(this))
            .catch(function(error){
                Alert.alert("Sizzle","An error occurred.")
            })

            this.setState({searching: false});
        }
    }

    handleInfo(ndbno){
        // this.setState({clickedInfo: true}) // spinner overlay
        axios.get(usda.report,
            {
                params:{
                    api_key: usda.api_key,
                    ndbno: ndbno
                }
            }
        ).then(async function(response){
            try {
                if(response.data.errors.error[0].status === 400){
                    Alert.alert("Sizzle","Your searched returned 0 results. Try again.");
                }
            }catch (error) {
                if(response.status === 200){
                    let data = response.data.report.food;
                    let info = "Nutrient\t|\tValue per 100g"
                    await data.nutrients.forEach(nutrient=>{
                        info = info+"\n"+nutrient.name+"\t|\t"+nutrient.value+" "+nutrient.unit;
                    })
                    Alert.alert("Nutrional Facts",info);
                }
            }
        })
        .catch(function(error){
            if(error != undefined){
                console.log("Error: "+error);
            }
        })

        // this.setState({clickedInfo: false})
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
                        this.state.data === null ? 
                        (this.state.searching === true ? <Spinner color="blue" style={{paddingTop: 50}}/> : null) 
                        : 
                        this.state.data.list.item.map((item)=>{
                            return(
                                <TouchableOpacity key={item.ndbno} onPress={()=>this.handleInfo(item.ndbno)}>
                                    <Card  pointerEvents="none">
                                        <Left>
                                            <Body>
                                                    <Text>{item.name}</Text>
                                                    <Text note>{item.group}</Text>
                                            </Body>
                                        </Left>
                                    </Card>
                                </TouchableOpacity>
                            )
                        })
                    }
                    {
                        this.state.data === null ? null :
                        (<Text style={{paddingBottom: 120, textAlign: "center", color: "gray"}}>Showing 1-50 of 50 results"{this.state.searched}"</Text>)   
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
    spinner: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})