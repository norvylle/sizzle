import React, { Component } from 'react';
import { StyleSheet, ScrollView, ListView, Alert } from 'react-native';
import { Text, Form, Item, Label, Input, Button, Icon, List, View, H2, Picker, Spinner, ListItem } from 'native-base';
import { Overlay } from 'react-native-elements';
import { units, usda } from './../Service/secret';

const autoBind = require('auto-bind');
const axios = require('axios');

export default class NewRecipePage extends Component{
    constructor(props){
        super(props)
        this.state={
            recipeName: "",
            ingredients:[],
            steps:[],

            header: "",

            IngredientVisible: false,
            searchIngredient: [],
            searchResults: null,
            searching: false,
            quantity: "",
            unit: "c",
            ingredient: {ndbno: -1},

            StepVisible: false,
            info: "",
            direction: "",
            time: "",

            
        }
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        autoBind(this)
    }

    async handleAddIngredient(){
        await this.state.ingredients.push({qty: this.state.quantity, unit: this.state.unit, ingredient: this.state.ingredient})
       this.setState({IngredientVisible: false, searchIngredient: [], searchResults: null, searching: false, quantity: "", unit: undefined, ingredient: {ndbno: -1}})
       console.log(this.state.ingredients)
    }

    handleAddStep(){

    }

    async handleSearch(value){
        if(value.length > 2){
            await this.setState({searching: true, searchResults: null});
            axios.get(usda.search,
                {
                    params:{
                        api_key: usda.api_key,
                        ds: "Standard Reference",
                        format: "json",
                        max: 10,
                        q: value,
                    }
                }
            )
            .then(function(response){
                if(response.status === 200){
                    try {
                        if(response.data.errors.error[0].status === 400){
                            //empty results
                        }
                    }catch (error) {
                        this.setState({searchResults: response.data})
                        console.log("SEARCH:",value)
                    }
                }
            }.bind(this))
            .catch(function(error){
                Alert.alert("Sizzle","An error occurred.")
            })
        }
        this.setState({searching: false});
    }

    handleSelectIngredient(item){
        this.setState({ingredient: item})
    }


    async convertNum (text) {
        let dot = false;
        this.setState({
            quantity: text.replace(/[^0-9]/g, function(match){
                if(!dot && match === "."){
                    dot = true;
                    return match
                }else{
                    return ""
                }
            })
        });
    }

    render(){
        return(
            <ScrollView>
                <Overlay isVisible={this.state.IngredientVisible} onBackdropPress={()=>this.setState({IngredientVisible: false})} style={styles.overlay}>
                    <View>
                        <H2>{this.state.header}</H2>
                        <Form style={styles.form}>
                            <View style={styles.formView}>
                                <Item stackedLabel rounded style={{width: 100}}>
                                    <Label style={styles.formLabel}>Quantity</Label>
                                    <Input value={this.state.quantity} keyboardType="numeric" maxLength={8} onChangeText={(value)=>this.convertNum(value)}/>
                                </Item>
                                <Item rounded style={{width: 180}}>
                                    <Label>Unit</Label>
                                    <Picker mode="dropdown" selectedValue={this.state.unit} onValueChange={(unit)=>{
                                        this.setState({unit})
                                        }}>
                                        {
                                            units.map((unit)=>{
                                                return(<Picker.Item key={unit.abbr} label={unit.name+" ("+unit.abbr+")"} value={unit.abbr}/>)
                                            })
                                        }
                                    </Picker>
                                </Item>
                            </View>
                            <Item stackedLabel rounded style={styles.formIngredient}>
                                <Label>  Search Ingredient</Label>
                                <Input value={this.state.search} onChangeText={(value)=>{this.handleSearch(value)}}/>
                            </Item>
                            <ScrollView style={styles.formScroll}>
                                {
                                    this.state.searchResults === null ? 
                                    (this.state.searching === true ? <Spinner color="blue"/> : null)
                                    : 
                                    (
                                        <List>
                                        {
                                            this.state.searchResults.list.item.map((item)=>{
                                                return(
                                                        <ListItem key={item.ndbno} selected={item.ndbno === this.state.ingredient.ndbno} button={true} onPress={()=>this.handleSelectIngredient(item)}>
                                                            <Text>{item.name}</Text>
                                                        </ListItem>
                                                )
                                            })   
                                        }
                                        </List>
                                    )
                                    
                                }
                            </ScrollView>
                        </Form>
                        <View style={styles.formView}>
                            <Button transparent onPress={()=>this.setState({IngredientVisible: false})}>
                                <Text>Back</Text>
                            </Button>
                            <Button transparent onPress={()=>this.handleAddIngredient()} style={styles.formButton}>
                                <Text>Add</Text>
                            </Button>
                        </View>
                    </View>
                </Overlay>
                <Form>
                    <Item stackedLabel>
                        <Label>Recipe Name</Label>
                        <Input style={styles.input} placeholder={"My First Recipe"} value={this.state.recipeName} onChangeText={(recipeName)=> this.setState({recipeName})} maxLength={50}/>
                    </Item>
                    <View style={styles.view}>
                        <Text style={styles.viewHeader}>Ingredient</Text>
                        {
                            this.state.ingredients.length === 0 ? null :
                            <List
                            rightOpenValue={-75}
                            dataSource={this.ds.cloneWithRows(this.state.ingredients)}
                            renderRow={
                                data=>
                                    <ListItem>
                                        <Text>{data.qty+data.unit+" "+data.ingredient.name}</Text>
                                    </ListItem>
                            }
                            renderRightHiddenRow={data=>
                                <Button full danger onPress={() => Alert.alert("Sizzle","Delete "+data.ingredient.name+"?")}>
                                <Icon active name="trash" />
                                </Button>
                            }
                            style={{borderWidth: 0.5, borderColor: "green", width: "100%"}}
                            />
                        }
                        <Button iconRight success block style={styles.button} onPress={()=>this.setState({header: "Add Ingredient",IngredientVisible: true})} style={styles.button}>
                            <Text>Add Ingredient</Text>
                            <Icon active type="FontAwesome" name="shopping-basket"/>
                        </Button>
                    </View>                        
                    <View style={styles.view}>
                        <Text style={styles.viewHeader}>Steps</Text>
                        <Button iconRight info block style={styles.button} onPress={()=>this.setState({header: "Add Step", IngredientVisible: true})}>
                            <Text>Add Step</Text>
                            <Icon active type="FontAwesome" name="list-ol"/>
                        </Button>
                    </View>
                </Form>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    input:{
        color:'#000',
        fontSize: 18,
    },
    item:{
        paddingVertical: 20,
        width: "100%"
    },
    view:{
        flexDirection: 'column',
        paddingVertical: 10,
        alignItems: "flex-start",
    },
    button:{
        width: 200,
        alignSelf: "center",
    },
    form:{
        flexDirection: "column",
    },
    formView:{
        flexDirection: 'row',
        marginTop: 20
    },  
    formButton:{
        position: "absolute",
        right: 10
    },
    formLabel:{
        alignSelf: "center"
    },
    formIngredient:{
        width: 280,
        marginTop: 20
    },
    formScroll:{
        width: 280, 
        height: 250,
        borderWidth: 1,
        borderColor: "gray",
        marginTop: 20
    },
    overlay:{
        width: 400
    },
    viewHeader:{
        color: "gray",
        alignSelf: "center"
    }
})