import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Alert } from 'react-native';
import { Button, Icon,  Spinner } from 'native-base';
import { connect } from 'react-redux';
import { ImagePicker } from 'expo';
import { exportPicture, searchSingle } from '../Service/Firebase';

const autoBind = require('auto-bind');

class Avatar extends Component {
    constructor(props){
        super(props)
        this.state = {
            image: null,
            url: "",
            loading: false
        }
        autoBind(this);
    }

    async pickImage(){
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1]
          });
          
          if (!result.cancelled) {
            this.setState({ def: false, image:  result.uri});
          }
    }

    sleep(ms){
        return new Promise(resolve => setTimeout(resolve,ms))
    }

    async handleUpload(){
        this.setState({loading: true})
        if(this.state.def){
            this.setState({url: this.state.image})
        }else{
            let url = null;
            
            try {
                url = await exportPicture({link: this.props.state.user.username, child: "profile", uri: this.state.image})
            } catch (error) {
                console.log(error)
            }
            
            if(url === null){
                this.setState({loading: false})
                Alert.alert("Sizzle","An error occurred"); 
                return;
            }else{
                this.setState({url})
            }
        }

        

        await searchSingle({link: "users",child: "username",search: this.props.state.user.username})
        .once("value",(snapshot)=>{
            snapshot.forEach(async (item)=>{
                await item.ref.update({image: this.state.url})                
                this.setState({loading: false})
                Alert.alert("Sizzle","Upload Successful!");
                this.props.navigation.navigate('Home');
                return
            })
        })        
    }

    async handleSkip(){
        this.setState({loading: true})
        await searchSingle({link: "users",child: "username",search: this.props.state.user.username})
        .once("value",(snapshot)=>{
            snapshot.forEach(async (item)=>{
                await item.ref.update({image: null})                
                this.setState({loading: false})
                this.props.navigation.navigate('Home');
                return
            })
        })
    }

    componentWillMount(){

        if(this.props.navigation.state.params.sex === "male"){
            this.setState({ image: "https://firebasestorage.googleapis.com/v0/b/sizzle-nsuy.appspot.com/o/male.png?alt=media&token=2ab34c49-954d-465f-9819-1f73b496420e"})
        }else{
            this.setState({ image: "https://firebasestorage.googleapis.com/v0/b/sizzle-nsuy.appspot.com/o/female.png?alt=media&token=9da1491a-faf2-4925-8be8-151a85a8c7e7"})
        }

       
    }

    render() {
        return(
            <View style={styles.view}>
                <Text style={styles.title}>Almost there...</Text>
                <Text style={styles.text}>Upload a profile picture so people would recognize you</Text>
                <View style={styles.center}>
                    <Image source={{uri: this.state.image}} style={styles.image}/>
                    <Button light iconRight disabled={this.state.loading} style={{justifyContent: "center", alignSelf: "center", width: 200}} onPress={()=>this.pickImage()}>
                        <Text>Pick an Image</Text>
                        <Icon type="EvilIcons" name="image" />
                    </Button>
                </View>
                <Button style={styles.button} disabled={this.state.loading} onPress={()=>this.handleUpload()}>
                    <Text style={styles.uploadText}>UPLOAD</Text>
                </Button>
                <Button transparent style={styles.button} disabled={this.state.loading} onPress={()=>this.handleSkip()}>
                    <Text style={styles.skipText}>Skip this for now.</Text>
                </Button>
                {this.state.loading ? <Spinner color="#ff5733" size="large" style={styles.spin}/> : null }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#ff5733',
        alignItems: 'flex-start',
        justifyContent: "space-evenly"
    },
    title:{
        color:'#fff',
        fontFamily:'geoSansLight', 
        fontSize:40,
        textAlign:"left",
        paddingLeft:10,
        paddingTop:50,
    },
    text:{
        color:'#fff',
        fontFamily:'Roboto', 
        fontSize:20,
        textAlign:"left",
        paddingLeft:15
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
        margin: 50,
        alignSelf: "center",
        borderRadius: 100,
        backgroundColor: "white"
    },
    center:{
        alignSelf: "center"
    },
    spin:{
        position: "absolute",
        left: "45%",
        top: "43%"
    }
});

const mapStateToProps = state => {
    return state
}

const AvatarPage = connect(mapStateToProps)(Avatar);

export default AvatarPage;