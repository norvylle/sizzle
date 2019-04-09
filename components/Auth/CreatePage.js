import React, { Component } from 'react';
import { View, StyleSheet,Text, Alert } from 'react-native';
import { Form, Item, Input, Label, Button, Icon, DatePicker, } from 'native-base';
import { insert, searchSingle, registerEmail } from '../Service/Firebase';
import { connect } from 'react-redux';
import { isArray } from 'util';

const autoBind = require('auto-bind');

class Create extends Component {
    constructor(props){
        super(props)
        this.state = {
            firstName:"",
            lastName:"",
            email:"",
            birthday:"",
            username:"",
            password:"",
            showPassword: true,
            exists: false,
          }
        autoBind(this);
    }

    handleShowPassword(){
        this.setState({ showPassword: !this.state.showPassword })
    }

    async handleCreate(){
        let clone = JSON.parse(JSON.stringify(this.state));
        delete clone["showPassword"]
        delete clone["exists"]
        if(clone["password"].length < 6){
            Alert.alert(
                "Sizzle",
                "Password should be at least 6 characters."
            )
            return
        }
        
        for(data in clone){
            if(clone[data] === ""){
                Alert.alert(
                    "Sizzle",
                    "Please complete the required field/s."
                )
                return
            }
        }
        await searchSingle({link: "users",child: "username",search: this.state.username})
        .on("value" ,(snapshot) =>{ this.setState({exists: snapshot.exists()})})
        
        if(this.state.exists){
            Alert.alert("Sizzle","Username already exists");
        }
        else{
            if(insert({link:"users/",data:clone})){
                registerEmail(clone.email,clone.password);
            }
        }
        
    }

    render() {
        return(
            <View style={styles.view}>
                <Text style={styles.title}>Create An Account</Text>
                <Form>
                    <Item stackedLabel >
                        <Label style={styles.label}>First Name</Label>
                        <Input style={styles.input} value={this.state.firstName} onChangeText={(firstName)=> this.setState({firstName})} maxLength={50}/>
                    </Item>
                    <Item stackedLabel >
                        <Label style={styles.label}>Last Name</Label>
                        <Input style={styles.input} value={this.state.lastName} onChangeText={(lastName)=> this.setState({lastName})} maxLength={20}/>
                    </Item>
                    <Item stackedLabel >
                        <Label style={styles.label}>Date of Birth</Label>
                        <DatePicker maximumDate={new Date()} placeHolderText="Select Date" onDateChange={(birthday)=>{this.setState({birthday})}} textStyle={{color: "white"}} placeHolderTextStyle={{color: "#d3d3d3"}} androidMode={"spinner"} timeZoneOffsetInMinutes={undefined}/>
                    </Item>
                    <Item stackedLabel >
                        <Label style={styles.label}>Email</Label>
                        <Input style={styles.input} value={this.state.email} onChangeText={(email)=> this.setState({email})}/>
                    </Item>
                    <Item stackedLabel >
                        <Label style={styles.label}>Username</Label>
                        <Input style={styles.input} value={this.state.username} onChangeText={(username)=> this.setState({username})} maxLength={20}/>
                    </Item>
                    <Item stackedLabel >
                        <Label style={styles.label}>Password</Label>
                        <Input style={styles.input} value={this.state.password} secureTextEntry={this.state.showPassword} onChangeText={(password)=> this.setState({password})} maxLength={16}/>
                        <Button transparent style={styles.passwordButton} onPress={this.handleShowPassword}>
                            {
                            this.state.showPassword ? (<Icon type='Ionicons' name='ios-eye' style={styles.label}/>) : (<Icon type='Ionicons' name='ios-eye-off' style={styles.label}/>)
                            }
                        </Button>
                    </Item>
                </Form>
                <Button default block rounded style={styles.button} onPress={this.handleCreate}>
                    <Text style={styles.buttonText}>Create</Text>
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#ff5733',
        alignItems: 'flex-start',
        justifyContent: "space-evenly",
        paddingBottom: 200
    },
    input:{
        color:'#fff',
        fontSize: 18,
    },
    label:{
        color:'#fff',
    },
    passwordButton:{
        alignSelf:'flex-end',
        position: 'absolute',
        marginTop: 15
    },
    title:{
        color:'#fff',
        fontFamily:'Roboto', 
        fontSize:20,
        textAlign:"left",
        paddingLeft:10,
        paddingTop:5,
    },
    button:{
        width: 200,
        alignSelf: "center",
    },
    buttonText:{
        fontFamily:'Roboto_medium',
        color:'#fff'
      },
});

const mapStateToProps = state => {
    return state
}

const CreatePage = connect(mapStateToProps)(Create);

export default CreatePage;