import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Form, Item, Label, Input, Button } from 'native-base';
import { StyleSheet, Keyboard, Alert, NetInfo } from 'react-native';
import { validateEmail, update, snapshotToArray, getUser, getEmailAuthProvider, searchSingle } from '../Service/Firebase';
import { login } from '../Service/Reducer';


const autoBind = require('auto-bind');

class Email extends Component{
    constructor(props){
        super(props)
        this.state={
            newEmail: ""
        }
        autoBind(this)
    }

    handleSubmit(){
        Keyboard.dismiss();

        if(validateEmail(this.state.newEmail)){
            Alert.alert("Sizzle","Are you sure you want to change your email",[{ text: 'NO',style: 'cancel',},{text: 'YES', onPress: () => this.handleChangeEmail()}])
        }else{
            Alert.alert("Sizzle","Please enter a valid email.");
        }
    }

    async handleChangeEmail(){
        if(! await NetInfo.isConnected.fetch().then((isConnected)=>{return isConnected;})){
            Alert.alert("Sizzle","You are offline. Try again later.");
            return;
        }

        await update({link: "users/"+this.props.state.user.key, data: {email: this.state.newEmail} })
        .then(()=>{
            getUser().reauthenticateAndRetrieveDataWithCredential(getEmailAuthProvider().credential(this.props.state.user.email,this.props.state.user.password))
            .then(()=>{
                getUser().updateEmail(this.state.newEmail)
                .then(()=>{
                    searchSingle({link: "users", child: "username", search: this.props.state.user.username})
                    .once("value",async (snapshot)=>{
                        await this.props.dispatch(login(snapshotToArray(snapshot)[0]));
                        Alert.alert("Sizzle","Email Change successful.");
                        this.props.navigation.pop();
                    })
                })
                .catch((error)=>{
                    console.log(error)
                    Alert.alert("Sizzle","An error occurred.");
                })
            })
            .catch((error)=>{
                console.log(error)
                Alert.alert("Sizzle","An error occurred.");
            })
        })
        .catch((error)=>{
            console.log(error)
            Alert.alert("Sizzle","An error occurred.");
        })
    }

    render(){
        return(
            <View>
                <Form>
                    <Item stackedLabel >
                        <Label style={styles.label}>Current Email</Label>
                        <Input style={styles.input} value={this.props.state.user.email} disabled/>
                    </Item>
                    <Item stackedLabel >
                        <Label style={styles.label}>New Email</Label>
                        <Input style={styles.input} value={this.state.newEmail} onChangeText={(newEmail)=> this.setState({newEmail})}/>
                    </Item>
                </Form>
                <Button full info style={styles.button} onPress={()=>this.handleSubmit()}>
                    <Text>Change Email</Text>
                </Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input:{
        color:'#5f6a6a',
        fontSize: 18
    },
    label:{
        color:'#000',
    },
    button:{
        marginTop: 20
    }
})

const mapStateToProps = state => {
    return state
}

const EmailPage = connect(mapStateToProps)(Email);

export default EmailPage;