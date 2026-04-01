package com.grouppulse.app.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.grouppulse.app.model.ActionMode
import com.grouppulse.app.model.MatchType
import com.grouppulse.app.model.RelayChannel

@Entity(tableName = "monitored_group")
data class MonitoredGroupEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val displayName: String,
    val matchContains: Boolean = false,
    val isActive: Boolean = true,
    val createdAt: Long,
    val updatedAt: Long,
)

@Entity(tableName = "keyword_rule")
data class KeywordRuleEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val groupId: Long,
    val keyword: String,
    val matchType: MatchType = MatchType.CONTAINS,
    val caseSensitive: Boolean = false,
    val enabled: Boolean = true,
    val createdAt: Long,
    val updatedAt: Long,
)

@Entity(tableName = "relay_target")
data class RelayTargetEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String? = null,
    val channel: RelayChannel,
    val targetValue: String,
    val enabled: Boolean = true,
    val createdAt: Long,
    val updatedAt: Long,
)

@Entity(tableName = "match_event")
data class MatchEventEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val groupName: String,
    val senderName: String?,
    val messageText: String,
    val matchedKeywordsCsv: String,
    val actionMode: ActionMode,
    val relayStatus: String? = null,
    val sourcePackage: String,
    val notificationKey: String?,
    val detectedAt: Long,
)
