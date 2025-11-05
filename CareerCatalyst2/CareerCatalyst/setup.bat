@echo off
echo 🚀 Setting up Enhanced ATS Resume Analyzer...

REM Navigate to backend directory
cd backend

echo 📦 Installing Python dependencies...
pip install -r requirements.txt

echo 🔧 Installing spaCy English model...
python -m spacy download en_core_web_sm

echo 📝 Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from template
    echo ⚠️  Please add your Gemini API key to the .env file
    echo    Get your free API key from: https://makersuite.google.com/app/apikey
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Add your Gemini API key to backend\.env file
echo 2. Start the backend: cd backend ^&^& uvicorn app:app --reload
echo 3. Start the frontend: npm start
echo.
echo For detailed instructions, see SETUP_GUIDE.md

pause
