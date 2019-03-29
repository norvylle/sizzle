import React, { Component } from 'react';
import { StyleSheet, ScrollView, ListView, } from 'react-native';
import { Text, Form, Item, Label, Input, Button, Icon, List, View, H2 } from 'native-base';
import { Overlay } from 'react-native-elements';

const autoBind = require('auto-bind');

export default class NewRecipePage extends Component{
    constructor(props){
        super(props)
        this.state={
            recipeName: "",
            ingredients:[],
            steps:[],
            IngredientVisible: false,
            StepVisible: false,
            header: "",
            quantity: "", //counter check on handleAddIngredient #no number input on react native

        }
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        autoBind(this)
    }

    handleAddIngredient(){
        
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
                <Overlay isVisible={this.state.IngredientVisible} onBackdropPress={()=>this.setState({IngredientVisible: false})}>
                    <View>
                        <H2>{this.state.header}</H2>
                        <Form style={styles.form}>
                            <Item stackedLabel  rounded style={{width: 100}}>
                                <Label>Quantity</Label>
                                <Input value={this.state.quantity} keyboardType="numeric" maxLength={8} onChangeText={(value)=>this.convertNum(value)}/>
                            </Item>
                            <Item stackedLabel rounded picker style={{width: 150}}>
                                <Label>Unit</Label>
                                
                            </Item>
                        </Form>
                        <Button transparent onPress={()=>this.setState({IngredientVisible: false})} style={styles.formButton}>
                            <Text>Back</Text>
                        </Button>
                    </View>
                </Overlay>
                <Form>
                    <Item stackedLabel>
                        <Label>Recipe Name</Label>
                        <Input style={styles.input} placeholder={"My First Recipe"} value={this.state.recipeName} onChangeText={(recipeName)=> this.setState({recipeName})} maxLength={50}/>
                    </Item>
                    <Item style={styles.item}>
                        <Label>Ingredients</Label>
                        {
                            this.state.ingredients.length === 0 ? null :
                            <List
                            leftOpenValue={75}
                            rightOpenValue={-75}
                            dataSource={this.ds.cloneWithRows(this.state.ingredients)}
                            renderRow={
                                data=>
                                    <ListItem>
                                        <Text>{data.name}</Text>
                                    </ListItem>
                            }
                            renderLeftHiddenRow={data =>
                                <Button full onPress={() => Alert.alert(data.qty+" "+data.unit+" "+data.name,"Nutritional facts:\n")}>
                                <Icon active name="information-circle" />
                                </Button>
                            }
                            renderRightHiddenRow={data=>
                                <Button full danger onPress={() => Alert.alert("Sizzle","Delete "+data.name+"?")}>
                                <Icon active name="trash" />
                                </Button>
                            }
                            />
                        }
                        <Button iconRight success block style={styles.button} onPress={()=>this.setState({header: "Add Ingredient",IngredientVisible: true})}>
                            <Text>Add Ingredient</Text>
                            <Icon active type="FontAwesome" name="shopping-basket"/>
                        </Button>
                    </Item>
                    <Item style={styles.item}>
                        <Label>Steps</Label>
                        <Button iconRight info block style={styles.button} onPress={()=>this.setState({header: "Add Step", IngredientVisible: true})}>
                            <Text>Add Step</Text>
                            <Icon active type="FontAwesome" name="list-ol"/>
                        </Button>
                    </Item>
                    
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
        flexDirection: "column",
    },
    button:{
        width: 200,
        alignSelf: "center",
    },
    form:{
        flexDirection: "row",
    },
    formButton:{
        marginTop: 10
    }
})