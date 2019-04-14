import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'native-base';

const autoBind = require('auto-bind');

export default class SettingsPage extends Component {
    constructor(props){
        super(props)
        autoBind(this);
    }

    async handlePress(){
        await this.props.navigation.popToTop();
        await this.props.navigation.navigate('Auth');
    }

    render() {
        return(
            <View>
                <Text>Welcome to Settings!</Text>
                <Button rounded onPress={this.handlePress} style={styles.button}>
                    <Text style={styles.buttonText}>Logout</Text>
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button:{
        alignSelf: 'stretch',
    },
    buttonText:{
        color:'#fff',
        alignSelf: 'center',
    },
})