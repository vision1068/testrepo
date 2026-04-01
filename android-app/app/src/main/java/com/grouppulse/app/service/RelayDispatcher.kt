package com.grouppulse.app.service

import android.content.Context
import android.content.Intent
import javax.inject.Inject

class RelayDispatcher @Inject constructor() {
    fun launchWhatsAppShare(context: Context, message: String) {
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, message)
            `package` = "com.whatsapp"
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }
}
