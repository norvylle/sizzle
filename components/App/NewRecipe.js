import React, { Component } from 'react';
import { StyleSheet, ScrollView, ListView, Alert, Image } from 'react-native';
import { Text, Form, Item, Label, Input, Button, Icon, List, View, H2, Picker, Spinner, ListItem, Textarea, Radio, Left, Body, Right } from 'native-base';
import { Overlay } from 'react-native-elements';
import ColorPalette from 'react-native-color-palette';
import { ImagePicker, FileSystem } from 'expo'
import { units, usda } from './../Service/secret';
import { insert, searchSingle, update, exportPicture } from './../Service/Firebase'
import { postEdit } from './../Service/Reducer';
import { connect } from 'react-redux'

const autoBind = require('auto-bind');
const axios = require('axios');

class NewRecipe extends Component{
    constructor(props){
        super(props)
        this.state={
            recipeName: "",
            ingredients:[],
            steps:[],
            selectedColor: '#ce0e0e',
            exists: false,
            buttonText: "Add Recipe",
            image: null,
            //overlay
            header: "",
            currentIndex: -1,
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
            stepID: null
        }
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        autoBind(this)
    }

    handleOnOpenIngredient(){
        this.setState({IngredientVisible: true, header: "Add Ingredient", searchIngredient: [], searchResults: null, searching: false, quantity: "", unit: "c", search: "", ingredient: {ndbno: -1}})
    }

    async handleSubmitIngredient(){
        if(this.state.currentIndex != -1){
            this.state.ingredients.splice(this.state.currentIndex,1);
            this.setState({currentIndex: -1});
        }
        if(this.state.ingredient.ndbno === -1){
            if(this.state.ingredient.name == null && this.state.search != ""){
                await this.setState({ingredient: {ndbno: 0,name: this.state.search}})
            }
        }
        if((this.state.search === "" && this.state.ingredient.ndbno === -1) || this.state.quantity === ""){
            Alert.alert("Sizzle","Please input on the missing field/s.")
        }else{
            await this.state.ingredients.push({qty: parseFloat(this.state.quantity) , unit: this.state.unit, ingredient: this.state.ingredient})
            this.setState({IngredientVisible: false, searchIngredient: [], searchResults: null, searching: false, quantity: "", unit: "c", search: "", ingredient: {ndbno: -1}})
        }
    }


