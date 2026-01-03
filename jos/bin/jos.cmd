@echo off
SETLOCAL
SET dp0=%~dp0
node "%dp0%\jos" %*
ENDLOCAL
