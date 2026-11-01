# PartyBox — Expo / React Native

Free, open-source, offline Android party games. No accounts, ads, in-app purchases, or required network service.

This is **M3**: the neon app shell, responsive mechanical dial, three built-in decks, a locally saved custom question bank, and free-play manual questions. Charades is still a placeholder.

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
│   └── wavelength/              Dial, game flow, preset decks, custom question editor
├── i18n/                        English + Chinese strings and preference
└── theme/                       Shared color tokens
```

The UI defaults to the phone's language (Chinese or English), with English fallback. Tap the `中文` / `EN` button to change languages manually; the preference is stored locally.

### Play Sync Meter (two people, one phone)

1. Tap **Sync Meter / 默契刻度** on the home screen and select **Friends / Couples / Family**, **My question bank**, or **Free play**.
2. With a preset or custom bank, each round advances to the next question. The custom bank can be created and edited in the app; questions are stored locally using AsyncStorage.
3. In Free play, you write the question and both endpoints directly before each round (or edit them again while A is setting the range). Nothing is saved as a bank.
4. **Player A** drags the symmetric scoring zone to position the secret target, then passes the phone. The red needle is hidden at this stage.
5. **Handoff** hides the target. **Player B** drags the thinner red needle, then locks their guess.
6. **Reveal** shows both together. The score is 4 (center), 3, 2, or 0 (outside), accumulated across rounds.

The dial uses 0 on the left, 50 at the top, and 100 on the right. Pointer motion follows the finger **directly on the UI thread**, with no chase animation during a drag. On release it snaps to an even percentage with a brief finish animation. Tactile notches are crossed about every 4 points.

The scoring zone has **five equal-width sectors**, each spanning 4 percentage points (20 points total). Center distance ≤2 earns 4, ≤6 earns 3, ≤10 earns 2. A's center is limited to 10–90 so none of the five sectors is clipped at the endpoints. Game screens are non-scrolling. The mechanical SVG is newly drawn in code without third-party board-game logos or artwork.

`expo-haptics` triggers Android segmented-tick feedback or an iOS rigid impact when the hand crosses a notch. Actual tactile strength and timing vary by phone and OS settings; confirm on a physical device.

Android navigation currently uses Expo Router's JS Stack (`expo-router/js-stack`) and keeps inactive screens attached. This avoids the native transition white flash observed when returning to the home screen on the test device.

## Verify

```bash
npx tsc --noEmit
npx expo lint
npx expo export --platform android
```

After upgrading from an earlier SDK 57 copy, use the new `package.json` and `package-lock.json` together. Run `npm install` in the updated directory, then `npx expo start --clear` to ensure Metro does not reuse the old bundle.

## Future features (not included in M3)

- Charades: `expo-sensors` / `DeviceMotion`, relative calibration and a gesture state machine.
- Sync Meter: more question packs, multi-bank organization and JSON import/export, polish after physical-device testing, and a longer-session results screen.
- Sounds and customizable feedback settings.

## Brand colors

| Role | Hex |
| --- | --- |
| Background | `#0B0917` |
| Violet | `#AD78FF` |
| Pink | `#FF79C9` |
| Cyan | `#46E8D7` |
| Coral orange | `#FFA267` |
