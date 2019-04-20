import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Image, StyleSheet } from 'react-native';
import { ImagePicker } from 'expo';
import { View, Text, Spinner, Button, Icon } from 'native-base';
import { exportPicture, update, searchSingle, snapshotToArray, searchMulti } from '../Service/Firebase'
import { login } from '../Service/Reducer';
const autoBind = require('auto-bind');

class ProfilePicture extends Component{
    constructor(props){
        super(props)
        this.state={
            image: "",
            picked: false,
            loading: false,
            url: ""
        }
        autoBind(this)
    }

    async pickImage(){
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1]
          });
          
          if (!result.cancelled) {
            this.setState({ image: result.uri, picked: true});
          }
    }

    componentWillMount(){
        this.setState({image: this.props.state.user.image})
    }

    async handleUpload(){
        if(this.state.picked){
            let url = null;
            this.setState({loading: true});
            
            try {
                url = await exportPicture({link: this.props.state.user.username, child: "profile", uri: this.state.image})
            } catch (error) {
                console.log(error);
            }

            if(url === null){
                this.setState({loading: false});
                Alert.alert("Sizzle","An error occurred"); 
                return;
            }else{
                await this.setState({url})
                this.realUpdate()
            }

        }else{
            Alert.alert("Sizzle", "Please Pick a New Profile Picture.")
        }
    }

    async realUpdate(){
        await update({link: "users/"+this.props.state.user.key, data: {image: this.state.url}})
        .then(()=>{

            searchMulti({link: "recipes", child: "username", search: this.props.state.user.username })
            .on("value",(snapshot)=>{
                snapshot.forEach((child)=>{
                    child.ref
                    .update({userUrl: this.state.url})
                })
            })//update userUrl on recipes

            searchSingle({link: "users", child: "username", search: this.props.state.user.username})
            .once("value",async (snapshot)=>{
                await this.props.dispatch(login(snapshotToArray(snapshot)[0]));
                Alert.alert("Sizzle","Upload successful.");
                this.props.navigation.pop();
            })
        })
    }

    render(){
        return(
            <View style={styles.view}>
                <Image source={{uri: this.state.image}} style={styles.image}/>
                <Button light iconRight disabled={this.state.loading} style={{justifyContent: "center", alignSelf: "center", width: 200}} onPress={()=>this.pickImage()}>
                    <Text>Pick an Image</Text>
                    <Icon type="EvilIcons" name="image" />
                </Button>
                <Button style={styles.button} disabled={this.state.loading} onPress={()=>this.handleUpload()}>
                    <Text style={styles.uploadText}>UPLOAD</Text>
                </Button>
                {this.state.loading ? <Spinner color="#ff5733" size="large" style={styles.spin}/> : null }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: "#e5e8e8",
        alignItems: 'flex-start',
        justifyContent: "space-evenly"
    },
    button:{
        width: 200,
        alignSelf: "center",
        justifyContent: "center",
        marginTop: 15
    },
    uploadText:{
        fontFamily:'Roboto_medium',
        color:'#fff'
    },
    skipText:{
        color:'#fff',
        textDecorationLine: "underline"
    },
    image:{
        height: 200, 
        width: 200,
        margin: 25,
        alignSelf: "center",
        borderRadius: 100,
        backgroundColor: "white"
    },
    spin:{
        position: "absolute",
        left: "45%",
        top: "24%"
    }
})

const mapStateToProps = state => {
    return state
}

const ProfilePicturePage = connect(mapStateToProps)(ProfilePicture);

export default ProfilePicturePage;