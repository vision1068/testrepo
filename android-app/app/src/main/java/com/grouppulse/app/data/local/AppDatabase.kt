package com.grouppulse.app.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import com.grouppulse.app.model.ActionMode
import com.grouppulse.app.model.MatchType
import com.grouppulse.app.model.RelayChannel

@Database(
    entities = [
        MonitoredGroupEntity::class,
        KeywordRuleEntity::class,
        RelayTargetEntity::class,
        MatchEventEntity::class,
    ],
    version = 1,
    exportSchema = false,
)
@TypeConverters(DbConverters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun monitoredGroupDao(): MonitoredGroupDao
    abstract fun keywordRuleDao(): KeywordRuleDao
    abstract fun relayTargetDao(): RelayTargetDao
    abstract fun matchEventDao(): MatchEventDao
}

class DbConverters {
    @TypeConverter
    fun toMatchType(value: String): MatchType = MatchType.valueOf(value)

    @TypeConverter
    fun fromMatchType(value: MatchType): String = value.name

    @TypeConverter
    fun toActionMode(value: String): ActionMode = ActionMode.valueOf(value)

    @TypeConverter
    fun fromActionMode(value: ActionMode): String = value.name

    @TypeConverter
    fun toRelayChannel(value: String): RelayChannel = RelayChannel.valueOf(value)

    @TypeConverter
    fun fromRelayChannel(value: RelayChannel): String = value.name
}
