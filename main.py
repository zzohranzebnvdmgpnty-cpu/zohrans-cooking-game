```python
import os
import webbrowser
from pathlib import Path

# Find the folder containing this Python file.
GAME_FOLDER = Path(__file__).resolve().parent
HTML_FILE = GAME_FOLDER / "index.html"

print("=" * 40)
print("      ZOHRAN'S REAL KITCHEN")
print("=" * 40)

if not HTML_FILE.exists():
    print("ERROR: index.html was not found!")
    print("Put index.html in the same folder as main.py.")
    input("\nPress Enter to close...")
else:
    print("Starting your cooking game...")
    print("Opening your browser...")

    success = webbrowser.open(HTML_FILE.as_uri())

    if success:
        print("Game launched!")
        print("Enjoy cooking!")
    else:
        print("Could not open the browser automatically.")
        print("Open index.html manually.")

    input("\nPress Enter to close...")
```
