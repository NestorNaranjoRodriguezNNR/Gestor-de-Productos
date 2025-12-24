# Firma de la app (Signing)

Este archivo explica cómo generar un keystore y cómo configurar el proyecto para crear un APK/AAB firmado.

## Generar un keystore
Ejecuta (cambia los valores según prefieras):

```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

Guarda `my-release-key.jks` en un lugar seguro (por ejemplo `~/.keystores` o `android/app/` si quieres copiarlo al proyecto).

## Configurar las propiedades
Añade estas propiedades a `~/.gradle/gradle.properties` (recomendado, para no subir contraseñas al repo) o a `android/gradle.properties` (si lo haces, **no** subas contraseñas al control de versiones):

```
MYAPP_RELEASE_STORE_FILE=my-release-key.jks
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=tu_store_password
MYAPP_RELEASE_KEY_PASSWORD=tu_key_password
```

Si usas `MYAPP_RELEASE_STORE_FILE` con una ruta relativa (por ejemplo `android/app/my-release-key.jks`), Gradle la resolverá desde la carpeta del proyecto.

> **Importante:** no subas las contraseñas al repositorio. Usa `~/.gradle/gradle.properties` o variables de entorno/servicios de CI para seguridad.

## Construir release
Desde la raíz del proyecto:

1. Compila los assets web y sincroniza Capacitor:

```bash
npm run build
npx cap sync android
```

2. Construir el APK firmado (en Windows):

```powershell
cd android
.\gradlew.bat assembleRelease
```

3. O construir AAB (recomendado para Google Play):

```powershell
cd android
.\gradlew.bat bundleRelease
```

Los artefactos estarán en `android/app/build/outputs/apk/release/` o `android/app/build/outputs/bundle/release/`.

## Instalar en dispositivo (para pruebas)

Con el dispositivo conectado (USB debugging activado):

```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

## Problemas comunes
- Asegúrate de tener el SDK de Android (API 36) instalado y `JAVA_HOME` apuntando a JDK 11/17.
- Si Gradle no encuentra las propiedades, comprueba que están en `~/.gradle/gradle.properties` o que las has agregado correctamente en `android/gradle.properties`.

---
## Integración continua (GitHub Actions)

He añadido un workflow de GitHub Actions en `.github/workflows/android-build.yml` que:

- Ejecuta `npm ci`, `npm run build`, `npx cap sync android` y `./gradlew bundleRelease` en Ubuntu.
- Sube el AAB (`android/app/build/outputs/bundle/release/*.aab`) y cualquier APK como artefactos del job.

Firma automática en CI (opcional):

- Para que el workflow firme el AAB necesitas añadir estos **secrets** al repositorio:
  - `KEYSTORE_BASE64` : contenido del keystore codificado en base64 (ej.: `base64 my-release-key.jks | pbcopy`)
  - `MYAPP_RELEASE_KEY_ALIAS`
  - `MYAPP_RELEASE_STORE_PASSWORD`
  - `MYAPP_RELEASE_KEY_PASSWORD`

El workflow decodifica el keystore en `android/app/my-release-key.jks` y escribe un archivo `~/.gradle/gradle.properties` con las credenciales para que Gradle pueda firmar.

> **Seguridad:** nunca subas el keystore directamente al repo. Usa GitHub Secrets para almacenar el keystore (base64) y las contraseñas.

---
Si quieres, puedo también:
- Añadir un `workflow` que publique automáticamente el AAB en un release de GitHub,
- O crear un `script npm` para ejecutar localmente `build + cap sync + gradlew bundleRelease` en una sola llamada.

---
## Scripts útiles en `package.json`
He añadido los siguientes scripts para facilitar la construcción local:

- **`npm run android:bundle`** — ejecuta `build`, `npx cap sync android` y `./gradlew bundleRelease` (Unix/macOS/Linux).
- **`npm run android:bundle:windows`** — lo mismo usando `gradlew.bat` (Windows PowerShell/CMD).
- **`npm run android:assembleRelease`** — genera APKs con `./gradlew assembleRelease`.
- **`npm run android:assembleRelease:windows`** — la variante para Windows.

Ejemplo (Windows PowerShell):

```powershell
npm run android:bundle:windows
```

Ejemplo (Linux/macOS):

```bash
npm run android:bundle
```

Estos scripts simplifican la secuencia: compilar web assets → sincronizar Capacitor → construir AAB/APK.
