package com.grouppulse.app.di

import android.content.Context
import androidx.room.Room
import com.grouppulse.app.data.local.AppDatabase
import com.grouppulse.app.data.local.KeywordRuleDao
import com.grouppulse.app.data.local.MatchEventDao
import com.grouppulse.app.data.local.MonitoredGroupDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, "grouppulse.db").build()

    @Provides
    fun provideMonitoredGroupDao(db: AppDatabase): MonitoredGroupDao = db.monitoredGroupDao()

    @Provides
    fun provideKeywordRuleDao(db: AppDatabase): KeywordRuleDao = db.keywordRuleDao()

    @Provides
    fun provideMatchEventDao(db: AppDatabase): MatchEventDao = db.matchEventDao()
}
