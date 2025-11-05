@echo off
echo Installing python-docx for DOCX support...
cd backend
pip install python-docx
echo.
echo Restarting backend server...
python app.py
