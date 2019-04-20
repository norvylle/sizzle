import React, { Component } from 'react';
import { StyleSheet, ListView, Alert, ScrollView, Keyboard } from 'react-native';
import { View, Form, Input, Label, Item, List, ListItem, Text, Button, Icon, H2, Spinner, Picker, Thumbnail } from 'native-base';
import { Overlay } from 'react-native-elements';
import { connect } from 'react-redux';
import { view, viewYummly, viewEdamam } from '../Service/Reducer';
import { yummly, edamam } from '../Service/secret';
import { searchMultiStartsAt, snapshotToArray, insert, setEdamamValues, setYummlyValues } from '../Service/Firebase';

const autoBind = require('auto-bind');
const axios = require('axios');

class NewMealPlan extends Component{
    constructor(props){
        super(props)
        this.state={
            mealPlanName: "",
            recipes:[],
            add: false,
            text: "",
            selected: 2,
            data: null,
            searching: false,
            renderData0: false,
            renderData1: false,
            renderData2: false,
            loading: false,
        }
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        autoBind(this)
    }

    async handleOpenRecipe(recipe){
        if(recipe.type === "YUMMLY"){
            await this.props.dispatch(viewYummly());
        }else if(recipe.type === "EDAMAM"){
            await this.props.dispatch(viewEdamam());
        }else{
            await this.props.dispatch(view());
        }
        this.props.navigation.navigate('ViewRecipe',{recipe: recipe.recipe});
    }

    handleDeleteRecipe(index){
        this.state.recipes.splice(index,1);
    }

    handleAddRecipe(){
        this.setState({text: "",data: null, add: true})
    }

