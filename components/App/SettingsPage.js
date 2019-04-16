import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'native-base';
import { connect } from 'react-redux'
import { logout } from '../Service/Reducer'

const autoBind = require('auto-bind');

class Settings extends Component {
    constructor(props){
        super(props)
        autoBind(this);
    }

    async handleLogout(){
        this.props.dispatch(logout())
        await this.props.navigation.popToTop();
        await this.props.navigation.navigate('Auth');
    }

    render() {
        return(
            <View>
                <Text>Welcome to Settings!</Text>
                <Button bordered onPress={()=>this.handleLogout()} style={styles.button}>
                    <Text style={styles.buttonText}>Logout</Text>
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button:{
        alignItems: 'center'
    },
    buttonText:{
        color:'#fff',
        alignSelf: 'center',
    },
})

const mapStateToProps = state => {
    return state
}

const SettingsPage = connect(mapStateToProps)(Settings);

export default SettingsPage;