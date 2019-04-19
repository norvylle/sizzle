import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Alert } from 'react-native';
import { Button, Icon,  Spinner } from 'native-base';
import { connect } from 'react-redux';
import { ImagePicker } from 'expo';
import { exportPicture, searchSingle, update, snapshotToArray } from '../Service/Firebase';
import { login } from '../Service/Reducer';

const autoBind = require('auto-bind');

class Avatar extends Component {
    constructor(props){
        super(props)
        this.state = {
            image: null,
            url: "",
            loading: false,
            def: true
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

    async handleUpload(){
        this.setState({loading: true})
        if(this.state.def){
            await this.setState({url: this.state.image})
            this.realUpdate()
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
                await this.setState({url})
                this.realUpdate()
            }
            
        }
        
    }

    async realUpdate(){
        await update({link: "users/"+this.props.state.user.key, data: {image: this.state.url, starred: ["dummy"]} })
        .then(()=>{
            searchSingle({link: "users", child: "username", search: this.props.state.user.username})
            .once("value",async (snapshot)=>{
                await this.props.dispatch(login(snapshotToArray(snapshot)[0]));
                Alert.alert("Sizzle","Upload successful.");
                this.props.navigation.navigate('Home');
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
        margin: 25,
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