# Software Requirements Document (SRD)
## Project: Android WhatsApp Group Keyword Monitor
## Version: 1.0 (MVP + Forward Design)
## Author: Senior Android Architecture & Product Design Draft
## Date: 2026-04-01

---

## 1) App Name Suggestions

1. **GroupPulse**
2. **WA Keyword Watch**
3. **SignalNest**
4. **PingPani**
5. **GroupSentinel**
6. **TriggerRelay**
7. **ChatBeacon**
8. **KeyAlert for WA**

> Recommended MVP name: **GroupPulse** (neutral brand, extensible beyond WhatsApp in future).

---

## 2) Business Idea Summary

### Problem
Users in high-traffic WhatsApp groups miss critical messages (e.g., urgent words like “pani”) because message volume is too high.

### Solution
An Android-only assistant app that monitors incoming WhatsApp message notifications for a selected group, detects configured keywords, then performs configured actions:
- Notify user immediately
- Notify + persist event log
- Notify + relay content (via compliant alternatives)

### Value Proposition
- Faster response to critical group triggers
- Reduced manual scanning effort
- Auditable event history for matched messages

### Target Users
- Community admins, family coordinators, volunteer groups, logistics coordinators, field operations teams.

### Monetization (optional future)
- Freemium: 1 group + 3 keywords free
- Pro: unlimited rules, advanced matching, cloud backup

---

## 3) Core Features

| Feature | Description | MVP | Notes |
|---|---|---:|---|
| Group monitoring | Monitor one WhatsApp group’s incoming messages via Android notification stream | ✅ | User already part of group |
| Keyword rules | Configure one or more keywords | ✅ | Designed for multi-keyword growth |
| Action modes | Notify only / Notify+log / Notify+relay | ✅ | Relay constrained by platform policy |
| Match history | Store matched events with timestamp | ✅ | Room DB |
| Monitoring toggle | Global enable/disable switch | ✅ | Persistent setting |
| Test mode | Simulate incoming messages for QA/user confidence | ✅ | No WhatsApp dependency |
| Recipient config | Configure one or more relay targets | ✅ | Channel-based target objects |
| Background operation | Continue monitoring with Notification Listener | ✅ | Subject to Android limitations |
| Rule management | Add/edit/delete keywords and targets | ✅ | Basic CRUD |
| Export logs | Export match history (CSV/JSON) | ❌ (Phase 2) | Future enhancement |

---

## 4) User Flow

1. **Onboarding**
   - Welcome + compliance note (what app can/cannot automate)
   - Request Notification Access permission
   - Optional: request Contacts permission (if user wants contact picker)

2. **Initial Setup Wizard**
   - Select monitored source app: WhatsApp
   - Enter/select target group display name
   - Add first keyword (example: “pani”)
   - Choose action mode
   - Add recipient target(s) if relay mode enabled
   - Enable monitoring toggle

3. **Runtime**
   - App listens for posted notifications from WhatsApp
   - Parses group sender/title + message body
   - Applies keyword detection rules
   - Triggers selected action
   - Logs match if configured

4. **Review**
   - User views history list of matches
   - Can filter by keyword/date/group/action status

5. **Maintenance**
   - Update keywords/targets
   - Pause/resume monitoring
   - Run test mode simulation

---

## 5) Screen-by-Screen UI Breakdown

### 5.1 Welcome & Compliance Screen
- Purpose: Explain capability boundaries and require explicit user acknowledgment.
- Components:
  - Intro text
  - “This app is not affiliated with WhatsApp” disclaimer
  - “Automatic WhatsApp sending may be restricted” note
  - CTA: Continue

### 5.2 Permissions Screen
- Components:
  - Notification Access status card
  - Button: Open system Notification Access settings
  - Optional Contacts access (for picking recipient names)
  - Diagnostics: “Listener active/inactive”

### 5.3 Setup Wizard
- Steps:
  1. Enter monitored group name (exact/contains mode)
  2. Add keyword(s)
  3. Choose action mode:
     - Only notify
     - Notify + save log
     - Notify + relay message
  4. Add recipient targets (for relay mode)
  5. Finish & enable monitoring

