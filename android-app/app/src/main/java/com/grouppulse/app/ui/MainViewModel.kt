package com.grouppulse.app.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.grouppulse.app.data.local.MatchEventEntity
import com.grouppulse.app.data.repo.MonitoringRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn

@HiltViewModel
class MainViewModel @Inject constructor(
    repository: MonitoringRepository,
) : ViewModel() {
    val history: StateFlow<List<MatchEventEntity>> = repository.observeHistory()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
}
