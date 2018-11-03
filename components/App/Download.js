import React, { Component } from 'react';
import { Text, View } from 'react-native';

// const autoBind = require('auto-bind');

export default class DownloadPage extends Component {
    constructor(props){
        super(props)
    }
    render() {
        return(
            <View>
            <Text>This is where offline downloads will soon show up.</Text>
            </View>
        );
    }
}