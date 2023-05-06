@echo

cd F:\ReactJS\Framework\moc-admin-app
if exist F:\ReactJS\Framework\moc-admin-app\build (
    del F:\ReactJS\Framework\moc-admin-app\build /q /s
)

timeout /t 3
call npm run build:stg

timeout /t 3
if exist F:\Deployment\ReactJS\moc-app-stg (
    del F:\Deployment\ReactJS\moc-app-stg /q /s
) else (
    md F:\Deployment\ReactJS\moc-app-stg
)


timeout /t 3
xcopy F:\ReactJS\Framework\moc-admin-app\build\* F:\Deployment\ReactJS\moc-app-stg /e

pause
exit

