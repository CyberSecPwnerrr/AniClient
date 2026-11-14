import shutil
from pathlib import Path

root = Path("dist")
if not (root / "AniClient" / "AniClient.exe").exists():
    raise SystemExit("dist/AniClient/AniClient.exe not found")
shutil.make_archive("payload", "zip", root_dir=str(root), base_dir="AniClient")
print("payload.zip created")
