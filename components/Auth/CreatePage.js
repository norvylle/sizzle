import React, { Component } from 'react';
import { View, StyleSheet,Text, Alert, NetInfo } from 'react-native';
import { Form, Item, Input, Label, Button, Icon, DatePicker, Radio, Spinner } from 'native-base';
import { insert, searchSingle, registerEmail, validateEmail } from '../Service/Firebase';
import { login } from '../Service/Reducer'
import { connect } from 'react-redux';


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
            sex: "",
            submitting: false,
          }
        autoBind(this);
    }

    handleShowPassword(){
        this.setState({ showPassword: !this.state.showPassword })
    }

    async handleCreate(){        
        if(! await NetInfo.isConnected.fetch().then((isConnected)=>{return isConnected;})){
            Alert.alert("Sizzle","You are offline. Try again later.");
            return;
        }

        this.setState({submitting: true});
        let clone = JSON.parse(JSON.stringify(this.state));
        delete clone["showPassword"]
        delete clone["submitting"]
        
        if(clone["password"].length < 6){
            Alert.alert("Sizzle", "Password should be at least 6 characters.")
            this.setState({submitting: false});
            return
        }
        if(!validateEmail(clone["email"])){
            Alert.alert("Sizzle", "Invalid email format.")
            this.setState({submitting: false});
            return
        }
        
        for(data in clone){
            if(clone[data] === ""){
                Alert.alert("Sizzle", "Please complete the required field/s.")
                this.setState({submitting: false});
                return
            }
        }

        await searchSingle({link: "users",child: "username",search: this.state.username})
        .once("value" ,(snapshot) =>{ 
            if(snapshot.exists()){
                Alert.alert("Sizzle","Username already exists.");
                this.setState({submitting: false});
            }else{
                registerEmail(clone.email,clone.password)
                .then(async (user)=>{
                    await user.user.updateProfile({displayName: clone.username})
                    insert({link:"users/",data:clone})
                    .once('value',(snapshot)=>{
                        this.props.dispatch(login({...snapshot.val(),key: snapshot.key}))
                    })
                    .then(async ()=>{
                        this.setState({submitting: false});
                        this.props.navigation.navigate('Avatar',{sex: clone.sex});                        
                    })
                    .catch((error)=>{
                        Alert.alert("Sizzle",error.message);
                        this.setState({submitting: false});
                    })
                })
                .catch((error)=>{
                    Alert.alert("Sizzle",error.message);
                    this.setState({submitting: false});
                })
            }
        })        
    }

    getDateLimit(){
        let date = new Date();
        date.setFullYear(date.getFullYear()-1);
        return date
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
                    <Item>
                        <Item stackedLabel style={styles.halfItem}>
                            <Label style={styles.label}>Date of Birth</Label>
                            <DatePicker maximumDate={this.getDateLimit()} placeHolderText="Select Date" onDateChange={(birthday)=>{this.setState({birthday})}} textStyle={{color: "white"}} placeHolderTextStyle={{color: "#d3d3d3"}} timeZoneOffsetInMinutes={undefined}/>
                        </Item>
                        <Item stackedLabel style={styles.halfItem}>
                            <Label style={styles.label}>Sex</Label>
                            <Item style={styles.radioItem}>
                                <Radio onPress={()=>{this.setState({sex: "male"})}} selected={this.state.sex === "male"} color="white"/>
                                <Text style={styles.textColor}>     Male</Text>
                            </Item>
                            <Item style={styles.radioItem}>
                                <Radio onPress={()=>{this.setState({sex: "female"})}} selected={this.state.sex === "female"} color="white"/>
                                <Text style={styles.textColor}>  Female</Text>
                            </Item>
                        </Item>
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
                {   !this.state.submitting ?
                    <Button default block rounded style={styles.button} onPress={this.handleCreate}>
                        <Text style={styles.buttonText}>SUBMIT</Text>
                    </Button>
                    :
                    <Spinner style={{marginTop: 5, alignSelf: "center"}} color="white"/>
                }
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
        fontFamily:'geoSansLight', 
        fontSize:32,
        textAlign:"left",
        paddingLeft:10,
        paddingTop:20,
    },
    button:{
        width: 200,
        alignSelf: "center",
    },
    buttonText:{
        fontFamily:'Roboto_medium',
        color:'#fff'
      },
    radioItem:{
        borderColor: "transparent",
        marginLeft: 5,
        alignItems: "center",
        marginBottom: 5
    },
    textColor:{
        color: "white"
    },
    halfItem:{
        width: "50%",
        borderColor: "transparent",
        marginBottom: 5
    }
});

const mapStateToProps = state => {
    return state
}

const CreatePage = connect(mapStateToProps)(Create);

export default CreatePage;