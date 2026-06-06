# update_memory.ps1
# PostToolUse hook: appends a timestamped entry to PROJECT_MEMORY.md ## Recent Changes
# Called by Claude Code after every Edit or Write tool use.
# Rules:
#   - Only modifies the ## Recent Changes section
#   - Never rewrites any other section
#   - Skips silently if PROJECT_MEMORY.md does not exist
#   - Caps Recent Changes at 10 entries (drops oldest)

param()

# Read JSON payload piped to stdin by Claude Code
try {
    $raw     = [Console]::In.ReadToEnd()
    $payload = $raw | ConvertFrom-Json
} catch {
    exit 0
}

# Extract the file path from the tool input
$filePath = $payload.tool_input.file_path
if (-not $filePath) { exit 0 }

$fileName = Split-Path $filePath -Leaf

# Never update when PROJECT_MEMORY.md itself was edited (avoid infinite loop)
if ($fileName -eq 'PROJECT_MEMORY.md' -or $fileName -eq 'update_memory.ps1') { exit 0 }

# Resolve PROJECT_MEMORY.md path (one level above this script's directory)
# Use MyInvocation for PS 5.1 compatibility ($PSScriptRoot may be null in some invocation modes)
$scriptDir  = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$memoryFile = [IO.Path]::GetFullPath([IO.Path]::Combine($scriptDir, '..', 'PROJECT_MEMORY.md'))

if (-not (Test-Path $memoryFile)) { exit 0 }

# Build the new timestamped entry
$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
$toolName  = $payload.tool_name
$dash      = [char]0x2014   # em dash: avoids encoding issues in string literals
$newEntry  = ('- {0} {1} {2}: {3} via Claude Code' -f $timestamp, $dash, $fileName, $toolName)

# Read full file as a single string (preserve line endings)
$content = [IO.File]::ReadAllText($memoryFile, [Text.Encoding]::UTF8)

# Locate the ## Recent Changes section header — must be at line-start
# Search for newline-prefixed form to avoid matching the phrase inside prose text
$sectionTag = "`n## Recent Changes"
$headerPos  = $content.IndexOf($sectionTag)
if ($headerPos -lt 0) { exit 0 }

# Step past the full header line (skip "\n## Recent Changes\n")
$eolPos = $content.IndexOf("`n", $headerPos + 1)
if ($eolPos -lt 0) { exit 0 }
$bodyStart = $eolPos + 1

# Find the start of the next ## section (or end of file)
$nextSectionPos = $content.IndexOf("`n## ", $bodyStart)

if ($nextSectionPos -ge 0) {
    $sectionBody  = $content.Substring($bodyStart, $nextSectionPos - $bodyStart)
    $tail         = $content.Substring($nextSectionPos)
} else {
    $sectionBody  = $content.Substring($bodyStart)
    $tail         = ''
}

# Collect only dated entries from the section (ignore blank lines / non-entries)
$existingEntries = ($sectionBody -split "`n") |
    Where-Object { $_ -match '^- \d{4}-\d{2}-\d{2} \d{2}:\d{2}' }

# Prepend new entry and cap at 10
$allEntries = @($newEntry) + @($existingEntries)
if ($allEntries.Count -gt 10) { $allEntries = $allEntries[0..9] }

# Rebuild section body
$newSectionBody = "`n" + ($allEntries -join "`n") + "`n"

# Reconstruct and write the file — only the Recent Changes section changes
$head       = $content.Substring(0, $bodyStart)
$newContent = $head + $newSectionBody + $tail

[IO.File]::WriteAllText($memoryFile, $newContent, [Text.Encoding]::UTF8)
exit 0
