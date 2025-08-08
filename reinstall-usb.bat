@echo off
set DEVICE=LJ4DPVWWGUAM6DQ8
set PACKAGE=com.salesninjacrm
set APK_PATH=C:\Users\REDVision\Desktop\appium-js-tests\apps\snc_live_35_version.apk.apk

echo 📱 Uninstalling %PACKAGE% on %DEVICE%...
adb -s %DEVICE% uninstall %PACKAGE%

echo 📦 Installing APK...
adb -s %DEVICE% install "%APK_PATH%"

echo ✅ Done!