### 5.4 Home Dashboard
- Cards:
  - Monitoring toggle (ON/OFF)
  - Current monitored group
  - Active keywords count
  - Today’s match count
  - Quick actions: “Run test”, “View history”, “Edit rules”

### 5.5 Rules Management Screen
- Tabs:
  - Keywords
  - Recipients
- Keyword fields:
  - Text
  - Match type (exact/contains/regex future)
  - Case sensitivity toggle
  - Enabled toggle
- Recipient fields:
  - Channel type (in-app notify, SMS, email, share)
  - Target identifier (phone/email/contact)

### 5.6 Match History Screen
- List item:
  - Timestamp
  - Group
  - Message preview
  - Matched keyword(s)
  - Action result (notified/logged/relay-success/relay-failed)
- Filters: date range, keyword, status
- Detail screen for full message and debug metadata

### 5.7 Settings Screen
- General:
  - Monitor toggle
  - Battery optimization guidance
  - Quiet hours
- Detection:
  - Group matching strategy
  - Duplicate suppression window
- Actions:
  - Default mode
  - Relay confirmation requirement
- Data:
  - Retention policy
  - Clear logs
  - Export (future)

### 5.8 Test Mode Screen
- Inputs:
  - Mock group name
  - Mock sender
  - Mock message content
- Button: Simulate
- Output: Matched keyword + triggered action preview

---

## 6) Technical Architecture

Architecture pattern: **Clean-ish MVVM with Repository + UseCases**

### Layers
1. **Presentation**
   - Jetpack Compose UI (or XML + ViewBinding fallback)
   - ViewModel + StateFlow
2. **Domain**
   - Use cases: ParseNotification, MatchKeywords, ExecuteAction, LogEvent
3. **Data**
   - Room database
   - DataStore (preferences/settings)
   - Relay adapters (SMS/email/share/manual WhatsApp intent)
4. **Platform Integration**
   - NotificationListenerService
   - WorkManager for deferred retries/maintenance
   - Foreground service only if needed for reliability messaging

### Simple Text Architecture Diagram

```text
[WhatsApp Notification]
        |
        v
[NotificationListenerService]
        |
        v
[NotificationParser] ---> [RuleEngine: Group + Keywords]
        |                           |
        | match                     | no match
        v                           v
[ActionOrchestrator]            [Drop]
   |       |        |
   |       |        +--> [Room Log (optional)]
   |       +------------> [Relay Adapter(s)]
   +--------------------> [Local Notification]

[UI/ViewModel] <--> [Repository] <--> [Room + DataStore]
```

---

## 7) Recommended Android Tech Stack

- **Language**: Kotlin
- **Min SDK**: 26+ recommended (pragmatic for background behavior)
- **UI**: Jetpack Compose + Material 3
- **Architecture**: MVVM + Repository + UseCases
- **DI**: Hilt
- **Storage**:
  - Room (logs/rules/targets)
  - DataStore Preferences (global settings)
- **Async**: Kotlin Coroutines + Flow
- **Background**:
  - NotificationListenerService (primary real-time trigger)
  - WorkManager (cleanup/retry/export future)
- **Testing**:
  - JUnit5/JUnit4 + Turbine + MockK
  - Robolectric for service parsing tests
  - Instrumentation for permission flow
- **Observability**:
  - Timber logging
  - Crash reporting (Firebase Crashlytics optional)

---

## 8) Required Permissions and Why

| Permission / Access | Required | Why |
|---|---:|---|
| Notification Access (special access) | ✅ | Needed to read posted notifications from WhatsApp |
| POST_NOTIFICATIONS (Android 13+) | ✅ | Needed to alert user with local notifications |
| READ_CONTACTS | Optional | Contact picker convenience for recipient setup |
| SEND_SMS | Optional (if SMS relay feature used) | Send SMS relay when user configures this channel |
| FOREGROUND_SERVICE | Optional | If foreground reliability mode is offered |
| INTERNET | Optional | Only needed for remote analytics/cloud sync future |

