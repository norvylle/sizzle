import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Form, Item, Label, Input, Button, Icon } from 'native-base';

const autoBind = require('auto-bind');

export default class NewRecipePage extends Component{
    constructor(props){
        super(props)
        this.state={
            recipeName: "",
            ingredients:[{qty: 2, unit: "pc", name: "chickenjoy", desc: "langhap sarap", nutrients:[]}],
            steps:[]
        }
        autoBind(this)
    }

    handleIngredients(){
        this.props.navigation.navigate("Ingredients",this.state.ingredients)
    }

    handleSteps(){}

    render(){
        return(
            <View style={styles.view}>
                <Form>
                    <Item floatingLabel>
                        <Label>Recipe Name</Label>
                        <Input style={styles.input} value={this.state.recipeName} onChangeText={(recipeName)=> this.setState({recipeName})} maxLength={50}/>
                    </Item>
                    <Button iconRight success block style={styles.button} onPress={this.handleIngredients}>
                        <Text>Ingredients</Text>
                    </Button>
                    <Button iconRight info block style={styles.button}>
                        <Text>Steps</Text>
                    </Button>
                </Form>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view:{
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    input:{
        color:'#000',
        fontSize: 18,
    },
    item:{
        paddingBottom: 20
    },
    button:{
        marginVertical: 10, 
        width: 250, 
        alignSelf: "center" 
    }
})