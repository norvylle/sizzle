import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

// const autoBind = require('auto-bind');

export default class TitlePage extends Component {
    constructor(props){
        super(props)
    }
    render() {
        return(
            <View style={styles.view}>
                <Text>Let's create</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: '#ff5733',
      alignItems: 'stretch',
      justifyContent: 'center',
    },
});