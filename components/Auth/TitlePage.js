import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Form, Item, Input, Label, Button, Icon, Root, Spinner } from 'native-base';
import { signInWithEmail } from '../Service/Firebase';
import { Font, AppLoading } from 'expo';
import { connect } from 'react-redux';
import { login, logout, guestLogin } from '../Service/Reducer'

const autoBind = require('auto-bind');

class Title extends Component {
  constructor(props){
    super(props)
    this.state = {
      loaded: false,
      username:"",
      password:"",
      showPassword: true,
      mode:''
    }
    autoBind(this);
  }

  async handleLogin(){
    if(validateEmail(this.state.username)){
      if(signInWithEmail(this.state.username,this.state.password)){
        //dispatch username with email sign in !
        this.props.navigation.navigate('App');
      }else{
        Alert.alert(
          "Sizzle",
          "Account information provided not found. Please double-check and try again."
        )
      }
    }else{ // dev purposes
      this.props.dispatch(login(this.state.username))
      //add validation
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
    await Font.loadAsync({
      'fantastic': require('../../assets/fonts/fantastic.ttf'),
      'geoSansLight': require('../../assets/fonts/geoSansLight.ttf'),
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
      'Feather': require("@expo/vector-icons/fonts/Feather.ttf"),
      'FontAwesome': require("@expo/vector-icons/fonts/FontAwesome.ttf"),
      'MaterialIcons': require("@expo/vector-icons/fonts/MaterialIcons.ttf"),
      'MaterialCommunityIcons': require("@expo/vector-icons/fonts/MaterialCommunityIcons.ttf"),
      'Octicons': require('@expo/vector-icons/fonts/Octicons.ttf'),
      'SimpleLineIcons': require('@expo/vector-icons/fonts/SimpleLineIcons.ttf'),
      'Entypo': require('@expo/vector-icons/fonts/Entypo.ttf'),
  });
    this.setState({loaded: true});
  }

  render() {
    if(!this.state.loaded){
      return(
        <Root>
          <AppLoading/>
        </Root>
      )
    }
    
    return (
      <View style={styles.view}>
      <View>
        <Text style={styles.title}>Sizzle</Text>
        <Text style={styles.text}>Login to Sizzle.</Text>
      </View>
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
        <Text style={styles.buttonText}>LOGIN</Text>
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

const mapStateToProps = state => {
  return state
}

const TitlePage = connect(mapStateToProps)(Title);

export default TitlePage;