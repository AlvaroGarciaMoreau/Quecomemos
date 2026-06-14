package com.moreausoft.quecomemos

import android.content.res.ColorStateList
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.widget.CheckBox
import android.widget.LinearLayout
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import android.content.Context
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import com.moreausoft.quecomemos.data.DietDay
import com.moreausoft.quecomemos.data.DietMeal
import com.moreausoft.quecomemos.data.DietRepository
import com.moreausoft.quecomemos.data.ShoppingCategory
import com.moreausoft.quecomemos.ui.DietViewModel

class MainActivity : AppCompatActivity() {

    private lateinit var viewModel: DietViewModel
    private var dayButtons = ArrayList<TextView>()
    
    // UI Outlets
    private lateinit var btnShoppingList: MaterialButton
    private lateinit var selectedDayLabel: TextView
    private lateinit var cardDesayuno: MaterialCardView
    private lateinit var cardMediaManana: MaterialCardView
    private lateinit var cardAlmuerzo: MaterialCardView
    private lateinit var cardMerienda: MaterialCardView
    private lateinit var cardCena: MaterialCardView
    
    private lateinit var txtDesayunoDishes: TextView
    private lateinit var txtDesayunoKcal: TextView
    private lateinit var txtMediaMananaDishes: TextView
    private lateinit var txtMediaMananaKcal: TextView
    private lateinit var txtAlmuerzoDishes: TextView
    private lateinit var txtAlmuerzoKcal: TextView
    private lateinit var txtMeriendaDishes: TextView
    private lateinit var txtMeriendaKcal: TextView
    private lateinit var txtCenaDishes: TextView
    private lateinit var txtCenaKcal: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        
        // Window insets setup
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main) ?: window.decorView) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Initialize Repository and ViewModel
        val repository = DietRepository(this)
        viewModel = DietViewModel(repository)

        // Bind Views
        bindViews()
        
        // Setup Day Selection Listeners
        setupDayButtons()

        // Observe LiveData
        viewModel.selectedDay.observe(this) { day ->
            updateUI(day)
        }

        // Bind shopping list button click
        btnShoppingList.setOnClickListener {
            viewModel.shoppingList.value?.let { categories ->
                showShoppingList(categories)
            }
        }

        // Load diet data
        viewModel.loadDiet()
    }

    private fun bindViews() {
        btnShoppingList = findViewById(R.id.btn_shopping_list)
        selectedDayLabel = findViewById(R.id.selected_day_label)
        
        cardDesayuno = findViewById(R.id.card_desayuno)
        cardMediaManana = findViewById(R.id.card_media_manana)
        cardAlmuerzo = findViewById(R.id.card_almuerzo)
        cardMerienda = findViewById(R.id.card_merienda)
        cardCena = findViewById(R.id.card_cena)
        
        txtDesayunoDishes = findViewById(R.id.desayuno_dishes)
        txtDesayunoKcal = findViewById(R.id.desayuno_kcal)
        txtMediaMananaDishes = findViewById(R.id.media_manana_dishes)
        txtMediaMananaKcal = findViewById(R.id.media_manana_kcal)
        txtAlmuerzoDishes = findViewById(R.id.almuerzo_dishes)
        txtAlmuerzoKcal = findViewById(R.id.almuerzo_kcal)
        txtMeriendaDishes = findViewById(R.id.merienda_dishes)
        txtMeriendaKcal = findViewById(R.id.merienda_kcal)
        txtCenaDishes = findViewById(R.id.cena_dishes)
        txtCenaKcal = findViewById(R.id.cena_kcal)
        
        dayButtons.add(findViewById(R.id.day_1_btn))
        dayButtons.add(findViewById(R.id.day_2_btn))
        dayButtons.add(findViewById(R.id.day_3_btn))
        dayButtons.add(findViewById(R.id.day_4_btn))
        dayButtons.add(findViewById(R.id.day_5_btn))
        dayButtons.add(findViewById(R.id.day_6_btn))
        dayButtons.add(findViewById(R.id.day_7_btn))
    }

    private fun setupDayButtons() {
        for (i in 0 until dayButtons.size) {
            dayButtons[i].setOnClickListener {
                viewModel.selectDay(i + 1)
            }
        }
    }

    private fun updateUI(day: DietDay) {
        selectedDayLabel.text = "${day.name} - Dieta Personalizada"
        
        // Highlight active day button
        for (i in 0 until dayButtons.size) {
            val button = dayButtons[i]
            if (i + 1 == day.day) {
                button.setBackgroundResource(R.drawable.day_pill_selected)
                button.setTextColor(resources.getColor(R.color.day_selected_text, theme))
            } else {
                button.setBackgroundResource(R.drawable.day_pill_unselected)
                button.setTextColor(resources.getColor(R.color.day_unselected_text, theme))
            }
        }

        // Desayuno
        val desayuno = day.meals["Desayuno"]
        if (desayuno != null) {
            txtDesayunoDishes.text = desayuno.dishes.joinToString(" + ") { it.name }
            txtDesayunoKcal.text = "${desayuno.getKcalSummary()} kcal"
            cardDesayuno.setOnClickListener { showMealDetails("Desayuno", desayuno) }
        }

        // Media mañana
        val mediaManana = day.meals["Media mañana"]
        if (mediaManana != null) {
            txtMediaMananaDishes.text = mediaManana.dishes.joinToString(" + ") { it.name }
            txtMediaMananaKcal.text = "${mediaManana.getKcalSummary()} kcal"
            cardMediaManana.setOnClickListener { showMealDetails("Media mañana", mediaManana) }
        }

        // Almuerzo
        val almuerzo = day.meals["Almuerzo"]
        if (almuerzo != null) {
            txtAlmuerzoDishes.text = almuerzo.dishes.joinToString(" + ") { it.name }
            txtAlmuerzoKcal.text = "${almuerzo.getKcalSummary()} kcal"
            cardAlmuerzo.setOnClickListener { showMealDetails("Almuerzo", almuerzo) }
        }

        // Merienda
        val merienda = day.meals["Merienda"]
        if (merienda != null) {
            txtMeriendaDishes.text = merienda.dishes.joinToString(" + ") { it.name }
            txtMeriendaKcal.text = "${merienda.getKcalSummary()} kcal"
            cardMerienda.setOnClickListener { showMealDetails("Merienda", merienda) }
        }

        // Cena
        val cena = day.meals["Cena"]
        if (cena != null) {
            txtCenaDishes.text = cena.dishes.joinToString(" + ") { it.name }
            txtCenaKcal.text = "${cena.getKcalSummary()} kcal"
            cardCena.setOnClickListener { showMealDetails("Cena", cena) }
        }
    }

    private fun showMealDetails(mealName: String, meal: DietMeal) {
        val bottomSheetDialog = BottomSheetDialog(this)
        val view = layoutInflater.inflate(R.layout.bottom_sheet_meal_detail, null)
        bottomSheetDialog.setContentView(view)

        val txtTitle = view.findViewById<TextView>(R.id.detail_meal_title)
        val txtKcal = view.findViewById<TextView>(R.id.detail_meal_kcal)
        
        val txtProtein = view.findViewById<TextView>(R.id.detail_macro_protein)
        val txtCarbs = view.findViewById<TextView>(R.id.detail_macro_carbs)
        val txtFat = view.findViewById<TextView>(R.id.detail_macro_fat)
        val macrosLayout = view.findViewById<LinearLayout>(R.id.macros_layout)
        
        val dishesContainer = view.findViewById<LinearLayout>(R.id.dishes_container)
        val txtAlternativesList = view.findViewById<TextView>(R.id.detail_alternatives_list)
        val alternativesHeader = view.findViewById<TextView>(R.id.alternatives_header)
        val alternativesDivider = view.findViewById<View>(R.id.alternatives_divider)

        // Set meal type details
        val mealIcons = mapOf(
            "Desayuno" to "🍳 Desayuno",
            "Media mañana" to "🍎 Media mañana",
            "Almuerzo" to "🍲 Almuerzo",
            "Merienda" to "🥛 Merienda",
            "Cena" to "🥗 Cena"
        )
        txtTitle.text = mealIcons[mealName] ?: mealName
        txtKcal.text = "${meal.getKcalSummary()} kcal"

        // Set macros if present
        if (meal.getProteinSummary().isNotEmpty()) {
            macrosLayout.visibility = View.VISIBLE
            txtProtein.text = meal.getProteinSummary()
            txtCarbs.text = meal.getCarbsSummary()
            txtFat.text = meal.getFatSummary()
        } else {
            macrosLayout.visibility = View.GONE
        }

        // Inflate each dish block dynamically
        dishesContainer.removeAllViews()
        for (dish in meal.dishes) {
            val dishView = layoutInflater.inflate(R.layout.item_dish_detail, null)
            
            val txtDishName = dishView.findViewById<TextView>(R.id.dish_name)
            val txtDishElab = dishView.findViewById<TextView>(R.id.dish_elaboration)
            val elabSection = dishView.findViewById<LinearLayout>(R.id.elaboration_section)
            val checkboxContainer = dishView.findViewById<LinearLayout>(R.id.ingredients_checkbox_container)
            val ingredientsLabel = dishView.findViewById<TextView>(R.id.ingredients_label)
            
            txtDishName.text = dish.name
            
            // Populate ingredients checkbox list
            if (dish.ingredients.isNotEmpty()) {
                ingredientsLabel.visibility = View.VISIBLE
                checkboxContainer.visibility = View.VISIBLE
                
                // Ingredients are comma separated in our compiled JSON
                val ingredientsList = dish.ingredients.split(",")
                for (ing in ingredientsList) {
                    val trimmedIng = ing.trim()
                    if (trimmedIng.isNotEmpty()) {
                        val checkBox = CheckBox(this)
                        checkBox.text = trimmedIng
                        checkBox.setTextColor(resources.getColor(R.color.text_primary, theme))
                        checkBox.buttonTintList = ColorStateList.valueOf(resources.getColor(R.color.teal_accent, theme))
                        checkBox.textSize = 14f
                        checkBox.setPadding(8, 8, 8, 8)
                        
                        checkboxContainer.addView(checkBox)
                    }
                }
            } else {
                ingredientsLabel.visibility = View.GONE
                checkboxContainer.visibility = View.GONE
            }

            // Populate elaboration
            if (dish.elaboration.isNotEmpty()) {
                elabSection.visibility = View.VISIBLE
                txtDishElab.text = dish.elaboration
            } else {
                elabSection.visibility = View.GONE
            }

            dishesContainer.addView(dishView)
        }

        // Alternatives Section
        if (meal.alternatives.isNotEmpty()) {
            alternativesHeader.visibility = View.VISIBLE
            txtAlternativesList.visibility = View.VISIBLE
            alternativesDivider.visibility = View.VISIBLE
            
            txtAlternativesList.text = meal.alternatives.joinToString("\n") { "• $it" }
        } else {
            alternativesHeader.visibility = View.GONE
            txtAlternativesList.visibility = View.GONE
            alternativesDivider.visibility = View.GONE
        }

        bottomSheetDialog.show()
    }

    private fun showShoppingList(categories: List<ShoppingCategory>) {
        val bottomSheetDialog = BottomSheetDialog(this)
        val view = layoutInflater.inflate(R.layout.bottom_sheet_shopping_list, null)
        bottomSheetDialog.setContentView(view)

        val btnReset = view.findViewById<MaterialButton>(R.id.btn_reset_shopping_list)
        val shoppingListContainer = view.findViewById<LinearLayout>(R.id.shopping_list_container)

        val checkBoxes = ArrayList<CheckBox>()
        val prefs = getSharedPreferences("shopping_list_prefs", Context.MODE_PRIVATE)

        shoppingListContainer.removeAllViews()
        for (category in categories) {
            if (category.items.isEmpty()) continue
            
            val categoryView = layoutInflater.inflate(R.layout.item_shopping_category, null)
            val txtCategoryTitle = categoryView.findViewById<TextView>(R.id.category_title)
            val categoryItemsContainer = categoryView.findViewById<LinearLayout>(R.id.category_items_container)

            txtCategoryTitle.text = category.name

            for (item in category.items) {
                val checkBox = CheckBox(this)
                checkBox.text = item
                checkBox.setTextColor(resources.getColor(R.color.text_primary, theme))
                checkBox.buttonTintList = ColorStateList.valueOf(resources.getColor(R.color.teal_accent, theme))
                checkBox.textSize = 14f
                checkBox.setPadding(8, 8, 8, 8)

                val prefKey = "shopping_item_${category.name}_${item}"
                checkBox.isChecked = prefs.getBoolean(prefKey, false)

                checkBox.setOnCheckedChangeListener { _, isChecked ->
                    prefs.edit().putBoolean(prefKey, isChecked).apply()
                }

                checkBoxes.add(checkBox)
                categoryItemsContainer.addView(checkBox)
            }

            shoppingListContainer.addView(categoryView)
        }

        btnReset.setOnClickListener {
            for (cb in checkBoxes) {
                cb.isChecked = false
            }
            val editor = prefs.edit()
            val allEntries = prefs.all
            for (key in allEntries.keys) {
                if (key.startsWith("shopping_item_")) {
                    editor.remove(key)
                }
            }
            editor.apply()
        }

        bottomSheetDialog.show()
    }
}