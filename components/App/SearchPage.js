import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert, Keyboard, TouchableOpacity, Image, NetInfo } from 'react-native';
import { CardItem, Input, Form, Item, Button, Icon, Left, Right, Picker, Text, Card, Body, Spinner, Thumbnail, H3 } from 'native-base';
import { usda, yummly, edamam } from '../Service/secret';
import { connect } from 'react-redux';
import { view, viewYummly, viewEdamam, addKey, removeKey } from '../Service/Reducer'
import { searchMultiStartsAt, snapshotToArray, transact, computeDate, update, setEdamamValues, getUser, storeData, retrieveData } from '../Service/Firebase';

const autoBind = require('auto-bind');
const axios = require('axios');

class Search extends Component {
    constructor(props){
        super(props)
        this.state={
            text: "",
            searched:"",
            selected: 2,
            data: null,
            searching: false,
            clickedInfo: false,
            renderData0: false,
            renderData1: false,
            renderData2: false,
            renderData3: false,
            guest: false,
            isConnected: false
        }
        autoBind(this)
    }

    async handleSearch(){
        if(this.state.text === ""){
            Alert.alert("Sizzle","Please enter search on empty field");
            return
        }

        this.setState({searching: true, data:null, renderData0: false, renderData1: false, renderData2: false, renderData3: false});        
        Keyboard.dismiss();

        if(! await NetInfo.isConnected.fetch().then((isConnected)=>{return isConnected;})){
            Alert.alert("Sizzle","You are offline. Try again later.");
            this.setState({searching: false});
            return;
        }

        if(this.state.selected === 0){
            await axios.get(yummly.search,
                {
                    params:{
                        _app_id: yummly.id,
                        _app_key: yummly.api_key,
                        q: this.state.text
                    }
                }
            )
            .then(async function(response){
                await this.setState({data: response.data})
                if(this.state.data.totalMatchCount  == 0){
                    Alert.alert("Sizzle","Your searched returned 0 results. Try again.");
                }else{
                    this.setState({renderData0: true, searched: this.state.text})
                }
                console.log("RECIPE (YUMMLY): Search success.")
            }.bind(this))
            .catch(function(error){
                Alert.alert("Sizzle",error.response)
                this.setState({searching: false});
            }.bind(this))

            this.setState({searching: false});
        }else if(this.state.selected === 1){
            await axios.get(edamam.search,
                {
                    params:{
                        app_id: edamam.app_id,
                        app_key: edamam.app_key,
                        q: this.state.text
                    }
                }
            ).then(async function(response){
                await this.setState({data: response.data.hits})
                console.log("RECIPE (EDAMAM): Search success.")
                if(data.length == 0){
                    Alert.alert("Sizzle","Your searched returned 0 results. Try again.");
                }else{
                    this.setState({renderData1: true})
                }
            }.bind(this))
            .catch(function(error){
                Alert.alert("Sizzle","An error occurred.");
                this.setState({searching: false});
            }.bind(this))
            
            this.setState({searching: false});
        }else if(this.state.selected === 2){
            try {
                await searchMultiStartsAt({link: "recipes", child: "recipeName", search: this.state.text})
                .on("value",async function(snapshot){
                    if(snapshot.exists()){
                        await this.setState({data: snapshotToArray(snapshot)});
                        this.setState({renderData2: true})
                    }else{
                        Alert.alert("Sizzle","Your searched returned 0 results. Try again.");
                    }
                }.bind(this))
            } catch (error) {
                Alert.alert("Sizzle","An error occurred.");
                this.setState({searching: false});
            }

            this.setState({searching: false});
        }else{    
            await axios.get(usda.search,
                {
                    params:{
                        api_key: usda.api_key,
                        ds: "Standard Reference",
                        format: "json",
                        max: 50,
                        q: this.state.text,
                    }
                }
            )
            .then(async function(response){
                if(response.status === 200){
                    try {
                        if(response.data.errors.error[0].status === 400){
                            Alert.alert("Sizzle","Your searched returned 0 results. Try again.");
                        }
                    }catch (error) {
                        await this.setState({data: response.data, searched: this.state.text})
                        this.setState({renderData3: true})
                        console.log("INGREDIENT: Search success.")
                    }
                }
            }.bind(this))
            .catch(function(error){
                Alert.alert("Sizzle","An error occurred.");
            })
            this.setState({searching: false});
        }
        this.setState({searching: false});
    }

    async handleInfo(ndbno){
        if(! await NetInfo.isConnected.fetch().then((isConnected)=>{return isConnected;})){
            Alert.alert("Sizzle","You are offline. Try again later.");
            return;
        }

        axios.get(usda.report,
            {
                params:{
                    api_key: usda.api_key,
                    ndbno: ndbno
                }
            }
        ).then(async function(response){
            try {
                if(response.data.errors.error[0].status === 400){
                    Alert.alert("Sizzle","Your searched returned 0 results. Try again.");
                }
            }catch (error) {
                if(response.status === 200){
                    let data = response.data.report.food;
                    let info = "Nutrient\t|\tValue per 100g"
                    await data.nutrients.forEach(nutrient=>{
                        info = info+"\n"+nutrient.name+"\t|\t"+nutrient.value+" "+nutrient.unit;
                    })
                    Alert.alert("Nutrional Facts",info);
                }
            }
        })
        .catch(function(error){
            if(error != undefined){
                console.log("Error: "+error);
            }
        })
    }

