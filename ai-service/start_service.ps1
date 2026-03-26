# Activate virtual environment and start Flask app
Set-Location c:\velocity\ai-service
$venvPath = ".\.venv\Scripts\Activate.ps1"

# Execute the activation script
& $venvPath

# Start the Flask app
python app.py
