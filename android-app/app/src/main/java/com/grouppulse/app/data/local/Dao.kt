package com.grouppulse.app.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface MonitoredGroupDao {
    @Query("SELECT * FROM monitored_group WHERE isActive = 1 LIMIT 1")
    suspend fun getActiveGroup(): MonitoredGroupEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: MonitoredGroupEntity): Long
}

@Dao
interface KeywordRuleDao {
    @Query("SELECT * FROM keyword_rule WHERE enabled = 1")
    suspend fun getEnabledRules(): List<KeywordRuleEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: KeywordRuleEntity): Long
}

@Dao
interface RelayTargetDao {
    @Query("SELECT * FROM relay_target WHERE enabled = 1")
    suspend fun getEnabledTargets(): List<RelayTargetEntity>
}

@Dao
interface MatchEventDao {
    @Query("SELECT * FROM match_event ORDER BY detectedAt DESC")
    fun observeAll(): Flow<List<MatchEventEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: MatchEventEntity): Long

    @Query("DELETE FROM match_event WHERE detectedAt < :olderThan")
    suspend fun deleteOlderThan(olderThan: Long)
}
