plugins { id("com.android.application") version "8.7.0"; id("org.jetbrains.kotlin.android") version "2.0.0" }
android { namespace = "com.example.app"; compileSdk = 35
 defaultConfig { applicationId = "com.example.app"; minSdk = 26; targetSdk = 35; versionCode = 1; versionName = "0.1.0" } }
