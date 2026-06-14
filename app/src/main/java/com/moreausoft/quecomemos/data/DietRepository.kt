package com.moreausoft.quecomemos.data

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class DietRepository(private val context: Context) {

    fun loadDietData(): List<DietDay> {
        val dietDays = mutableListOf<DietDay>()
        try {
            val jsonString = context.assets.open("diet_data.json").bufferedReader().use { it.readText() }
            val jsonArray = JSONArray(jsonString)
            
            for (i in 0 until jsonArray.length()) {
                val dayObj = jsonArray.getJSONObject(i)
                val day = dayObj.getInt("day")
                val name = dayObj.getString("name")
                val mealsObj = dayObj.getJSONObject("meals")
                
                val mealsMap = mutableMapOf<String, DietMeal>()
                val mealKeys = mealsObj.keys()
                while (mealKeys.hasNext()) {
                    val mealName = mealKeys.next()
                    val mealObj = mealsObj.getJSONObject(mealName)
                    
                    val dishesArray = mealObj.getJSONArray("dishes")
                    val dishes = mutableListOf<DietDish>()
                    for (j in 0 until dishesArray.length()) {
                        val dishObj = dishesArray.getJSONObject(j)
                        val dishName = dishObj.getString("name")
                        val ingredients = dishObj.optString("ingredients", "")
                        val elaboration = dishObj.optString("elaboration", "")
                        
                        val nutrientsObj = dishObj.optJSONObject("nutrients")
                        val nutrients = if (nutrientsObj != null) {
                            DietNutrients(
                                kcal = nutrientsObj.optInt("kcal", 0),
                                protein = nutrientsObj.optString("protein", ""),
                                carbs = nutrientsObj.optString("carbs", ""),
                                fat = nutrientsObj.optString("fat", "")
                            )
                        } else null
                        
                        dishes.add(DietDish(dishName, ingredients, elaboration, nutrients))
                    }
                    
                    val alternativesArray = mealObj.getJSONArray("alternatives")
                    val alternatives = mutableListOf<String>()
                    for (j in 0 until alternativesArray.length()) {
                        alternatives.add(alternativesArray.getString(j))
                    }
                    
                    mealsMap[mealName] = DietMeal(dishes, alternatives)
                }
                
                dietDays.add(DietDay(day, name, mealsMap))
            }
        } catch (e: IOException) {
            e.printStackTrace()
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return dietDays
    }

    fun loadShoppingList(): List<ShoppingCategory> {
        val categories = mutableListOf<ShoppingCategory>()
        try {
            val jsonString = context.assets.open("shopping_list.json").bufferedReader().use { it.readText() }
            val rootObj = JSONObject(jsonString)
            val categoriesArray = rootObj.getJSONArray("categories")
            
            for (i in 0 until categoriesArray.length()) {
                val catObj = categoriesArray.getJSONObject(i)
                val catName = catObj.getString("name")
                val itemsArray = catObj.getJSONArray("items")
                
                val itemsList = mutableListOf<String>()
                for (j in 0 until itemsArray.length()) {
                    itemsList.add(itemsArray.getString(j))
                }
                categories.add(ShoppingCategory(catName, itemsList))
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return categories
    }
}
