import React, { Component } from 'react';
import { View } from 'react-native';
import { Input, Form, Item, Button, Text } from 'native-base';
import { Speech } from 'expo';

const autoBind = require('auto-bind');

export default class SearchPage extends Component {
    constructor(props){
        super(props)
        this.state={
            text:"hello"
        }
        autoBind(this)
    }

    handleSpeak(){
        Speech.speak(this.state.text,{language:'en', pitch: 1, rate: 1})
    }
    render() {
        return(
            <View>
                <Form>
                    <Item><Input placeholder="Search" value={this.state.text} onChangeText={(text)=>this.setState({text: text})}/></Item>
                </Form>
                <Button onPress={this.handleSpeak}>
                    <Text>Speak!</Text>
                </Button>
            </View>
        );
    }
}