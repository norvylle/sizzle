import React, { Component } from 'react';
import { StyleSheet, ScrollView, ListView, Alert } from 'react-native';
import { Text, Form, Item, Label, Input, Button, Icon, List, View, H2, Picker, Spinner, ListItem, Textarea, Radio, Left, Body, Right } from 'native-base';
import { Overlay } from 'react-native-elements';
import ColorPalette from 'react-native-color-palette';
import { units, usda } from './../Service/secret';
import { insert } from './../Service/Firebase'

const autoBind = require('auto-bind');
const axios = require('axios');

export default class NewRecipePage extends Component{
    constructor(props){
        super(props)
        this.state={
            recipeName: "",
            ingredients:[],
            steps:[],
            selectedColor: '#ce0e0e',
            //overlay
            header: "",
            //ingredient overlay
            IngredientVisible: false,
            searchIngredient: [],
            searchResults: null,
            searching: false,
            quantity: "",
            unit: "c",
            search: "",
            ingredient: {ndbno: -1},
            //step overlay
            StepVisible: false,
            direction: "",
            duration: "",
            radio: "none",
            stepID: null,
            deleting: false
        }
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        autoBind(this)
    }

    handleOnOpenIngredient(){
        this.setState({IngredientVisible: true, header: "Add Ingredient", searchIngredient: [], searchResults: null, searching: false, quantity: "", unit: "c", search: "", ingredient: {ndbno: -1}})
    }

    async handleSubmitIngredient(){
        if(this.state.ingredient.ndbno === -1){
            if(this.state.ingredient.name == null && this.state.search != ""){
                await this.setState({ingredient: {ndbno: 0,name: this.state.search}})
            }
        }
        if((this.state.search === "" && this.state.ingredient.ndbno === -1) || this.state.quantity === ""){
            Alert.alert("Sizzle","Please input on the missing field/s.")
        }else{
            await this.state.ingredients.push({qty: this.state.quantity, unit: this.state.unit, ingredient: this.state.ingredient})
            this.setState({IngredientVisible: false, searchIngredient: [], searchResults: null, searching: false, quantity: "", unit: "c", search: "", ingredient: {ndbno: -1}})
        }
    }


    async handleSearch(value){
        this.setState({search: value});
        if(value.length > 2){
            await this.setState({searching: true, searchResults: null});
            axios.get(usda.search,
                {
                    params:{
                        api_key: usda.api_key,
                        ds: "Standard Reference",
                        format: "json",
                        max: 10,
                        q: value,
                    }
                }
            )
            .then(function(response){
                if(response.status === 200){
                    try {
                        if(response.data.errors.error[0].status === 400){
                            //empty results
                        }
                    }catch (error) {
                        this.setState({searchResults: response.data.list.item})
                        console.log("SEARCH:",value)
                    }
                }
            }.bind(this))
            .catch(function(error){
                Alert.alert("Sizzle","An error occurred.")
            })
        }
        this.setState({searching: false});
    }

    handleSelectIngredient(item){
        if(item === this.state.ingredient){
            this.setState({ingredient: {ndbno: -1}})
        }
        else{
            this.setState({ingredient: item})
        }
    }

    async handleEditIngredient(data){
        this.state.ingredients.splice(this.state.ingredients.indexOf(data),1);
        await this.setState({quantity: data.qty, unit: data.unit, searchResults: [data.ingredient], ingredient: data.ingredient});
        this.setState({header: "Edit Ingredient", IngredientVisible: true})
    }

    handleDeleteIngredient(data){
        this.state.ingredients.splice(this.state.ingredients.indexOf(data),1);
        this.forceUpdate()
    }

    async handleSubmitStep(){
        let timeObject
        if(this.state.duration === "" || this.state.radio === "none"){
            timeObject = null
        }else{
            timeObject = {duration: this.state.duration, unit: this.state.radio}
        }

        if(this.state.stepID === null){
            await this.state.steps.push({direction: this.state.direction, time: timeObject})
        }else{
            this.state.steps[this.state.stepID] = {direction: this.state.direction, time: timeObject};
        }
        
        this.setState({StepVisible: false, direction: "", duration: "", radio: "none",stepID: null})
    }

    handleOnOpenStep(){
        this.setState({StepVisible: true, header: "Add Step (Step "+(this.state.steps.length+1)+")", direction: "", duration: "", radio: "none", stepID: null})
    }

    async handleEditStep(data){
        if(data.time != null){
            await this.setState({duration: data.time.duration, radio: data.time.unit})
        }
        await this.setState({header: "Edit Step (Step "+(this.state.steps.indexOf(data)+1)+")", direction: data.direction})
        this.setState({StepVisible: true, stepID: (this.state.steps.indexOf(data)+1) })
    }

    async handleDeleteStep(data){
        this.state.steps.splice(this.state.steps.indexOf(data),1);
        this.forceUpdate()
    }

