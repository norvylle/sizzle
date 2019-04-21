import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Alert, Keyboard, NetInfo } from 'react-native';
import { View, Text, Form, Item, Label, Input, Button, Icon } from 'native-base';
import { update, snapshotToArray, getUser, getEmailAuthProvider, searchSingle } from '../Service/Firebase';
import { login } from '../Service/Reducer';

const autoBind = require('auto-bind');

class Password extends Component{
    constructor(props){
        super(props)
        this.state={
            currentPassword:"",
            newPassword: "",
            retypePassword: "",
            showCurrentPassword: true,
            showNewPassword: true
        }
        autoBind(this)
    }

    handleShowCurrentPassword(){
        this.setState({ showCurrentPassword: !this.state.showCurrentPassword })
    }

    handleShowNewPassword(){
        this.setState({ showNewPassword: !this.state.showNewPassword })
    }

    handleSubmit(){
        Keyboard.dismiss();
        
        if(this.state.currentPassword === this.props.state.user.password){
            if(this.state.newPassword === this.state.currentPassword){
                Alert.alert("Sizzle","Please provide a new password");
            }
            else if(this.state.newPassword === this.state.retypePassword){
                Alert.alert("Sizzle","Are you sure you want to change your password",[{ text: 'NO',style: 'cancel',},{text: 'YES', onPress: () => this.handleChangePassword()}])
            }
            else{
                Alert.alert("Sizzle","Retyped password doesn't match new password.");
            }
        }else{
            Alert.alert("Sizzle","Current Password doesn't match record.");
        }
    }

    async handleChangePassword(){
        if(! await NetInfo.isConnected.fetch().then((isConnected)=>{return isConnected;})){
            Alert.alert("Sizzle","You are offline. Try again later.");
            return;
        }

        await update({link: "users/"+this.props.state.user.key, data: {password: this.state.newPassword} })
        .then(()=>{
            getUser().reauthenticateAndRetrieveDataWithCredential(getEmailAuthProvider().credential(this.props.state.user.email,this.props.state.user.password))
            .then(()=>{
                getUser().updatePassword(this.state.newPassword)
                .then(()=>{
                    searchSingle({link: "users", child: "username", search: this.props.state.user.username})
                    .once("value",async (snapshot)=>{
                        await this.props.dispatch(login(snapshotToArray(snapshot)[0]));
                        Alert.alert("Sizzle","Password Change successful.");
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
                        <Label style={styles.label}>Current Password</Label>
                        <Input style={styles.input} value={this.state.currentPassword} secureTextEntry={this.state.showCurrentPassword} onChangeText={(currentPassword)=> this.setState({currentPassword})} maxLength={32}/>
                        <Button transparent style={styles.passwordButton} onPress={()=>this.handleShowCurrentPassword()}>
                            {
                            this.state.showCurrentPassword ? (<Icon type='Ionicons' name='ios-eye' style={styles.label}/>) : (<Icon type='Ionicons' name='ios-eye-off' style={styles.label}/>)
                            }
                        </Button>
                    </Item>
                    <Item stackedLabel >
                        <Label style={styles.label}>New Password</Label>
                        <Input style={styles.input} value={this.state.newPassword} secureTextEntry={this.state.showNewPassword} onChangeText={(newPassword)=> this.setState({newPassword})} maxLength={32}/>
                        <Button transparent style={styles.passwordButton} onPress={()=>this.handleShowNewPassword()}>
                            {
                            this.state.showNewPassword ? (<Icon type='Ionicons' name='ios-eye' style={styles.label}/>) : (<Icon type='Ionicons' name='ios-eye-off' style={styles.label}/>)
                            }
                        </Button>
                    </Item>
                    <Item stackedLabel >
                        <Label style={styles.label}>Retype New Password</Label>
                        <Input style={styles.input} value={this.state.retypePassword} secureTextEntry={true} onChangeText={(retypePassword)=> this.setState({retypePassword})} maxLength={32}/>
                    </Item>
                </Form>
                <Button full info style={styles.button} onPress={()=>this.handleSubmit()}>
                    <Text>Change Password</Text>
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
    passwordButton:{
        alignSelf:'flex-end',
        position: 'absolute',
        marginTop: 15
    },
    view:{
        height: "100%",
        backgroundColor: "#e5e8e8"
    },
    item:{
        marginTop: 10
    },
    button:{
        marginTop: 20
    }
})


const mapStateToProps = state => {
    return state
}

const PasswordPage = connect(mapStateToProps)(Password);

export default PasswordPage;