    async handleOpenYummly(id){
        //push id to View Recipe
        await this.props.dispatch(viewYummly());
        this.props.navigation.navigate('ViewRecipe',{id});
    }

    async showHealthLabels(labels){
        let str = "Health Labels\n"
        await labels.forEach((item)=>{
            str = str+"• "+item+"\n";
        })
        Alert.alert("Sizzle",str);
    }

    async handleOpenEdamam(recipe){
        await this.props.dispatch(viewEdamam());
        recipe.values = setEdamamValues(recipe.totalNutrients);
        this.props.navigation.navigate('ViewRecipe',{recipe})
    }

    async handleOpenUserRecipe(recipe){
        await this.props.dispatch(view());
        this.props.navigation.navigate('ViewRecipe',{recipe})
    }

    async handleDownload(recipe){
        let data = await retrieveData("downloads");
        data = JSON.parse(data);

        if(data.filter((item)=> item.key === recipe.key).length === 0){
            Toast.show({
                text: "Added to Downloads",
                duration: 3000,
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

    handleSelected(selected){
        if(this.state.renderData0 === true || this.state.renderData1 === true || this.state.renderData2 === true || this.state.renderData3 === true){
           this.setState({renderData0: false, renderData1: false, renderData2: false, renderData3: false});
        }
        this.setState({selected})
    }

    componentWillMount(){        
          if(getUser().isAnonymous === true){//GUEST
            this.setState({guest: true})
        }

    }

    render() {
        return(
            <View>
                <Form>
                    <Item style={styles.item}>
                        <Input placeholder="Search" value={this.state.text} onChangeText={(text)=>this.setState({text: text})}/>
                        <Button rounded bordered warning onPress={this.handleSearch}>
                            <Icon type="Octicons" name="search"/>
                        </Button>
                    </Item>
                    <Item>
                    {
                        this.state.guest ?
                        <Picker mode="dropdown" selectedValue={this.state.selected} onValueChange={(selected)=>{this.handleSelected(selected)}}>
                            <Picker.Item key={2} label={"Recipes by Sizzle Users"} value={2}/>
                        </Picker>
                        :
                        <Picker mode="dropdown" selectedValue={this.state.selected} onValueChange={(selected)=>{this.handleSelected(selected)}}>
                            <Picker.Item key={0} label={"Recipes by Yummly"} value={0}/>
                            <Picker.Item key={1} label={"Recipes by Edamam"} value={1}/>
                            <Picker.Item key={2} label={"Recipes by Sizzle Users"} value={2}/>
                            <Picker.Item key={3} label={"Ingredients"} value={3}/>
                        </Picker>
                    }
                    </Item>
                </Form>
                <ScrollView>
                    {//YUMMLY
                        this.state.selected === 0 ?
                        (this.state.renderData0 ? 
                            this.state.data.matches.map((item) =>{
                                return(
                                    <Card key={item.id} style={styles.card}>
                                        <CardItem>
                                            <Left style={{width: "80%"}}>
                                                <Thumbnail source={{uri: this.state.data.attribution.logo}} style={styles.thumbnail}/>
                                                <Body>
                                                    <H3 style={styles.h3}>{item.recipeName}</H3>
                                                    <Text note>{item.sourceDisplayName}</Text>
                                                </Body>
                                            </Left>
                                            <Right>
                                                <Button transparent onPress={() =>{Alert.alert("Sizzle","Rated by Yummly\n\n5 Stars - Outstanding\n4 Stars - Really Liked It\n3 Stars - Liked It/Average\n2 Stars - Not great/Just Okay\n1 Star - Didn't Like It")} }>
                                                    <Icon type='Feather' name='info' style={styles.icon}/>
                                                </Button>
                                            </Right>
                                        </CardItem>
                                        <TouchableOpacity onPress={()=>{this.handleOpenYummly(item.id)}}>
                                            <CardItem cardBody>
                                                <Image source={{uri: item.imageUrlsBySize[90]}} style={styles.image}/>
                                            </CardItem>
                                        </TouchableOpacity>
                                        <CardItem>
                                            <Left>
                                                <Text>{item.rating}/5 stars</Text>
                                            </Left>
                                            <Right>
                                                <Text>{item.totalTimeInSeconds/60} mins. cooking time.</Text>
                                            </Right>
                                        </CardItem>
                                    </Card>
                                )
                            })
                            : null)                         
                        : 
                        ( (this.state.selected === 0 && this.state.searching === true) ? <Spinner color="blue" style={{paddingTop: 50}}/> : null) 
                    }
                    {
                        this.state.selected === 0 ? 
                        (this.state.renderData0 ? 
                            (<Text style={{fontFamily: "geoSansLight", textAlign: "center", color: "gray"}}>{this.state.data.attribution.text}</Text>)   
                            :null)
                        :
                        null
                    }

                    {//EDAMAM
                        this.state.selected == 1 ? 
                        (this.state.renderData1 ? 
                            this.state.data.map((item,index)=>{
                                return(
                                    <Card key={index} style={styles.card}>
                                        <CardItem>
                                            <Left style={{width: "80%"}}>
                                                <Thumbnail source={{uri: "https://developer.edamam.com/images/logo-dev.png"}} style={styles.thumbnail}/>
                                                <Body>
                                                    <H3 style={styles.h3}>{item.recipe.label}</H3>
                                                    <Text note>{item.recipe.source}</Text>
                                                </Body>
                                            </Left>
                                            <Right>
                                                <Button transparent onPress={() =>this.showHealthLabels(item.recipe.healthLabels)}>
                                                    <Icon type='Feather' name='info' style={styles.icon}/>
                                                </Button>
                                            </Right>
                                        </CardItem>
                                        <TouchableOpacity onPress={()=>{this.handleOpenEdamam(item.recipe)}}>
                                            <CardItem cardBody>
                                                <Image source={{uri: item.recipe.image}} style={styles.image}/>
                                            </CardItem>
                                        </TouchableOpacity>
                                        <CardItem>
                                            <Left>
                                                <Text>{item.recipe.yield} Servings</Text>
                                            </Left>
                                        </CardItem>
                                    </Card>
                                )
                            })
                        :null)
                        :null
                    }

                    {//FIREBASE
                        this.state.selected === 2 ? 
                            (this.state.renderData2 ? 
                                this.state.data.map((recipe)=>{
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
                                        <TouchableOpacity onPress={()=>{this.handleOpenUserRecipe(recipe)}}>
                                            <CardItem cardBody>
                                                <Image source={{uri: recipe.url}} style={styles.userImage}/>
                                            </CardItem>
                                        </TouchableOpacity>
                                        <CardItem>
                                            <Left>
                                                <Button transparent onPress={() => this.handleStar(recipe)} disabled={this.state.guest}>
                                                    <Icon type='FontAwesome' name='star' style={ this.evaluateStar(recipe.key) ? (styles.icon) : (styles.icon1) }/>
                                                </Button>
                                                <Text>{recipe.stars} Stars</Text>
                                            </Left>
                                            <Right>
                                                <Button transparent onPress={() => this.handleDownload(recipe)} disabled={this.state.guest}>
                                                    <Icon type='Feather' name='download' style={ this.props.state.downloadedKeys.includes(recipe.key) ? (styles.icon) : (styles.icon1) }/>
                                                </Button>
                                            </Right>
                                        </CardItem>
                                    </Card>
                                    )
                                })
                            :null)
                        :null
                    }

                    {//INGREDIENTS
                        this.state.selected === 3 ? 
                            (this.state.renderData3 ? 
                                this.state.data.list.item.map((item)=>{
                                    return(
                                        <TouchableOpacity key={item.ndbno} onPress={()=>this.handleInfo(item.ndbno)}>
                                            <Card  pointerEvents="none">
                                                <Left>
                                                    <Body>
                                                        <Text style={{textAlign: "justify"}}>{item.name}</Text>
                                                        <Text note>{item.group}</Text>
                                                    </Body>
                                                </Left>
                                            </Card>
                                        </TouchableOpacity>
                                    )
                                })
                            :null)
                        :null
                    }
                    {
                        this.state.selected === 3 ?
                        (this.state.renderData3 ? 
                            (<Text style={{fontFamily: "geoSansLight", textAlign: "center", color: "gray"}}>Showing 1-50 of 50 results"{this.state.searched}"</Text>)
                            : null) 
                        :
                        null   
                    }
                    {
                        this.state.searching ? <Spinner color="blue" style={{paddingTop: 50}}/> : null
                    }
                <Text style={{paddingBottom: 120, opacity: 0}}/>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item:{
        flexDirection: "row",
        paddingTop: 10
    },
    half:{
        width: "50%",
        height: 50
    },
    left:{
        width: "40%"
    },
    right:{
        width: "60%"
    },
    spinner: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        height: 180, 
        width: 120, 
        flex: 1
    },
    card:{
        maxHeight: 350,
    },
    icon:{
        color: '#000'
    },
    thumbnail:{
        height: 15
    },
    h3:{
        fontFamily: "geoSansLightOblique"
    },
    icon:{
        color: '#ff5573'
    },
    icon1:{
        color: '#000'
    },
    userImage:{
        height: 200, 
        width: 300, 
        flex: 1
    },
})

const mapStateToProps = state => {
    return state
}

const SearchPage = connect(mapStateToProps)(Search);

export default SearchPage;