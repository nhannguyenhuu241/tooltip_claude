# GUIDE — Mobile Developer Team

> Hướng dẫn cho team Phát triển Mobile. Dành cho người mới chưa biết gì về hệ thống này.

---

## Team này làm gì?

**Mobile Developer Team** xây dựng ứng dụng mobile cho iOS và Android, bao gồm React Native, Flutter, SwiftUI, và Kotlin/Jetpack Compose. Team đảm bảo app đạt hiệu năng cao, trải nghiệm người dùng tốt, và được submit lên store thành công.

---

## Pipeline hoạt động

```
[Yêu cầu/PRD/Bug]
        |
        v
     planner               <-- Nghiên cứu mobile patterns, platform constraints
        |
        v
  mobile-architect         <-- Navigation, state management, offline strategy
        |
        v
  [Language Specialist]    <-- Chọn 1 theo platform:
  react-native-specialist      React Native / Expo / TypeScript
  flutter-specialist           Flutter / Dart
  ios-specialist               SwiftUI / UIKit / Swift
  android-specialist           Kotlin / Jetpack Compose
        |
        v
  tech-lead-reviewer       <-- Review platform idioms, performance, security, a11y
        |
        v
   mobile-tester           <-- Unit tests + E2E tests + device matrix
        |
   debugger (on-demand)    <-- Crashes, ANRs, memory leaks
   app-store-publisher     <-- App Store / Play Store submission
```

---

## Các Agents

### lead
**Vai trò:** Team orchestrator — điều phối toàn bộ pipeline
**Khi nào dùng:** `/lead` để bắt đầu bất kỳ task nào

### planner
**Vai trò:** Lên kế hoạch triển khai feature mobile
**Làm gì:** Nghiên cứu platform constraints, permissions, performance requirements, tạo plan

### mobile-architect
**Vai trò:** Architecture decisions cho mobile
**Làm gì:** Navigation structure, state management, offline-first design, native module strategy

### react-native-specialist
**Stack:** React Native 0.74+, Expo SDK, TypeScript, Zustand, Reanimated 3, TanStack Query
**Chuyên sâu:** FlashList performance, Reanimated animations, MMKV storage, Expo Router

### flutter-specialist
**Stack:** Flutter 3.22+, Dart 3, GoRouter, Riverpod 2, Dio, Hive/sqflite
**Chuyên sâu:** Widget composition, Riverpod state, Dart isolates, Flutter DevTools

### ios-specialist
**Stack:** Swift 5.10+, SwiftUI, Swift async/await, Core Data, Keychain, XCTest
**Chuyên sâu:** @MainActor, SwiftUI navigation, Swift actors, URLSession async

### android-specialist
**Stack:** Kotlin 2.0, Jetpack Compose, Hilt, Room, StateFlow, Retrofit, JUnit 5
**Chuyên sâu:** MVVM + Clean Architecture, Compose stateless UI, WorkManager, EncryptedSharedPreferences

### tech-lead-reviewer
**Vai trò:** Quality gate — review mọi implementation
**Kiểm tra:** Platform idioms, performance, security, accessibility, offline behavior
**Quyết định:** Approved / Needs Changes / Rejected

### mobile-tester
**Vai trò:** QA — chạy tests và validate trên device matrix
**Phạm vi:** Unit tests, E2E (Detox/Maestro), platform-specific scenarios

### debugger
**Vai trò:** Chuyên gia debug (on-demand)
**Khi nào dùng:** Crashes, ANRs, memory leaks, performance issues

### app-store-publisher
**Vai trò:** App store deployment
**Làm gì:** EAS Build, Fastlane, signing, versioning, OTA updates, store submission

---

## Commands

```
/lead                    -- Bắt đầu pipeline đầy đủ (khuyến nghị)
/planner                 -- Lên plan feature
/mobile-architect        -- Architecture decisions
/react-native-specialist -- Implement React Native
/flutter-specialist      -- Implement Flutter
/ios-specialist          -- Implement iOS native
/android-specialist      -- Implement Android native
/tech-lead-reviewer      -- Review code
/mobile-tester           -- Chạy tests
/debugger                -- Debug issues
/app-store-publisher     -- Submit to stores
```

---

## Ví dụ prompts

**Feature mới:**
```
/lead
Implement tính năng scan QR code để đăng nhập nhanh cho app React Native.
Plan tại: ./docs/prd-qr-login.md
```

**Bug fix:**
```
/react-native-specialist
Fix crash khi user scroll nhanh trong danh sách sản phẩm (FlatList).
Stack trace: [paste crash log]
Sau đó /tech-lead-reviewer để review fix.
```

**Submit store:**
```
/app-store-publisher
Build và submit version 2.5.0 lên App Store và Google Play.
Changelog tại: ./CHANGELOG.md
```

---

## Lưu ý quan trọng

- **Test trên thiết bị thật** — simulator/emulator không phát hiện được memory issues
- **Không hardcode secrets** — dùng Keychain (iOS), Keystore (Android), hoặc env vars
- **Offline-first** — mọi feature phải hoạt động khi không có mạng
- **Platform guidelines** — Apple HIG cho iOS, Material 3 cho Android
- **Code review bắt buộc** — không submit store khi chưa có tech-lead-reviewer approval