Notes:
- Notification Access is not a manifest runtime permission; it is granted in system settings by explicit user action.
- SMS sending should be opt-in and jurisdiction-aware.

---

## 9) How the App Can Detect WhatsApp Group Messages

### Primary Mechanism: NotificationListenerService
- Listen to `onNotificationPosted(StatusBarNotification sbn)`.
- Filter package name: `com.whatsapp` (and optionally business variant if supported).
- Extract notification extras:
  - Title / conversation title (group identifier)
  - Text/body (message content snippet/full depending notification type)
  - Sender metadata if present
- Apply parsing heuristics for group format (e.g., `Sender: Message` patterns when available).

### Why not direct WhatsApp message DB/API?
- WhatsApp does not provide public API for reading personal chat/group messages on device for third-party apps.
- Accessing app-private storage/databases is blocked by Android sandbox and violates policy expectations.

### Reliability caveat
- If WhatsApp notifications are muted, hidden, or content-suppressed, detection fidelity drops.

---

## 10) How Keyword Matching Should Work

### Matching Strategy (MVP)
1. Normalize input message:
   - Unicode normalization
   - Lowercase (if case-insensitive mode)
   - Trim and collapse whitespace
2. For each enabled keyword:
   - Normalize keyword similarly
   - Evaluate match type:
     - Exact token match
     - Contains substring
3. Optional anti-noise:
   - Word boundary checks
   - Duplicate event suppression (same message hash within N minutes)

### Future-ready strategy
- Add per-keyword type: regex, stemming, transliteration, synonym map.
- Add multilingual tokenization.

### Sample Pseudocode

```kotlin
fun detectMatches(message: String, rules: List<KeywordRule>, now: Instant): List<KeywordRule> {
    val normalizedMsg = normalize(message)
    return rules
        .filter { it.enabled }
        .filter { rule ->
            val kw = normalize(rule.keyword)
            when (rule.matchType) {
                EXACT -> tokenSet(normalizedMsg).contains(kw)
                CONTAINS -> normalizedMsg.contains(kw)
            }
        }
        .filterNot { rule -> isDuplicate(rule.id, normalizedMsg, now) }
}
```

---

## 11) How Alerting and Forwarding Should Work

### Alerting
- Generate high-priority local notification including:
  - Group name
  - Matched keyword
  - Message preview
  - Deep link to history detail

### Forward/Relay (Compliant approach)
Because fully automatic WhatsApp message sending is generally restricted/unreliable for consumer accounts:

#### Recommended relay hierarchy
1. **Manual WhatsApp share intent (recommended for compliance)**
   - Pre-fill message in share sheet or WhatsApp intent
   - User confirms recipient and send
2. **SMS relay (opt-in)**
   - App sends SMS to configured target (requires permission)
3. **Email relay**
   - Use email intent or background SMTP via trusted backend (future)
4. **In-app copy action**
   - Copy formatted relay text for one-tap paste

### Relay message template
`[GroupPulse Alert] Group: {group}, Keyword: {keyword}, Message: {message}, Time: {timestamp}`

---

## 12) Configurable Settings Page Details

### Sections
1. **Monitoring**
   - Enable monitoring toggle
   - Monitored group name
   - WhatsApp package variant selector (WA / WA Business)
2. **Keywords**
   - Add/edit/remove
   - Enable per keyword
   - Match mode
3. **Actions**
   - Default action mode
   - Require manual confirmation before relay
   - Relay channel priority
4. **Recipients**
   - Multiple target entries
   - Per-recipient channel + active toggle
5. **Behavior**
   - Quiet hours
   - Duplicate suppression time window
   - Retry policy for failed relay
6. **Data & Privacy**
   - Retention days
   - Delete all logs
   - Export logs (future)

---

## 13) Local Database / Storage Design

### Room Entities (sample schema)

