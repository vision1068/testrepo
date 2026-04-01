package com.grouppulse.app.service

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import com.grouppulse.app.data.local.MatchEventEntity
import com.grouppulse.app.data.repo.MonitoringRepository
import com.grouppulse.app.domain.KeywordMatcher
import com.grouppulse.app.model.ActionMode
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

@AndroidEntryPoint
class WhatsAppNotificationListenerService : NotificationListenerService() {

    @Inject lateinit var repository: MonitoringRepository
    @Inject lateinit var keywordMatcher: KeywordMatcher

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        if (sbn.packageName != "com.whatsapp") return

        val extras = sbn.notification.extras
        val title = extras.getCharSequence(Notification.EXTRA_TITLE)?.toString().orEmpty()
        val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString().orEmpty()
        if (text.isBlank()) return

        serviceScope.launch {
            val group = repository.activeGroupName() ?: return@launch
            if (!title.contains(group, ignoreCase = true)) return@launch

            val rules = repository.enabledRules()
            val matches = keywordMatcher.detectMatches(text, rules)
            if (matches.isEmpty()) return@launch

            repository.saveEvent(
                MatchEventEntity(
                    groupName = title,
                    senderName = null,
                    messageText = text,
                    matchedKeywordsCsv = matches.joinToString(",") { it.keyword },
                    actionMode = ActionMode.NOTIFY_LOG,
                    sourcePackage = sbn.packageName,
                    notificationKey = sbn.key,
                    detectedAt = System.currentTimeMillis(),
                )
            )
        }
    }
}
