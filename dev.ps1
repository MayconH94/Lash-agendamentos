docker compose up -d --wait
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker nao esta rodando. Abra o Docker Desktop e tente de novo." -ForegroundColor Red
    exit 1
}
Set-Location "$PSScriptRoot\backend"
.\mvnw spring-boot:run