    async handleSearch(){
        await this.setState({searching: true, renderData0: false, renderData1: false, renderData2: false});
        Keyboard.dismiss();

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
                if(response.status === 200){
                    try {
                        if(response.data.errors.error[0].status === 400){
                            Alert.alert("Sizzle","Your searched returned 0 results. Try again.");
                        }
                    }catch (error) {
                        await this.setState({data: response.data})
                        this.setState({renderData0: true})
                        console.log("RECIPE (YUMMLY): Search success.")
                    }
                }
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
                this.setState({renderData1: true})
                console.log("RECIPE (EDAMAM): Search success.")
            }.bind(this)).catch(function(error){
                Alert.alert("Sizzle",error.message)
            })
            this.setState({searching: false});
        }else{
            //search Firebase
            await searchMultiStartsAt({link: "recipes", child: "recipeName", search: this.state.text})
            .once("value",async function(snapshot){
                await this.setState({data: snapshotToArray(snapshot)});
                this.setState({renderData2: true})
            }.bind(this))
            this.setState({searching: false});
        }
        this.setState({searching: false});
    }

    addYummlyRecipe(recipe){
        this.state.recipes.push({recipeName: recipe.recipeName, type: "YUMMLY", recipe});
        this.setState({add: false, renderData0: false});
    }

    addEdamamRecipe(recipe){
        this.state.recipes.push({recipeName: recipe.label, type: "EDAMAM", recipe: { label: recipe.label, source: recipe.source, image: recipe.image, healthLabels: recipe.healthLabels, yield: recipe.yield, ingredientLines: recipe.ingredientLines, shareAs: recipe.shareAs, values: setEdamamValues(recipe.totalNutrients)}});
        this.setState({add: false,  renderData1: false});
    }

    addUserRecipe(recipe){
        this.state.recipes.push({recipeName: recipe.recipeName, type: "USER", recipe});
        this.setState({add: false,  renderData2: false});
    }

    async getYummlyValues(id){
        let recipe = { hostedLargeUrl: "", ingredientLines: [], sourceRecipeUrl: "", values: {} }
        await axios.get(yummly.get+id+"?",
                {
                    params:{
                        _app_id: yummly.id,
                        _app_key: yummly.api_key,
                    }
                }
            ).then(async function(response){
                try {
                    if(response.data.errors.error[0].status === 400){
                        console.log("An error occurred.");
                    }
                }catch (error) {
                    let data = response.data;
                    recipe.hostedLargeUrl = data.images[0].hostedLargeUrl;
                    recipe.ingredientLines = data.ingredientLines;
                    recipe.sourceRecipeUrl = data.source.sourceRecipeUrl;
                    recipe.values = setYummlyValues(data.nutritionEstimates);
                    console.log("RECIPE: GET success.");
                }
            }.bind(this))

            return recipe;
    }

    async handleAddMeal(){
        Keyboard.dismiss();

        if(this.state.mealPlanName === ""){
            Alert.alert("Sizzle","Please provide a Meal Plan Name.");
            return;
        }
        if(this.state.recipes.length < 1){
            Alert.alert("Sizzle","Please add Recipe/s for the Meal Plan.");
            return;
        }

        this.setState({loading: true});

        //FETCH YUMMLY RECIPE VALUES
        for(let index = 0; index < this.state.recipes.length; index++) {
            if(this.state.recipes[index].type === "YUMMLY"){
                let toReturn = await this.getYummlyValues(this.state.recipes[index].recipe.id);
                this.state.recipes[index].recipe.values = toReturn.values;
                this.state.recipes[index].recipe.hostedLargeUrl = toReturn.hostedLargeUrl;
                this.state.recipes[index].recipe.sourceRecipeUrl = toReturn.sourceRecipeUrl;
                this.state.recipes[index].recipe.ingredientLines = toReturn.ingredientLines;
                
                delete this.state.recipes[index].recipe['ingredients']
                delete this.state.recipes[index].recipe['imageUrlsBySize']
                delete this.state.recipes[index].recipe['attributes']
                delete this.state.recipes[index].recipe['flavors']
            }
        }
        
        insert({link:"meals", data: {mealPlanName: this.state.mealPlanName, recipes: this.state.recipes, username: this.props.state.user.username, userUrl: this.props.state.user.image} })
        .then(function(response){
            Alert.alert("Sizzle","Upload successful.")
            this.setState({loading: false});
            this.props.navigation.pop();
        }.bind(this))


        this.setState({loading: false});
    }

    render(){
        return(
            <View>

                <Overlay isVisible={this.state.add} height="auto">
                    <View>
                        <H2>Add Recipe</H2>
                        <Form style={styles.form}>
                            <View style={styles.formView}>
                                <Item stackedLabel rounded style={{width: 200}}>
                                    <Label>  Recipe</Label>
                                    <Input value={this.state.text} onChangeText={(text)=>{this.setState({text})}}/>
                                </Item>
                                <Button rounded bordered warning style={{alignSelf: "center", marginLeft: 10}} onPress={()=>this.handleSearch()}>
                                    <Icon type="Octicons" name="search"/>
                                </Button>
                            </View>
                            <Text note>Recipe Pool</Text>
                            <Item rounded>
                                <Picker mode="dropdown" selectedValue={this.state.selected} onValueChange={(selected)=>{this.setState({selected})}}>
                                    <Picker.Item key={0} label={"Recipes by Yummly"} value={0}/>
                                    <Picker.Item key={1} label={"Recipes by Edamam"} value={1}/>
                                    <Picker.Item key={2} label={"Recipes by Sizzle Users"} value={2}/>
                                </Picker>
                            </Item>
                        </Form>
                        <ScrollView style={styles.formScroll}>
                        {//YUMMLY
                            this.state.renderData0 ? 
                            <List>
                                {
                                    this.state.data.matches.map((item)=>{
                                        return(
                                            <ListItem key={item.id} button={true} onPress={()=>this.addYummlyRecipe(item)} style={styles.listItem}>
                                                <Thumbnail small source={{uri: item.imageUrlsBySize[90]}}/>
                                                <Text note> {item.recipeName.length > 25 ? item.recipeName.substr(0,25)+"..." : item.recipeName}</Text>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                            :null 
                        }

                        {//EDAMAM
                            this.state.renderData1 ? 
                            <List>
                                {
                                    this.state.data.map((item,index)=>{
                                        return(
                                            <ListItem key={index} button={true} onPress={()=>this.addEdamamRecipe(item.recipe)} style={styles.listItem}>
                                                <Thumbnail small source={{uri: item.recipe.image}}/>
                                                <Text note> {item.recipe.label.length > 25 ? item.recipe.label.substr(0,25)+"..." : item.recipe.label}</Text>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                            :null 
                        }
    
                        {//FIREBASE
                            this.state.renderData2 ? 
                            <List>
                                {
                                    this.state.data.map((item,index)=>{
                                        return(
                                            <ListItem key={index} button={true} onPress={()=>this.addUserRecipe(item)} style={styles.listItem}>
                                                <Thumbnail small source={{uri: item.url}}/>
                                                <Text note> {item.recipeName.length > 25 ? item.recipeName.substr(0,25)+"..." : item.recipeName}</Text>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                            :null 
                        }

                        {
                            this.state.searching === true ? <Spinner color="blue"/> : null
                        }
                        </ScrollView>
                        <View style={styles.formView}>
                            <Button transparent onPress={()=>this.setState({add: false})}>
                                <Text>Back</Text>
                            </Button>
                        </View>
                    </View>
                </Overlay>

                <Overlay isVisible={this.state.loading} height="100%" width="100%" overlayBackgroundColor="#2c3e50" overlayStyle={{opacity: 0.5}}>
                    <View style={{alignItems: 'stretch', flex: 1, justifyContent: 'center'}}>
                        <Spinner color="white" size="large"/>
                        <Text style={{color: "white", textAlign: "center"}}>Uploading</Text>
                    </View>
                </Overlay>

                <Form>
                    <Item stackedLabel>
                        <Label>Meal Plan Name</Label>
                        <Input style={styles.input} placeholder={"My First Meal Plan"} value={this.state.mealPlanName} onChangeText={(mealPlanName)=> this.setState({mealPlanName})} maxLength={50}/>
                    </Item>
                </Form>
                <View style={styles.view}>
                    <Text style={styles.viewHeader}>Recipe/s</Text>
                    <List
                    leftOpenValue={75}
                    rightOpenValue={-75}
                    dataSource={this.ds.cloneWithRows(this.state.recipes)}
                    renderRow={
                        data=>
                            <ListItem>
                                <Text style={styles.text}>{(this.state.recipes.indexOf(data)+1)+") "+(data.recipeName > 50 ? data.recipeName.slice(0,50)+"..." : data.recipeName)}</Text>
                            </ListItem>
                    }
                    renderLeftHiddenRow={data =>
                        <Button full onPress={() => this.handleOpenRecipe(data)}>
                           <Icon active type="Feather" name="info" />
                        </Button>
                    }
                    renderRightHiddenRow={(data,secId,rowId,rowMap)=>
                        <Button full danger onPress={() => Alert.alert("Sizzle", "Delete Recipe "+(parseInt(rowId)+1)+"?",[{ text: 'Cancel',style: 'cancel',},{text: 'OK', onPress: () => this.handleDeleteRecipe(rowId)}],{cancelable: true})}>
                            <Icon active name="trash" />
                        </Button>
                    }

                    />
                    <Button iconRight danger block style={styles.button} onPress={()=>this.handleAddRecipe()}>
                        <Text>ADD RECIPE</Text>
                        <Icon active type="MaterialCommunityIcons" name="silverware-spoon"/>
                    </Button>
                </View>
                <View style={styles.view}>
                    <Button rounded style={{justifyContent: "center", alignSelf: "center", width: 200}} onPress={()=>this.handleAddMeal()}>
                        <Text>ADD MEAL</Text>
                    </Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input:{
        color:'#000',
        fontSize: 18,
    },
    text:{
        fontFamily: 'geoSansLightOblique'
    },
    view:{
        paddingVertical: 10,
    },
    viewHeader:{
        color: "gray",
        alignSelf: "center"
    },
    button:{
        width: 200,
        alignSelf: "center",
        marginTop: 5
    },
    formScroll:{
        width: 280, 
        height: 250,
        borderWidth: 1,
        borderColor: "gray",
        marginTop: 10
    },
    formView:{
        flexDirection: 'row',
        marginTop: 20
    },  
    formButton:{
        position: "absolute",
        right: 10
    },
    form:{
        flexDirection: "column",
    },
    listItem:{
        maxWidth: 270
    }
})

const mapStateToProps = state => {
    return state
}

const NewMealPlanPage = connect(mapStateToProps)(NewMealPlan);

export default NewMealPlanPage;