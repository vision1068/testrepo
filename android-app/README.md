# GroupPulse Android App (MVP Scaffold)

This folder contains a buildable Android/Kotlin scaffold for the WhatsApp keyword monitor MVP.

## What's implemented
- Kotlin + Compose + MVVM + Hilt + Room skeleton
- `NotificationListenerService` wired for WhatsApp package filtering
- Keyword matching domain service
- Local event logging via Room
- Basic dashboard showing monitoring toggle and match history

## What remains
- Full onboarding and permission UX
- Rules CRUD screens (keywords, recipients, group config)
- Action modes and relay strategy UI
- Notification channels + local alert delivery
- WorkManager cleanup/retry jobs
- Comprehensive tests

## Run
1. Open `android-app` in Android Studio (Hedgehog+ recommended).
2. Sync Gradle.
3. Run on Android 8.0+ device.
4. Manually grant Notification Access in system settings.
