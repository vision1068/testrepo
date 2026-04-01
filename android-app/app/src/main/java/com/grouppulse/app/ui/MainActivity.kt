package com.grouppulse.app.ui

import android.content.Intent
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onStart() {
        super.onStart()
        setContent { GroupPulseApp() }
    }
}

@Composable
fun GroupPulseApp(viewModel: MainViewModel = hiltViewModel()) {
    val history by viewModel.history.collectAsState()
    var monitoringEnabled by remember { mutableStateOf(true) }
    val context = androidx.compose.ui.platform.LocalContext.current

    Scaffold { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text("GroupPulse", style = MaterialTheme.typography.headlineSmall)
            Text("WhatsApp keyword monitor (MVP scaffold)")

            RowToggle(
                enabled = monitoringEnabled,
                onToggle = { monitoringEnabled = it }
            )

            Button(onClick = {
                val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(intent)
            }) {
                Text("Open Notification Access Settings")
            }

            Text("Match history")
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(history) { event ->
                    Text("${event.groupName}: ${event.messageText}")
                }
            }
        }
    }
}

@Composable
private fun RowToggle(enabled: Boolean, onToggle: (Boolean) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(if (enabled) "Monitoring: ON" else "Monitoring: OFF")
        Switch(checked = enabled, onCheckedChange = onToggle)
    }
}