    async handleSearch(){
        await this.setState({searching: true, searchResults: null});
        await axios.get(usda.search,
            {
                params:{
                    api_key: usda.api_key,
                    ds: "Standard Reference",
                    format: "json",
                    max: 10,
                    q: this.state.search,
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
        this.setState({searching: false});
    }

    handleSelectIngredient(item){
        if(item === this.state.ingredient){
            this.setState({ingredient: {ndbno: -1}, search: ""})
        }
        else{
            this.setState({ingredient: item,search: item.name})
        }
    }

    async handleEditIngredient(data){
        await this.setState({quantity: data.qty.toString(), unit: data.unit, searchResults: [], ingredient: {ndbno: -1}, search: data.ingredient.name, currentIndex: this.state.ingredients.indexOf(data)});
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
            timeObject = {duration: parseFloat(this.state.duration), unit: this.state.radio}
        }

        if(this.state.currentIndex === -1){
            await this.state.steps.push({direction: this.state.direction, time: timeObject})
        }else{
            this.state.steps[this.state.currentIndex] = {direction: this.state.direction, time: timeObject};
        }
        
        this.setState({StepVisible: false, direction: "", duration: "", radio: "none",currentIndex: -1})
    }

    handleOnOpenStep(){
        this.setState({StepVisible: true, header: "Add Step (Step "+(this.state.steps.length+1)+")", direction: "", duration: "", radio: "none",currentIndex: -1})
    }

    async handleEditStep(data){
        if(data.time != null){
            await this.setState({duration: data.time.duration.toString(), radio: data.time.unit})
        }
        await this.setState({header: "Edit Step (Step "+(this.state.steps.indexOf(data)+1)+")", direction: data.direction})
        this.setState({StepVisible: true, currentIndex: this.state.steps.indexOf(data)})
    }

    handleDeleteStep(data){
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

    async handleAddRecipe(){
        if(this.state.recipeName === ""){
            Alert.alert("Sizzle","Please enter a Name for the Recipe");
            return;
        }
        if(this.state.ingredients.length === 0){
            Alert.alert("Sizzle","Please add an Ingredient");
            return;
        }
        if(this.state.steps.length === 0){
            Alert.alert("Sizzle","Please add a Step");
            return;
        }

        if(this.props.state.mode === "EDIT"){
            if(this.props.navigation.state.params.recipe.recipeName === this.state.recipeName && this.props.navigation.state.params.recipe.ingredients === this.state.ingredients && this.props.navigation.state.params.recipe.steps === this.state.steps &&this.props.navigation.state.params.recipe.color === this.state.selectedColor && this.props.navigation.state.params.recipe.recipeName_username === this.state.recipeName+"_"+this.props.state.username){
                this.props.navigation.navigate('Profile')
            }
            else{
                this.props.dispatch(postEdit());
                this.props.navigation.state.params.recipe.recipeName = this.state.recipeName;
                this.props.navigation.state.params.recipe.ingredients = this.state.ingredients;
                this.props.navigation.state.params.recipe.steps = this.state.steps;
                this.props.navigation.state.params.recipe.color = this.state.selectedColor;
                this.props.navigation.state.params.recipe.recipeName_username = this.state.recipeName+"_"+this.props.state.username;
                
                let data = JSON.parse(JSON.stringify(this.props.navigation.state.params.recipe));
                let key = data.key;
                delete data["key"]

                if(this.state.image != this.props.navigation.state.params.recipe.url){
                    let url = await exportPicture({link: this.props.state.username+"/recipes",child: this.state.recipeName, uri: this.state.image})
                    this.props.navigation.state.params.recipe.url = url;
                }

                if(update({link: "recipes/"+key, data: data})){
                    Alert.alert("Sizzle","Recipe updated");
                }

                this.props.navigation.navigate('Profile',{index: this.props.navigation.state.params.index, recipe: this.props.navigation.state.params.recipe})
            }
        }else{
            await searchSingle({link: "recipes",child: "recipeName_username",search: this.state.recipeName+"_"+this.props.state.username}).on('value',(snapshot) =>{ this.setState({exists: snapshot.exists()})})
            
            //is restriction to single recipe name to all necessary?

            if(this.state.exists){
                Alert.alert("Sizzle","Recipe name already exists.");
            }else{
                let url = await exportPicture({link: this.props.state.username+"/recipes",child: this.state.recipeName, uri: this.state.image})

                if(insert({link:"recipes/",data: { recipeName: this.state.recipeName , ingredients: this.state.ingredients, steps: this.state.steps, color: this.state.selectedColor, username: this.props.state.username, stars: 0, url: url, recipeName_username: this.state.recipeName+"_"+this.props.state.username} })){
                    Alert.alert("Sizzle","Recipe upload success!");
                    
                }
            }

        }
    }

    async pickImage(){
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
          });
          
          if (!result.cancelled) {
            this.setState({ image: result.uri });
          }
    }

    componentWillMount(){
        if(this.props.state.mode === "EDIT"){
            this.setState({buttonText: "Submit Edit/s", recipeName: this.props.navigation.state.params.recipe.recipeName, ingredients: this.props.navigation.state.params.recipe.ingredients, steps: this.props.navigation.state.params.recipe.steps, selectedColor: this.props.navigation.state.params.recipe.color, image: this.props.navigation.state.params.recipe.url})
        }else{
            this.setState({buttonText: "Add Recipe"})
        }
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
                            <View style={styles.formView}>
                                <Item stackedLabel rounded style={{width: 200}}>
                                    <Label>  Ingredient</Label>
                                    <Input value={this.state.search} onChangeText={(search)=>{this.setState({search})}}/>
                                </Item>
                                <Button rounded bordered warning style={{alignSelf: "center", marginLeft: 10}} onPress={()=>this.handleSearch()}>
                                    <Icon type="Octicons" name="search"/>
                                </Button>
                            </View>
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
                    <View>
                        <Image source={{uri: this.state.image}} style={styles.image}/>
                        <Button light iconRight style={{justifyContent: "center", alignSelf: "center", width: 200}} onPress={()=>this.pickImage()}>
                            <Text>Pick an Image</Text>
                            <Icon type="EvilIcons" name="image" />
                        </Button>
                    </View>
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
                        <Button rounded style={{justifyContent: "center", alignSelf: "center", width: 200}} onPress={()=>this.handleAddRecipe()}>
                            <Text>{this.state.buttonText}</Text>
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
    image:{
        height: 90, 
        width: 120,
        margin: 10,
        alignSelf: "center"
    },
    radioItem:{
        borderColor: "transparent",
        marginLeft: 5,
        alignItems: "center",
        marginTop: 5
    }
})

const mapStateToProps = state => {
    return state
}

const NewRecipePage = connect(mapStateToProps)(NewRecipe);

export default NewRecipePage;