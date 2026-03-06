# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**[PROJECT_NAME]** — [Brief description: mobile app, target platforms (iOS/Android), framework].
- **Source code location**: [path or repo URL]
- **Tech stack**: [e.g., React Native/Expo, Flutter/Dart, SwiftUI, Kotlin/Jetpack Compose]

---

## Auto-Learning Instructions

> **For Claude:** When first activated in this project, silently scan the project and populate the **Project Context** section below. Do NOT modify `Agent Workflow` or `Company Security Policy` sections — they are locked.

### Scan order
1. `README.md` — app name, description, platforms
2. `package.json` / `pubspec.yaml` — framework, language, dependencies
3. `app.json` / `app.config.ts` (Expo) or `Info.plist` / `AndroidManifest.xml` — app config
4. `.env.example` — environment variables, API endpoints, keys
5. `src/` / `lib/` / `app/` top-level — screen names, module structure
6. `__tests__/` / `e2e/` — test framework (Jest, Detox, Maestro)
7. `eas.json` / `Makefile` / `fastlane/` — build and deploy config

### After scan: fill in Project Context, then tell the user what was detected and what is missing.

---

## Project Context
> Auto-populated by Claude on first activation. Correct manually if wrong.

- **Project name**: [AUTO]
- **Description**: [AUTO: 1–2 sentences]
- **Framework**: [AUTO: React Native (Expo/bare) | Flutter | SwiftUI | Kotlin/Compose | Xamarin]
- **Target platforms**: [AUTO: iOS | Android | Both]
- **Language**: [AUTO: TypeScript | Dart | Swift | Kotlin]
- **Navigation**: [AUTO: React Navigation | Expo Router | Flutter Navigator 2 | SwiftUI NavigationStack]
- **State management**: [AUTO: Zustand | Redux | Jotai | Riverpod | Provider | SwiftUI @State]
- **API / networking**: [AUTO: Axios | TanStack Query | Dio | URLSession / Alamofire]
- **Local storage**: [AUTO: MMKV | AsyncStorage | SQLite | Hive | UserDefaults / Core Data]
- **Push notifications**: [AUTO: Expo Notifications | Firebase FCM | OneSignal | APNS]
- **Test framework**: [AUTO: Jest + Detox | Maestro | XCTest | Espresso]
- **Build / deploy**: [AUTO: EAS | Fastlane | Xcode Cloud | App Center]
- **Source root**: [AUTO: path]

### Build & Development Commands
```bash
# [AUTO: from README or package.json scripts]
# install: ...
# start: ...
# ios: ...
# android: ...
# test: ...
# build: ...
```

---

## Architecture
> Fill in after auto-learning or manually.

- **Structure**: [AUTO or manual — e.g., Feature-based, MVVM, Clean Architecture]
- **Key directories**: [AUTO or manual]

---

## Agent Workflow — Mobile Developer Team

This team specializes in **mobile app development, native platform integration, performance, testing, and app store delivery**. Use the pipeline below.

### 1. Planning → `planner`
- Use before starting any significant feature or platform-specific implementation
- Researches mobile patterns, platform guidelines, evaluates trade-offs
- Output: implementation plan saved to `./plans/` directory

### 2. Architecture → `mobile-architect`
- Triggered for navigation structure, state management, offline strategy, or cross-platform design decisions
- Produces component model, screen flows, data sync architecture, and ADRs
- Output: `./docs/architecture-[feature].md`

### 3. Implementation — pick ONE language specialist:
- **`react-native-specialist`** — React Native / Expo / TypeScript
- **`flutter-specialist`** — Flutter / Dart
- **`ios-specialist`** — SwiftUI / UIKit / Swift
- **`android-specialist`** — Kotlin / Jetpack Compose

### 4. Code Review → `tech-lead-reviewer`
- **Required after every implementation**
- Reviews platform idioms, performance, memory management, security
- Decision: Approved / Needs Changes / Rejected

### 5. Testing → `mobile-tester`
- Run after tech-lead approval
- Unit tests, widget/component tests, E2E with Detox/Maestro
- Go/No-Go for store submission

### 6. Debugging → `debugger` (on-demand)
- Use when investigating crashes, ANRs, memory leaks, or CI failures

### 7. Store Deployment → `app-store-publisher` (on-demand)
- App Store / Play Store submission, signing, versioning, OTA updates (EAS/Fastlane)

### Pipeline diagram
```
[Feature/Bug] → planner → mobile-architect → [language-specialist] → tech-lead-reviewer → mobile-tester
                                                                            ↓ (on-demand)
                                                                      debugger / app-store-publisher
```

### Shortcut for bug fixes
```
[language-specialist] → tech-lead-reviewer  (skip planning/architecture)
```

### General Rules
- **Never ship without tech-lead-reviewer approval**
- **Every new screen/feature must have unit tests**
- **Test on real device before submission** — simulators miss memory and performance issues
- **Follow platform guidelines**: Apple HIG for iOS, Material 3 for Android
- **Offline-first by default**: every feature must handle no-network gracefully
- Git: conventional commits (`feat:`, `fix:`, `perf:`, `chore:`)

## Company Security Policy

These rules are **mandatory** for every agent.

- Never hardcode API keys, tokens, or sensitive config — use `.env` or native secure storage (Keychain/Keystore)
- Never log PII (names, emails, phone numbers) in crash reporters or analytics
- Use HTTPS for all network calls — no HTTP in production
- Validate and sanitize all data from external sources (API responses, deep links, push payloads)
- Use biometric auth (FaceID/fingerprint) for sensitive operations, not just PIN
- Implement certificate pinning for financial or health apps
- Never store sensitive data in `AsyncStorage` / `SharedPreferences` — use Keychain/Keystore
- Obfuscate app binary for release builds (ProGuard / R8 for Android, Bitcode for iOS)
- Deep link validation: never trust URL params without validation
