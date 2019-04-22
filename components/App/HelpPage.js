import React, { Component } from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import { View, Text, H2, H3 } from 'native-base';

const autoBind = require('auto-bind');

export default class HelpPage extends Component{
    constructor(props){
        super(props)
        this.state={
            
        }
        autoBind(this)
    }


    render(){
        return(
            <ScrollView style={styles.scrollView}>
                    <H2 style={styles.h2}>Recipe</H2>
                        <H3 style={styles.h3}>Open Recipe</H3>
                            <Text style={styles.text}>1. Tap the image on the Recipe Card</Text>
                            <Text style={styles.text}>2. Information about the recipe's ingredients, and badges will be shown.</Text>
                            <Image source={require('../../assets/gifs/recipe_open.gif')} style={styles.recipeOpen} />
                        <H3 style={styles.h3}>Creating New Recipe</H3>
                            <Text style={styles.text}>1. On your Profile, tap the floating + button and tap the New Recipe icon.</Text>
                            <Image source={require('../../assets/gifs/open_recipe.gif')} style={styles.openRecipe} />
                            <Text style={styles.text}>2. Fill out the Recipe name.</Text>
                            <Image source={require('../../assets/gifs/recipe_name.gif')} style={styles.recipeName} />
                            <Text style={styles.text}>3. Upload a picture of the Recipe.</Text>
                            <Image source={require('../../assets/gifs/recipe_pickImage.jpg')} style={styles.recipeImage} />
                            <Text style={styles.text}>4. Add an Ingredient by tapping the Add Ingredient Button. You may opt to add your own ingredient but take note that at least 75% of all the Ingredients must be obtained from the Food Database.</Text>
                            <Image source={require('../../assets/gifs/recipe_addIngredient.jpg')} style={styles.recipeImage} />
                            <Text style={styles.text}>5. Add a Step to the Recipe by tapping the Add Step Button.</Text>
                            <Image source={require('../../assets/gifs/recipe_addSteps.jpg')} style={styles.recipeImage} />
                            <Text style={styles.text}>6. You may Edit/Delete both the Recipe/Step by swiping rightward/leftward and clicking on the icon of the desired function.</Text>
                            <Image source={require('../../assets/gifs/recipe_ingredient.gif')} style={styles.scrollables} />
                            <Image source={require('../../assets/gifs/recipe_steps.gif')} style={styles.scrollables} />
                            <Text style={styles.text}>7. Choose a color for the Card presentation of your Recipe Steps.</Text>
                            <Image source={require('../../assets/gifs/recipe_color.gif')} style={styles.scrollables} />
                            <Text style={styles.text}>8. Tap Add Recipe to upload your Recipe.</Text>
                    <View style={{ borderBottomColor: 'black', borderBottomWidth: 2, marginVertical: 5}}/>
                    <H2 style={styles.h2}>Meal Plan</H2>
                        <H3 style={styles.h3}>Creating New Meal Plan</H3>
                            <Text style={styles.text}>1. On your Profile, tap the floating + button and tap the New Meal Plan icon.</Text>
                            <Image source={require('../../assets/gifs/mealPlan_name.gif')} style={styles.recipeName} />
                            <Text style={styles.text}>2. Fill out the Meal Plan name.</Text>
                            <Image source={require('../../assets/gifs/mealPlan_recipe.gif')} style={styles.scrollables} />
                            <Text style={styles.text}>3. Add a Recipe to the Meal Plan by tapping the Add Recipe Button.</Text>
                            <Image source={require('../../assets/gifs/mealPlan_addRecipe.jpg')} style={styles.addRecipe} />
                            <Text style={styles.text}>4. Tap Add Meal to upload your Meal Plan.</Text>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    h2:{
        marginTop: 10,
        fontFamily: "geoSansLight",
        alignSelf: "center"
    },
    h3:{
        fontFamily: "geoSansLightOblique"
    },
    recipeOpen:{
        width: 150,
        height: 251,
        marginVertical: 10,
        alignSelf:"center"
    },
    openRecipe:{
        width: 140, 
        height: 250,
        alignSelf:"center"
    },
    scrollables:{
        width: 300, 
        height: 76, 
        marginVertical: 10,
        alignSelf:"center"
    },
    scrollView:{
        marginVertical: 15, 
    },
    recipeName:{
        width: 300,
        height: 77,
        alignSelf:"center"
    },
    recipeImage:{
        width: 150,
        height: 56,
        alignSelf:"center"
    },
    addRecipe:{
        width: 150,
        height: 36,
        alignSelf:"center"
    },
    text:{
        textAlignVertical: "center",
        marginVertical: 5
    }
})