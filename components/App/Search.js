import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input, Form, Item, Button, Icon, Left, Radio, Text, } from 'native-base';

const autoBind = require('auto-bind');

export default class SearchPage extends Component {
    constructor(props){
        super(props)
        this.state={
            text: "",
            selected: 0,
        }
        autoBind(this)
    }

    handleSearch(){
        
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
    }
})