```sql
Table monitored_group (
  id INTEGER PRIMARY KEY,
  display_name TEXT NOT NULL,
  match_mode TEXT NOT NULL, -- EXACT | CONTAINS
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

Table keyword_rule (
  id INTEGER PRIMARY KEY,
  group_id INTEGER NOT NULL,
  keyword TEXT NOT NULL,
  match_type TEXT NOT NULL, -- EXACT | CONTAINS
  case_sensitive INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY(group_id) REFERENCES monitored_group(id)
);

Table relay_target (
  id INTEGER PRIMARY KEY,
  name TEXT,
  channel_type TEXT NOT NULL, -- WHATSAPP_INTENT | SMS | EMAIL | COPY
  target_value TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

Table match_event (
  id INTEGER PRIMARY KEY,
  group_name TEXT NOT NULL,
  sender_name TEXT,
  message_text TEXT NOT NULL,
  matched_keywords TEXT NOT NULL, -- JSON array
  action_mode TEXT NOT NULL, -- NOTIFY_ONLY | NOTIFY_LOG | NOTIFY_RELAY
  relay_status TEXT, -- SUCCESS | FAILED | SKIPPED
  source_package TEXT NOT NULL,
  notification_key TEXT,
  detected_at INTEGER NOT NULL
);

Table app_setting (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

### Data retention
- Default keep logs 30 days (configurable)
- WorkManager periodic cleanup task

---

## 14) Background Service Handling

### Primary runtime
- `NotificationListenerService` is event-driven and ideal for incoming message notifications.

### Support jobs
- `WorkManager` for:
  - Log cleanup
  - Deferred relay retry (SMS/email failures)
  - Health checks/diagnostics snapshots

### Foreground service
- Optional “Reliability Mode” for OEM-aggressive battery devices.
- Should be user-triggered and transparent with persistent notification.

---

## 15) Notification Handling

### Notification channels
1. **Critical Match Alerts** (high importance)
2. **Relay Status** (default importance)
3. **Service Status** (low importance)

### UX standards
- Clear, actionable text
- Action buttons:
  - Open app
  - Share now
  - Mute keyword (future)

### Debounce/Rate control
- Avoid flooding by grouping alerts per keyword/group within short window.

---

## 16) Error Handling and Edge Cases

| Scenario | Behavior |
|---|---|
| Notification access revoked | Show persistent warning in app + CTA to re-enable |
| WhatsApp notification content hidden | Log “insufficient content”; optionally notify user of degraded mode |
| Group title changed | Support fuzzy contains match + prompt user to confirm mapping |
| Duplicate notifications for same message | Use hash + timestamp suppression |
| Relay channel failure (SMS/email) | Mark failed, retry policy, expose in history |
| App killed by OEM | Show battery optimization instructions |
| User enables many keywords | Optimize with precompiled structures and batching |
| Non-text messages (image/sticker) | Ignore or log metadata only |

---

## 17) Privacy and Security Considerations

1. **Data minimization**
   - Store only required notification fields.
2. **On-device first**
   - Keep processing local for MVP.
3. **Encryption**
   - Encrypt sensitive local fields where feasible (e.g., SQLCipher or encrypted file storage for exports).
4. **User consent**
   - Explicit consent for notification reading and relay channels.
5. **Transparency**
   - Clear privacy policy explaining what is processed and retained.
6. **No credential scraping**
   - Never request WhatsApp credentials.
7. **Secure logs**
   - Redact content in crash logs.

---

## 18) Platform Limitations & WhatsApp Policy Compliance

### Critical honesty statement
- **Fully automatic forwarding/sending messages inside WhatsApp chats from a consumer third-party app is generally not officially supported via public Android APIs.**
- Direct bot-like WhatsApp automation may violate platform/app policies and can break across updates.

### What is feasible and compliant
- Read WhatsApp notification content **only after user grants Notification Access**.
- Trigger local alerts reliably.
- Offer user-confirmed share/intents for forwarding.
- Offer alternate relay channels (SMS/email/copy) with proper consent.

### What is risky/restricted
- Accessibility-scripted auto-send flows (fragile, policy-risky).
- Reverse engineering/internal WhatsApp endpoints.
- Background, no-user-interaction forced WhatsApp sends on consumer app.

### Recommendation
- MVP should avoid unauthorized automation; prefer **notify + manual confirm share** as default relay mode.

---

## 19) MVP Scope

### Included
- Android app with onboarding + permissions
- Single monitored group configuration
- Multi-keyword setup
- Action modes (notify / notify+log / notify+relay via compliant channels)
- Match history list
- Monitoring enable/disable
- Test mode simulation
- Basic reliability and diagnostics

### Excluded (Post-MVP)
- Multi-group concurrent monitoring
- Cloud sync and multi-device state
- Advanced NLP/regex engine
- Dashboard analytics and exports

---

## 20) Future Enhancements

1. Multi-group rule engine
2. Rule priorities and boolean logic (AND/OR)
3. Multilingual smart matching (phonetic, transliteration)
4. Scheduled escalation if no acknowledgment
5. Cloud backup/encrypted sync
6. Team shared rules (admin console)
7. Wear OS quick alerts
8. Voice assistant integration
9. ML-based relevance scoring
10. Safe connector options for official business messaging APIs where applicable

---

## Feature-to-Requirement Traceability

| Functional Requirement | Covered By |
|---|---|
| Select one WhatsApp group | Setup + Settings (Monitored group) |
| Enter one or more keywords | Rules Management (Keywords CRUD) |
| Configure one or more recipients | Rules Management (Recipients CRUD) |
| Log matched messages + timestamp | `match_event` table + history screen |
| Enable/disable monitoring | Dashboard + Settings toggle |
| Choose mode (notify / notify+log / notify+relay) | Action mode config + runtime orchestrator |
| Background operation | NotificationListenerService + WorkManager |
| Show history | Match History screen |
| Test mode | Test Mode simulation screen |

---

## Step-by-Step Implementation Plan

### Phase 0: Foundation (Week 1)
1. Create project skeleton (Kotlin, Compose, Hilt, Room, DataStore)
2. Define domain models and Room schema
3. Build settings repository and monitoring toggle

### Phase 1: Core Detection (Week 2)
4. Implement NotificationListenerService
5. Add WhatsApp package filter + parser
6. Implement keyword rule engine + duplicate suppression

### Phase 2: Product UX (Week 3)
7. Build onboarding, permission flow, setup wizard
8. Build dashboard + rules management
9. Build history list/detail + test mode

### Phase 3: Actions & Reliability (Week 4)
10. Implement local notification alerts
11. Implement relay adapters (manual share, SMS optional, email intent)
12. Implement WorkManager cleanup/retry

### Phase 4: Hardening (Week 5)
13. Add instrumentation/unit tests
14. Add privacy policy, legal disclaimers, telemetry toggles
15. OEM battery optimization guidance and diagnostics UI

### Phase 5: Beta (Week 6)
16. Closed beta with consented users
17. Tune parsing for notification variants
18. Freeze MVP and prepare release checklist

---

## Risk & Limitation Register

| Risk | Impact | Likelihood | Mitigation |
|---|---|---:|---|
| WhatsApp notification format changes | Parsing failure | Medium | Parser abstraction + hotfix path |
| User mutes/hides notification content | Detection gap | High | Setup checks + user guidance |
| OEM background restrictions | Missed events | Medium | Reliability mode + battery guidance |
| Policy violations via over-automation | Store rejection/account risk | High | Compliance-first relay design |
| False positives in keyword match | Alert fatigue | Medium | Exact/contains modes + dedupe + mute options |
| SMS costs/regulatory concerns | Financial/legal | Medium | Explicit user consent + usage notice |

---

## Non-Functional Requirements

- Detection latency target: < 2 seconds after notification post
- App cold start < 2.5 seconds on mid-tier devices
- Crash-free sessions > 99.5%
- Local data durability across reboot
- Accessibility: large text support, screen reader labels
- Localization-ready architecture

---

## Compliance-First Recommendation (Executive)

For Android consumer distribution, the best production-safe MVP is:
1. Notification Listener–based detection,
2. strong local alerts + logging,
3. optional user-confirmed relay via share intent,
4. optional SMS/email relay with explicit consent,
5. no hidden or unauthorized WhatsApp automation.

This delivers practical value while minimizing policy, reliability, and security risk.
