# Create the main project folders
$folders = @(
    "src/components",
    "src/components/ui",
    "src/components/tickets",
    "src/components/dashboard",
    "src/components/review",
    "src/lib",
    "src/store",
    "src/app/api/tickets",
    "src/app/api/tickets/[id]",
    "src/app/api/tickets/[id]/reply",
    "src/app/api/tickets/bulk",
    "src/app/api/tickets/review",
    "src/app/api/tickets/review/[id]",
    "src/app/api/triage",
    "src/app/tickets",
    "src/app/tickets/[id]",
    "src/app/review",
    "src/types",
    "public/images",
    "tests"
)

# Create each folder
foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

Write-Host "All project folders created successfully!" -ForegroundColor Green