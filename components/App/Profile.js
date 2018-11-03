import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'native-base';

const autoBind = require('auto-bind');

export default class ProfilePage extends Component {
    constructor(props){
        super(props)
        autoBind(this)
    }

    handlePress(){
        this.props.navigation.navigate('Auth');
    }

    render() {
        return(
            <View>
            <Text>Welcome to your profile</Text>
            <Button onPress={this.handlePress} style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
            </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button:{
        width: 200,
        alignSelf: "center",
        alignItems: "center"
    },
    buttonText:{
        fontFamily:'roboto_medium',
        color:'#fff',
    },
})