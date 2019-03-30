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
            search: "",
            ingredient: {ndbno: -1},

            StepVisible: false,
            info: "",
            direction: "",
            time: "",

            
        }
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        autoBind(this)
    }

    async handleButtonIngredient(){
        if(this.state.ingredient.ndbno === -1){
           await this.setState({ingredient: {ndbno: -1,name: this.state.search}}) 
        }
        await this.state.ingredients.push({qty: this.state.quantity, unit: this.state.unit, ingredient: this.state.ingredient})
        this.setState({IngredientVisible: false, searchIngredient: [], searchResults: null, searching: false, quantity: "", unit: undefined, ingredient: {ndbno: -1}})
    }


    async handleSearch(value){
        this.setState({search: value});
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
                        this.setState({searchResults: response.data.list.item})
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

    async handleEditIngredient(data){
        this.state.ingredients.splice(this.state.ingredients.indexOf(data),1);
        await this.setState({quantity: data.qty, unit: data.unit, searchResults: [data.ingredient], ingredient: data.ingredient});
        this.setState({header: "Edit Ingredient", IngredientVisible: true})
    }

    handleDeleteIngredient(data){
        this.state.ingredients.splice(this.state.ingredients.indexOf(data),1);
        this.forceUpdate()
    }

    handleAddStep(){

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
                <Overlay isVisible={this.state.IngredientVisible} style={styles.overlay}>
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
                                <Label>  Ingredient</Label>
                                <Input value={this.state.search} onChangeText={(value)=>{this.handleSearch(value)}}/>
                            </Item>
                            <Text style={{alignSelf:"center", color: "gray"}}>Suggestions</Text>
                            <ScrollView style={styles.formScroll}>
                                {
                                    this.state.searchResults === null ? 
                                    (this.state.searching === true ? <Spinner color="blue"/> : null)
                                    : 
                                    (
                                        <List>
                                        {
                                            this.state.searchResults.map((item)=>{
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
                            <Button transparent onPress={()=>this.handleButtonIngredient()} style={styles.formButton}>
                                <Text>Submit</Text>
                            </Button>
                        </View>
                    </View>
                </Overlay>

                <Overlay isVisible={this.state.StepVisible} style={styles.overlay}>
                    <View>
                            <H2>{this.state.header}</H2>
                    </View>
                    <View style={styles.formView}>
                        <Button transparent onPress={()=>this.setState({StepVisible: false})}>
                            <Text>Back</Text>
                        </Button>
                        <Button transparent style={styles.formButton}>
                            <Text>Submit</Text>
                        </Button>
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
                            leftOpenValue={75}
                            rightOpenValue={-75}
                            dataSource={this.ds.cloneWithRows(this.state.ingredients)}
                            renderRow={
                                data=>
                                    <ListItem>
                                        <Text>{data.qty+data.unit+" "+data.ingredient.name}</Text>
                                    </ListItem>
                            }
                            renderLeftHiddenRow={data =>
                                <Button full onPress={() =>this.handleEditIngredient(data)}>
                                <Icon active type="Feather" name="edit" />
                                </Button>
                            }
                            renderRightHiddenRow={data=>
                                <Button full danger onPress={() => Alert.alert("Sizzle", "Delete "+data.name+"?",[{ text: 'Cancel',style: 'cancel',},{text: 'OK', onPress: () => this.handleDeleteIngredient(data)},],{cancelable: true})}>
                                <Icon active name="trash" />
                                </Button>
                            }
                            style={{borderWidth: 0.5, borderColor: "green", width: "100%"}}
                            />
                        }
                        <Button iconRight success block style={styles.button} onPress={()=>this.setState({header: "Add Ingredient", IngredientVisible: true})} style={styles.button}>
                            <Text>Add Ingredient</Text>
                            <Icon active type="FontAwesome" name="shopping-basket"/>
                        </Button>
                    </View>                        
                    <View style={styles.view}>
                        <Text style={styles.viewHeader}>Steps</Text>
                        <Button iconRight info block style={styles.button} onPress={()=>this.setState({header: "Add Step", StepVisible: true})}>
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
        marginTop: 10
    },
    overlay:{
        width: 400
    },
    viewHeader:{
        color: "gray",
        alignSelf: "center"
    }
})