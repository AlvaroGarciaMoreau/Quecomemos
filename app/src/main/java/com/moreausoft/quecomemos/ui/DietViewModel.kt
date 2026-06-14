package com.moreausoft.quecomemos.ui

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.moreausoft.quecomemos.data.DietDay
import com.moreausoft.quecomemos.data.DietRepository
import com.moreausoft.quecomemos.data.ShoppingCategory
import java.util.Calendar

class DietViewModel(private val repository: DietRepository) : ViewModel() {

    private val _dietDays = MutableLiveData<List<DietDay>>()
    val dietDays: LiveData<List<DietDay>> get() = _dietDays

    private val _selectedDay = MutableLiveData<DietDay>()
    val selectedDay: LiveData<DietDay> get() = _selectedDay

    private val _shoppingList = MutableLiveData<List<ShoppingCategory>>()
    val shoppingList: LiveData<List<ShoppingCategory>> get() = _shoppingList

    fun loadDiet() {
        val days = repository.loadDietData()
        _dietDays.value = days
        
        // Auto-select today's day of week
        val todayIndex = getTodayDayIndex() // 1 to 7
        val day = days.find { it.day == todayIndex } ?: days.firstOrNull()
        day?.let {
            _selectedDay.value = it
        }

        _shoppingList.value = repository.loadShoppingList()
    }

    fun selectDay(dayIndex: Int) {
        _dietDays.value?.find { it.day == dayIndex }?.let {
            _selectedDay.value = it
        }
    }

    private fun getTodayDayIndex(): Int {
        // Calendar.DAY_OF_WEEK: Sunday = 1, Monday = 2, ..., Saturday = 7
        // We want Monday = 1, Tuesday = 2, ..., Sunday = 7
        val calendar = Calendar.getInstance()
        val dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK)
        return when (dayOfWeek) {
            Calendar.MONDAY -> 1
            Calendar.TUESDAY -> 2
            Calendar.WEDNESDAY -> 3
            Calendar.THURSDAY -> 4
            Calendar.FRIDAY -> 5
            Calendar.SATURDAY -> 6
            Calendar.SUNDAY -> 7
            else -> 1
        }
    }
}
