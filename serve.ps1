# Simple lightweight HTTP Server in pure PowerShell (No Node/Python needed)
$port = 8080
$path = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Electrowerk Technologies Web Server Running" -ForegroundColor Green
Write-Host " Local URL: http://localhost:$port/" -ForegroundColor Yellow
Write-Host " Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan

$mimeMap = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $reqUrl = $request.Url.LocalPath
        if ($reqUrl -eq "/" -or $reqUrl -eq "") {
            $reqUrl = "/index.html"
        }

        $localFilePath = Join-Path $path ($reqUrl.TrimStart('/'))
        $localFilePath = [System.IO.Path]::GetFullPath($localFilePath)

        if (Test-Path $localFilePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
            $contentType = $mimeMap[$ext]
            if (-not $contentType) { $contentType = "application/octet-stream" }
            
            $response.ContentType = $contentType
            $bytes = [System.IO.File]::ReadAllBytes($localFilePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }
        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
}