    async convertNum (text,mode) {
        let dot = false;
        switch(mode){
            case 0:
                this.setState({
                    quantity: text.replace(/[^0-9]/g, function(match){
                        if(!dot && match === "."){
                            dot = true;
                            return match
                        }else{
                            return ""
                        }
                    })
                });
            break;
            case 1:
                this.setState({
                    duration: text.replace(/[^0-9]/g, function(match){
                        if(!dot && match === "."){
                            dot = true;
                            return match
                        }else{
                            return ""
                        }
                    })
                });
            break;
        }
    }

    handleAddRecipe(){

    }

    render(){    
        return(
            <ScrollView>
                <Overlay isVisible={this.state.IngredientVisible}>
                    <View>
                        <H2>{this.state.header}</H2>
                        <Form style={styles.form}>
                            <View style={styles.formView}>
                                <Item stackedLabel rounded style={{width: 100}}>
                                    <Label style={styles.formLabel}>Quantity</Label>
                                    <Input value={this.state.quantity} keyboardType="numeric" maxLength={8} onChangeText={(value)=>this.convertNum(value,0)}/>
                                </Item>
                                <Item rounded style={{width: 180}}>
                                    <Label>Unit</Label>
                                    <Picker mode="dropdown" selectedValue={this.state.unit} onValueChange={(unit)=>{
                                        this.setState({unit})
                                        }}>
                                        {
                                            units.map((unit)=>{
                                                return(<Picker.Item key={unit.abbr} label={unit.name+" ("+unit.abbr+")"} value={unit.abbr}/>)
                                            })
                                        }
                                    </Picker>
                                </Item>
                            </View>
                            <Item stackedLabel rounded style={styles.formIngredient}>
                                <Label>  Ingredient</Label>
                                <Input value={this.state.search} onChangeText={(value)=>{this.handleSearch(value)}}/>
                            </Item>
                            <Text style={{alignSelf:"center", color: "gray"}}>Suggestions</Text>
                            <ScrollView style={styles.formScroll}>
                                {
                                    this.state.searchResults === null ? 
                                    (this.state.searching === true ? <Spinner color="blue"/> : null)
                                    : 
                                    (
                                        <List>
                                        {
                                            this.state.searchResults.map((item)=>{
                                                return(
                                                    <ListItem key={item.ndbno} selected={item.ndbno === this.state.ingredient.ndbno} button={true} onPress={()=>this.handleSelectIngredient(item)}>
                                                        <Text>{item.name}</Text>
                                                    </ListItem>
                                                )
                                            })   
                                        }
                                        </List>
                                    )
                                    
                                }
                            </ScrollView>
                        </Form>
                        <View style={styles.formView}>
                            <Button transparent onPress={()=>this.setState({IngredientVisible: false})}>
                                <Text>Back</Text>
                            </Button>
                            <Button transparent onPress={()=>this.handleSubmitIngredient()} style={styles.formButton}>
                                <Text>Submit</Text>
                            </Button>
                        </View>
                    </View>
                </Overlay>

                <Overlay isVisible={this.state.StepVisible} height="auto">
                    <View>
                        <H2>{this.state.header}</H2>
                        <Textarea rowSpan={5} bordered placeholder={"Put directions here."} value={this.state.direction} onChangeText={(direction)=>this.setState({direction})} style={{marginTop:20}}/>
                        <Form style={styles.form}>
                            <Text style={{marginTop:20, textAlign:"center"}}>Optional</Text>
                            <View style={styles.formView}>
                                <Item stackedLabel rounded style={{width: 100}}>
                                    <Label> Duration</Label>
                                    <Input value={this.state.duration} keyboardType="numeric" maxLength={8} onChangeText={(value)=>this.convertNum(value,1)}/>
                                </Item>
                                <Item stackedLabel rounded style={{flexDirection: "column", width:150, marginLeft: 10}}>
                                    <Label>  Unit</Label>
                                    <Item style={styles.radioItem}>
                                        <Radio onPress={()=>{this.state.radio === "seconds" ? this.setState({radio: "none"}) : this.setState({radio: "seconds"})}} selected={this.state.radio === "seconds"} />
                                        <Text>  Seconds</Text>
                                    </Item>
                                    <Item style={styles.radioItem}>
                                            <Radio onPress={()=>{this.state.radio === "minutes" ? this.setState({radio: "none"}) : this.setState({radio: "minutes"})}} selected={this.state.radio === "minutes"} />
                                            <Text>  Minutes</Text>
                                    </Item>
                                    <Item style={styles.radioItem}>
                                        <Radio onPress={()=>{this.state.radio === "hours" ? this.setState({radio: "none"}) : this.setState({radio: "hours"})}} selected={this.state.radio === "hours"} />
                                        <Text>  Hours</Text>
                                    </Item>
                                </Item>
                            </View>
                        </Form>
                        <View style={styles.formView}>
                            <Button transparent onPress={()=>this.setState({StepVisible: false})}>
                                <Text>Back</Text>
                            </Button>
                            <Button transparent style={styles.formButton} onPress={()=>this.handleSubmitStep()}>
                                <Text>Submit</Text>
                            </Button>
                        </View>
                    </View>
                </Overlay>

                <Form>
                    <Item stackedLabel>
                        <Label>Recipe Name</Label>
                        <Input style={styles.input} placeholder={"My First Recipe"} value={this.state.recipeName} onChangeText={(recipeName)=> this.setState({recipeName})} maxLength={50}/>
                    </Item>
                    <View style={styles.view}>
                        <Text style={styles.viewHeader}>Ingredient</Text>
                        {
                            this.state.ingredients.length === 0 ? null :
                            <List
                            leftOpenValue={75}
                            rightOpenValue={-75}
                            dataSource={this.ds.cloneWithRows(this.state.ingredients)}
                            renderRow={
                                data=>
                                    <ListItem>
                                        <Text>{data.qty+data.unit+" "+(data.ingredient.name.length > 30 ? data.ingredient.name.slice(0,50)+"..." : data.ingredient.name)}</Text>
                                    </ListItem>
                            }
                            renderLeftHiddenRow={data =>
                                <Button full onPress={() =>this.handleEditIngredient(data)}>
                                <Icon active type="Feather" name="edit" />
                                </Button>
                            }
                            renderRightHiddenRow={data=>
                                <Button full danger onPress={() => Alert.alert("Sizzle", "Delete "+data.name+"?",[{ text: 'Cancel',style: 'cancel',},{text: 'OK', onPress: () => this.handleDeleteIngredient(data)},],{cancelable: true})}>
                                <Icon active name="trash" />
                                </Button>
                            }
                            style={{borderWidth: 0.5, borderColor: "green", width: "100%"}}
                            />
                        }
                        <Button iconRight success block style={styles.button} onPress={()=>this.handleOnOpenIngredient()}>
                            <Text>Add Ingredient</Text>
                            <Icon active type="FontAwesome" name="shopping-basket"/>
                        </Button>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.viewHeader}>Steps</Text>
                        {
                            (this.state.steps.length === 0)  ? null :
                            <List
                            leftOpenValue={75}
                            rightOpenValue={-75}
                            dataSource={this.ds.cloneWithRows(this.state.steps)}
                            renderRow={
                                data=>
                                    <ListItem>
                                        <Text>{(this.state.steps.indexOf(data)+1)+") "+(data.direction.length > 50 ? data.direction.slice(0,50)+"..." : data.direction)}</Text>
                                    </ListItem>
                            }
                            renderLeftHiddenRow={data =>
                                <Button full onPress={() => this.handleEditStep(data)}>
                                <Icon active type="Feather" name="edit" />
                                </Button>
                            }
                            renderRightHiddenRow={data=>
                                <Button full danger onPress={() => Alert.alert("Sizzle", "Delete Step "+(this.state.steps.indexOf(data)+1)+"?",[{ text: 'Cancel',style: 'cancel',},{text: 'OK', onPress: () => this.handleDeleteStep(data)}],{cancelable: true})}>
                                <Icon active name="trash" />
                                </Button>
                            }
                            style={{borderWidth: 0.5, borderColor: "green", width: "100%"}}
                            />
                        }
                        <Button iconRight info block style={styles.button} onPress={()=>this.handleOnOpenStep()}>
                            <Text>Add Step</Text>
                            <Icon active type="FontAwesome" name="list-ol"/>
                        </Button>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.viewHeader}>Step Card Color</Text>
                        <ColorPalette
                            onChange={selectedColor => this.setState({selectedColor})}
                            value={this.state.selectedColor}
                            colors={['#ce0e0e','#dd6808', '#afb207', '#109cb5', '#23187a', '#a33a89', '#000000']}
                            title={""}
                            icon={
                                <Icon type="Feather" name="check" style={{color:"white"}} />
                            }
                        />
                    </View>
                    <View style={styles.view}>
                        <Button rounded style={{justifyContent: "center", alignSelf: "center", width: 200}}>
                            <Text>Add Ingredient</Text>
                        </Button>
                    </View>
                </Form>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    input:{
        color:'#000',
        fontSize: 18,
    },
    item:{
        paddingVertical: 20,
        width: "100%"
    },
    view:{
        flexDirection: 'column',
        paddingVertical: 10,
        alignItems: "flex-start",
    },
    button:{
        width: 200,
        alignSelf: "center",
        marginTop: 5
    },
    form:{
        flexDirection: "column",
    },
    formView:{
        flexDirection: 'row',
        marginTop: 20
    },  
    formButton:{
        position: "absolute",
        right: 10
    },
    formLabel:{
        alignSelf: "center"
    },
    formIngredient:{
        width: 280,
        marginTop: 20
    },
    formScroll:{
        width: 280, 
        height: 250,
        borderWidth: 1,
        borderColor: "gray",
        marginTop: 10
    },
    viewHeader:{
        color: "gray",
        alignSelf: "center"
    },
    radioItem:{
        borderColor: "transparent",
        marginLeft: 5,
        alignItems: "center",
        marginTop: 5
    }
})