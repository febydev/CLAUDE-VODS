import subprocess
from pathlib import Path
ROOT = Path(r"c:\Users\user\Desktop\SCHOOL ACTIVITIES\CLAUDE VODS")
def run(cmd, **kw):
    print(f"$ {cmd}")
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=ROOT, **kw)
    print(r.stdout)
    if r.stderr: print("STDERR:", r.stderr)
    return r.returncode

# status
run("git status --short")
print("---")
# last 5 commits
run("git log --oneline -5")
print("---")
# remote
run("git remote -v")
print("---")
# current branch
run("git branch --show-current")
