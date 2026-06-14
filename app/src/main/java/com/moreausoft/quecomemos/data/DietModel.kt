package com.moreausoft.quecomemos.data

import java.io.Serializable

data class DietDish(
    val name: String,
    val ingredients: String,
    val elaboration: String,
    val nutrients: DietNutrients?
) : Serializable

data class DietNutrients(
    val kcal: Int,
    val protein: String,
    val carbs: String,
    val fat: String
) : Serializable

data class DietMeal(
    val dishes: List<DietDish>,
    val alternatives: List<String>
) : Serializable {
    fun getKcalSummary(): Int {
        return dishes.firstOrNull()?.nutrients?.kcal ?: 0
    }
    
    fun getProteinSummary(): String {
        return dishes.firstOrNull()?.nutrients?.protein ?: ""
    }
    
    fun getCarbsSummary(): String {
        return dishes.firstOrNull()?.nutrients?.carbs ?: ""
    }
    
    fun getFatSummary(): String {
        return dishes.firstOrNull()?.nutrients?.fat ?: ""
    }
}

data class DietDay(
    val day: Int,
    val name: String,
    val meals: Map<String, DietMeal>
) : Serializable

data class ShoppingCategory(
    val name: String,
    val items: List<String>
) : Serializable
