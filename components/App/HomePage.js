import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, Alert, NetInfo, RefreshControl, Linking } from 'react-native';
import { Card, CardItem, Toast, Root, Spinner, H3, Text, Thumbnail, Left, Right, Body, Button, Icon} from 'native-base';
import { connect } from 'react-redux';
import { computeDate, retrieveMulti, snapshotToArray, transact, update, getUser, signOut, storeData, retrieveData } from '../Service/Firebase';
import { view, logout, addKey, removeKey } from '../Service/Reducer';

const autoBind = require('auto-bind');

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            showToast: false,
            active: false,
            db: [],
            renderdb: false,
            noErrors: true,
            guest: false
        }
        autoBind(this);
    }

    static navigationOptions = ({navigation})=> {
        const { params = {} } = navigation.state;
        
        if(params.guest === true)
            return{
                headerRight: <Button transparent light onPress={navigation.getParam('handleGuestLogOut')}><Icon type="Feather" name="log-out"/></Button>
            }
    };

    handleGuestLogOut(){
        signOut()
        .then(async()=>{
            await this.props.navigation.popToTop();
            await this.props.navigation.navigate('Auth');
            Alert.alert("Love Sizzle?","Please take a moment to rate this app.",[{ text: 'NOT NOW',style: 'cancel',},{text: 'RATE', onPress: () => Linking.openURL("https://docs.google.com/forms/d/e/1FAIpQLSf6ONwcZ5rxyUE0aDv9Ipym9V--pCcsFk2lv_ZJ_KdODca_HA/viewform")},]);
            this.props.dispatch(logout())
        })
    }

    async handleStar(recipe){
        if(! await NetInfo.isConnected.fetch().then((isConnected)=>{return isConnected;})){
            Alert.alert("Sizzle","You are offline. Try again later.");
            return;
        }

        if(this.props.state.user.starred.includes(recipe.key)){ //unstar
            this.props.state.user.starred.splice(this.props.state.user.starred.indexOf(recipe.key),1);
            
            await update({link: "users/"+this.props.state.user.key, data: { starred: this.props.state.user.starred }})
            .then(async ()=>{
                await transact("recipes/"+recipe.key+"/stars")
                .transaction((stars)=>{
                    return stars-1;
                },(error, committed, snapshot)=>{
                    if(error){
                        Alert.alert("Sizzle","An error occurred. Try again later.");
                    }else if(!committed){
                        Alert.alert("Sizzle","An error occurred. Try again later.");
                    }else{
                        console.log(snapshot.val());
                    }
                }).catch((error)=>{
                    Alert.alert("Sizzle","An error occurred. Try again later.");
                })
            }).catch((error)=>{
                Alert.alert("Sizzle","An error occurred. Try again later.");
            })

        }else{ //star
            this.props.state.user.starred.push(recipe.key);

            await update({link: "users/"+this.props.state.user.key, data: { starred: this.props.state.user.starred }})
            .then(async ()=>{
                await transact("recipes/"+recipe.key+"/stars")
                .transaction(function(stars){
                    return stars+1;
                },function(error, committed, snapshot){
                    if(error){
                        Alert.alert("Sizzle","An error occurred. Try again later.");
                    }else if(!committed){
                        Alert.alert("Sizzle","An error occurred. Try again later.");
                    }else{
                        console.log(snapshot.val());
                    }
                }).catch((error)=>{
                    Alert.alert("Sizzle","An error occurred. Try again later.");
                })
            }).catch((error)=>{
                Alert.alert("Sizzle","An error occurred. Try again later.");
            })

        }
        this.forceUpdate()
    }

    evaluateStar(key){
        if(this.state.guest){
            return false
        }

        if(this.props.state.user.starred.includes(key)){
            return true
        }else{
            return false
        }
    }

    async handleDownload(recipe){
        let data = await retrieveData("downloads");
        data = JSON.parse(data);

        if(data.filter((item)=> item.key === recipe.key).length === 0){
            Toast.show({
                text: "Added to Downloads",
                duration: 2000,
                buttonText: 'CLOSE',
                buttonTextStyle: { color: "red" }
            })

            data.push(recipe)
            await this.props.dispatch(addKey(recipe.key));
            storeData("downloads",JSON.stringify(data));
        }else{
            data = data.filter((item)=> item.key !== recipe.key)
            await this.props.dispatch(removeKey(recipe.key));
            storeData("downloads",JSON.stringify(data));
        }
        this.forceUpdate()
    }
    
    async handleOpenRecipe(recipe){
        await this.props.dispatch(view());
        this.props.navigation.navigate('ViewRecipe',{recipe});
    }

    async componentWillMount(){
        this.setState({renderdb: false})
        
        if(! await NetInfo.isConnected.fetch().then((isConnected)=>{return isConnected;})){
            Alert.alert("Sizzle","You are offline. Try again later.");
            this.setState({renderdb: true});
            return;
        }

        retrieveMulti({link: "recipes", limit: 20}) //fix to get latest
        .on("value",function(snapshot){
            this.setState({db: snapshotToArray(snapshot).reverse(), renderdb: true})
        }.bind(this))   

        if(getUser().isAnonymous === true){//GUEST
            this.setState({guest: true})
            this.props.navigation.setParams({guest: true, handleGuestLogOut: this.handleGuestLogOut})
        }else{
            this.props.navigation.setParams({guest: false})
        }
    }        

    render() {
        return(
            <Root>
                <ScrollView refreshControl={<RefreshControl refreshing={!this.state.renderdb} onRefresh={()=>{this.componentWillMount()}} colors={["darkorchid"]}/>}>
                    {
                        !this.state.renderdb ?
                        null:
                        this.state.db.map((recipe) =>{
                            return(
                                <Card key={recipe.key} style={styles.card}>
                                    <CardItem>
                                        <Left>
                                            <Thumbnail source={{uri: recipe.userUrl}} style={{borderWidth: 1, borderColor: "black"}}/>
                                            <Body>
                                                <H3 style={styles.h3}>{recipe.recipeName}</H3>
                                                <Text note>{recipe.username}</Text>
                                            </Body>
                                        </Left>
                                        <Right>
                                            <Text>{computeDate(new Date(recipe.dateAdded))}</Text>
                                        </Right>
                                    </CardItem>
                                    <TouchableOpacity onPress={()=>{this.handleOpenRecipe(recipe)}}>
                                        <CardItem cardBody>
                                            <Image source={{uri: recipe.url}} style={styles.image}/>
                                        </CardItem>
                                    </TouchableOpacity>
                                    <CardItem>
                                        <Left>
                                            <Button transparent onPress={() => this.handleStar(recipe)} disabled={this.state.guest}>
                                                <Icon type='FontAwesome' name='star' style={this.evaluateStar(recipe.key) ? (styles.icon) : (styles.icon1) }/>
                                            </Button>
                                            <Text>{recipe.stars} Stars</Text>
                                        </Left>
                                        <Right>
                                            <Button transparent onPress={() => this.handleDownload(recipe)} disabled={this.state.guest}>
                                                <Icon type='Feather' name='download' style={this.props.state.downloadedKeys.includes(recipe.key) ? (styles.icon) : (styles.icon1) }/>
                                            </Button>
                                        </Right>
                                    </CardItem>
                                </Card>
                            )
                        })
                    }
                </ScrollView>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    card:{
        maxHeight: 350,
    },
    text:{
        fontFamily: 'geoSansLight',
        fontSize: 24,
        marginLeft: 10
    },  
    icon:{
        color: '#ff5573'
    },
    icon1:{
        color: '#000'
    },
    image:{
        height: 200, 
        width: 300, 
        flex: 1
    },
    slide:{
        flexDirection: 'column',
    },
    h3:{
        fontFamily: "geoSansLightOblique"
    }
})

const mapStateToProps = state => {
    return state
}

const HomePage = connect(mapStateToProps)(Home);

export default HomePage;