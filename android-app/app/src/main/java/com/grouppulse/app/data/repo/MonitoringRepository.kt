package com.grouppulse.app.data.repo

import com.grouppulse.app.data.local.KeywordRuleDao
import com.grouppulse.app.data.local.MatchEventDao
import com.grouppulse.app.data.local.MatchEventEntity
import com.grouppulse.app.data.local.MonitoredGroupDao
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MonitoringRepository @Inject constructor(
    private val monitoredGroupDao: MonitoredGroupDao,
    private val keywordRuleDao: KeywordRuleDao,
    private val matchEventDao: MatchEventDao,
) {
    suspend fun activeGroupName(): String? = monitoredGroupDao.getActiveGroup()?.displayName

    suspend fun enabledRules() = keywordRuleDao.getEnabledRules()

    suspend fun saveEvent(event: MatchEventEntity) = matchEventDao.insert(event)

    fun observeHistory(): Flow<List<MatchEventEntity>> = matchEventDao.observeAll()
}
