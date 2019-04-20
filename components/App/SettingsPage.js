import React, { Component } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Text, Button, H3 } from 'native-base';
import { connect } from 'react-redux'
import { logout } from '../Service/Reducer'

const autoBind = require('auto-bind');

class Settings extends Component {
    constructor(props){
        super(props)
        autoBind(this);
    }

    async handleLogout(){
        await this.props.navigation.popToTop();
        await this.props.navigation.navigate('Auth');
        this.props.dispatch(logout())
    }

    handleEditDetails(){
        this.props.navigation.navigate('EditDetails')
    }

    handleEmail(){
        this.props.navigation.navigate('Email')
    }

    handlePassword(){
        this.props.navigation.navigate('Password')
    }

    handleProfilePicture(){
        this.props.navigation.navigate('ProfilePicture')
    }

    handleRate(){}

    render() {
        return(
            <View style={styles.view}>
                <View style={styles.viewSpace}>
                    <H3 style={styles.H3}>Account ({this.props.state.user.username})</H3>
                    <View style={styles.viewColor}>
                        <Button full transparent onPress={()=>this.handleEditDetails()} style={styles.button}>
                            <Text uppercase={false} style={styles.buttonText}>Edit Details</Text>
                        </Button>
                        <Button full transparent onPress={()=>this.handleEmail()} style={styles.button}>
                            <Text uppercase={false} style={styles.buttonText}>Email</Text>
                        </Button>
                        <Button full transparent onPress={()=>this.handlePassword()} style={styles.button}>
                            <Text uppercase={false} style={styles.buttonText}>Password</Text>
                        </Button>
                        <Button full transparent onPress={()=>this.handleProfilePicture()} style={styles.button}>
                            <Text uppercase={false} style={styles.buttonText}>Profile Picture</Text>
                        </Button>
                    </View>
                </View>
                <View style={styles.viewSpace}>
                    <H3 style={styles.H3}>App</H3>
                    <View style={styles.viewColor}>
                        <Button full transparent onPress={()=>Linking.openURL("https://docs.google.com/forms/d/e/1FAIpQLSf6ONwcZ5rxyUE0aDv9Ipym9V--pCcsFk2lv_ZJ_KdODca_HA/viewform")} style={styles.button}>
                            <Text uppercase={false} style={styles.buttonText}>Rate This App!</Text>
                        </Button>
                        <Button full transparent onPress={()=>this.handleLogout()} style={styles.button}>
                            <Text style={styles.buttonTextLogout}>Log out</Text>
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button:{
        padding: 10
    },
    view:{
        height: "100%",
        backgroundColor: "#e5e8e8"
    },
    viewSpace:{
        marginTop: 20
    },
    viewColor:{
        backgroundColor: "white"
    },
    button:{
        borderBottomWidth: 0.5,
        borderBottomColor: "#e5e8e8",
        justifyContent: "flex-start"
    },
    buttonText:{
        color: "#000"
    },
    buttonTextLogout:{
        textAlign: "left",
        color: "red"
    },
    H3:{
        margin: 10,
        color: "#5f6a6a",
        fontFamily: "geoSansLight"
    }
})

const mapStateToProps = state => {
    return state
}

const SettingsPage = connect(mapStateToProps)(Settings);

export default SettingsPage;