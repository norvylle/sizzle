import React, { Component } from 'react';
import { Text, View } from 'react-native';

// const autoBind = require('auto-bind');

export default class HomePage extends Component {
    constructor(props){
        super(props)
    }
    render() {
        return(
            <View>
            <Text>Welcome Home!</Text>
            </View>
        );
    }
}