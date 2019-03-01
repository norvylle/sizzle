import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Form, Item, Input, Label, Button, Icon } from 'native-base';
import { loadAssets } from '../Service/Assets';
import { signInWithEmail } from '../Service/Firebase';

const autoBind = require('auto-bind');

export default class TitlePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      fontOK: false,
      username:"",
      password:"",
      showPassword: true
    }
    autoBind(this);
  }

  async handleLogin(){
    if(validateEmail(this.state.username)){
      if(signInWithEmail(this.state.username,this.state.password)){
        this.props.navigation.navigate('App');
      }
      Alert.alert(
        "Sizzle",
        "Account information provided not found. Please double-check and try again."
      )
    }else{
      this.props.navigation.navigate('App');
    }
  }

  handleCreate(){
    this.props.navigation.navigate('Create');
  }

  handleShowPassword(){
    this.setState({ showPassword: !this.state.showPassword })
  }
  
  async componentWillMount(){
    await loadAssets()
    this.setState({fontOK: true})
  }

  render() {
    return (
      <View style={styles.view}>
      {
      this.state.fontOK ? (
      <View>
      <Text style={styles.title}>Sizzle</Text>
      <Text style={styles.text}>Login to Sizzle.</Text>
      </View>
      ) : null
      } 
      <Form>
        <Item stackedLabel >
          <Label style={styles.label}>Username/Email</Label>
          <Input style={styles.input} value={this.state.username} onChangeText={(username)=> this.setState({username})} maxLength={50}/>
        </Item>
        <Item stackedLabel >
          <Label style={styles.label}>Password</Label>
          <Input style={styles.input} value={this.state.password} secureTextEntry={this.state.showPassword} onChangeText={(password)=> this.setState({password})} maxLength={32}/>
          <Button transparent style={styles.passwordButton} onPress={this.handleShowPassword}>
            {
              this.state.showPassword ? (<Icon type='Ionicons' name='ios-eye' style={styles.label}/>) : (<Icon type='Ionicons' name='ios-eye-off' style={styles.label}/>)
            }
          </Button>
        </Item>
      </Form>
      <Text style={{paddingTop:10}}/>
      <Button default block rounded style={styles.button} onPress={this.handleLogin}>
      {
        this.state.fontOK ? (<Text style={styles.buttonText}>LOGIN</Text>) : (<Text>LOGIN</Text>)
      }
      </Button>
      <Text style={{paddingTop:50}}/>
      <Button transparent style={styles.create} onPress={this.handleCreate}>
        <Text style={styles.createText}>Create Account</Text>
      </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button:{
    width: 200,
    alignSelf: "center",
  },
  buttonText:{
    fontFamily:'Roboto_medium',
    color:'#fff'
  },
  create:{
    paddingVertical: 10,
    alignSelf: "center",
  },
  createText:{
    color: '#fff',
    textDecorationLine: "underline"
  },
  label:{
    color:'#fff',
  },
  input:{
    color:'#fff',
    fontSize: 18,
  },
  passwordButton:{
    alignSelf:'flex-end',
    position: 'absolute',
    marginTop: 15
  },
  title:{
    color:'#fff',
    fontFamily:'fantastic', 
    fontSize:40,
    textAlign:"center",
    paddingBottom:30
  },
  text:{
    color:'#fff',
    fontFamily:'Roboto', 
    fontSize:20,
    textAlign:"left",
    paddingLeft:15,
    paddingBottom:10
  },
  view: {
    flex: 1,
    backgroundColor: '#ff5733',
    alignItems: 'stretch',
    justifyContent: 'center',
  }
});

function validateEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}