# PartyBox — Expo / React Native

Free, open-source, offline Android party games. No accounts, ads, in-app purchases, or required network service.

This is **M1**: the app shell, Midnight Neon visual design, and an interactive Sync Meter dial prototype. Charades is still a placeholder.

## Expo Go compatibility

This project targets **Expo SDK 58** (React Native 0.88). The current Expo Go app on Android expects SDK 58, so projects still using SDK 57 will report a version mismatch. The project uses TypeScript, Expo Router, React Native, and SDK-compatible Expo packages.

## Get started on Windows / WSL2

1. Install a Node.js LTS release and Android Studio (for native builds and emulator use).
2. Open a terminal in this directory.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start Expo's Metro development server:

   ```bash
   npx expo start --clear
   ```

5. Open **Expo Go** on your Android phone and scan the QR code. The phone and PC generally need to be reachable on the same network. For WSL2 / corporate network restrictions, use a reachable network or Android emulator.

`npm run android` can also open the Android emulator. Expo Go and Metro are development tools; the final release APK embeds its JavaScript bundle and game assets and will run without Metro.

## Release APK

An Android release can be built using native local tooling or EAS. For a locally generated native project:

```bash
npx expo run:android --variant release
```

On first use, this generates the Android project and needs Android SDK / Gradle. Release signing must be configured before distributing a production APK.

An optional EAS `preview` profile in `eas.json` is configured to generate an installable APK. Using Expo's hosted EAS build service requires a **developer's Expo account**, never an account for PartyBox end users.

The app config excludes `android.permission.INTERNET` from the generated app manifest. This is intentional for offline release builds, but it also means a custom **development build** with this permission removed cannot connect to Metro. Use Expo Go during early development, and review the final merged permissions before release.

## Structure

```text
src/
├── app/                        Expo Router routes
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── charades.tsx
│   └── wavelength.tsx
├── features/
│   ├── home/                    Home UI + small game artworks
│   ├── shared/                  Charades placeholder page
│   └── wavelength/              Interactive semicircle dial + demo screen
├── i18n/                        English + Chinese strings and preference
└── theme/                       Shared color tokens
```

The UI defaults to the phone's language (Chinese or English), with English fallback. Tap the `中文` / `EN` button to change languages manually; the preference is stored locally.

### Try the Sync Meter prototype

1. Tap **Sync Meter / 默契刻度** on the home screen.
2. Touch the arc to jump to a position, or drag across the dial to move the pointer.
3. Use **− / +** for precise 5-point adjustments. The number is visible in this prototype only, to help validate the touch mapping.
4. Confirm to lock your choice, then tap again to adjust it.

The dial uses 0 on the left, 50 at the top, and 100 on the right. This milestone does **not** implement player handoff, answer hiding, reveal animation, or scoring yet.

Android navigation currently uses Expo Router's JS Stack (`expo-router/js-stack`) and keeps inactive screens attached. This avoids the native transition white flash observed when returning to the home screen on the test device.

## Verify

```bash
npx tsc --noEmit
npx expo lint
npx expo export --platform android
```

After upgrading from an earlier SDK 57 copy, use the new `package.json` and `package-lock.json` together. Run `npm install` in the updated directory, then `npx expo start --clear` to ensure Metro does not reuse the old bundle.

## Future features (not included in M1)

- Charades: `expo-sensors` / `DeviceMotion`, relative calibration and a gesture state machine.
- Sync Meter: two-player handoff, answer hiding, reveal animation, and scoring.
- Sounds, haptics and additional JSON question packs.

## Brand colors

| Role | Hex |
| --- | --- |
| Background | `#0B0917` |
| Violet | `#AD78FF` |
| Pink | `#FF79C9` |
| Cyan | `#46E8D7` |
| Coral orange | `#FFA267` |
