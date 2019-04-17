import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { View, Label, Input, DatePicker, Form, Text, Item, Button } from 'native-base';
import { update, searchSingle, snapshotToArray } from '../Service/Firebase';
import { login } from '../Service/Reducer';
import { connect } from 'react-redux';

const autoBind = require('auto-bind');

class EditDetails extends Component{
    constructor(props){
        super(props)
        this.state={
            firstName: "",
            lastName: "",
            birthday: "",
            email: ""
        }
        autoBind(this)
    }

    componentWillMount(){
        this.setState({firstName: this.props.state.user.firstName, lastName: this.props.state.user.lastName, email: this.props.state.user.email, birthday: new Date(this.props.state.user.birthday)})
    }

    handleSubmit(){
        let data = {link: "users/"+this.props.state.user.key, data:{}}

        if(this.props.state.user.firstName != this.state.firstName) data.data.firstName = this.state.firstName
        if(this.props.state.user.lastName != this.state.lastName) data.data.lastName = this.state.lastName
        if(this.props.state.user.birthday != this.state.birthday.toISOString()) data.data.birthday = this.state.birthday

        update(data)
        .then(()=>{
            searchSingle({link: "users", child: "username", search: this.props.state.user.username})
            .once("value",async function(snapshot){
                await this.props.dispatch(login(await snapshotToArray(snapshot)[0]))
                Alert.alert("Sizzle","Account details updated.")
                this.props.navigation.navigate('Settings')
            }.bind(this))
        })
        .catch((error)=>{
            Alert.alert("Sizzle","An error occurred.")
        })
    }

    render(){
        return(
            <View style={styles.view}>
                <Form>
                    <Item stackedLabel style={styles.item}>
                        <Label style={styles.label}>First Name</Label>
                        <Input style={styles.input} value={this.state.firstName} onChangeText={(firstName)=> this.setState({firstName})} maxLength={50}/>
                    </Item>
                    <Item stackedLabel style={styles.item} >
                        <Label style={styles.label}>Last Name</Label>
                        <Input style={styles.input} value={this.state.lastName} onChangeText={(lastName)=> this.setState({lastName})} maxLength={20}/>
                    </Item>
                    <Item stackedLabel style={styles.item}>
                            <Label style={styles.label}>Date of Birth</Label>
                            <DatePicker maximumDate={new Date()} onDateChange={(birthday)=>{this.setState({birthday})}} textStyle={{color: "#5f6a6a", textAlign: "left"}} defaultDate={this.state.birthday} placeHolderTextStyle={{color: "#d3d3d3"}} timeZoneOffsetInMinutes={undefined}/>
                    </Item>
                    <Item stackedLabel style={styles.item}>
                        <Label style={styles.label}>Email</Label>
                        <Input style={styles.input} value={this.state.email} onChangeText={(email)=> this.setState({email})}/>
                    </Item>
                </Form>
                <Button onPress={()=>this.handleSubmit()}>
                    <Text>Submit</Text>
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
    view:{
        height: "100%",
        backgroundColor: "#e5e8e8"
    },
    item:{
        marginTop: 10
    }
})

const mapStateToProps = state => {
    return state
}

const EditDetailsPage = connect(mapStateToProps)(EditDetails);

export default EditDetailsPage;