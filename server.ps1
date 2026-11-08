$port = 8080
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "B&M Stores Real-Time Live Sync running at $prefix"
} catch {
    $port = 8085
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
    Write-Host "B&M Stores Real-Time Live Sync running at $prefix"
}

$webRoot = $PSScriptRoot
$remoteBase = "https://www.bmstores.co.uk"

$localOverrides = @{
    "/bm-sync-controller.css" = "text/css; charset=utf-8"
    "/bm-sync-controller.js"  = "application/javascript; charset=utf-8"
}

$cache = @{}
$cacheTimes = @{}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $rawPath = $req.Url.PathAndQuery
        if ([string]::IsNullOrEmpty($rawPath) -or $rawPath -eq "") {
            $rawPath = "/"
        }

        $localFileKey = $req.Url.LocalPath

        # Serve local controller files
        if ($localOverrides.ContainsKey($localFileKey)) {
            $localPath = [System.IO.Path]::Combine($webRoot, $localFileKey.TrimStart('/'))
            if ([System.IO.File]::Exists($localPath)) {
                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                $res.ContentType = $localOverrides[$localFileKey]
                $res.ContentLength64 = $bytes.Length
                $res.StatusCode = 200
                $res.AddHeader("Access-Control-Allow-Origin", "*")
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
                $res.Close()
                continue
            }
        }

        # Check Cache
        $cacheKey = $rawPath
        $now = [DateTime]::UtcNow
        if ($cache.ContainsKey($cacheKey)) {
            $cachedTime = $cacheTimes[$cacheKey]
            if (($now - $cachedTime).TotalSeconds -lt 120) {
                $cachedBytes = $cache[$cacheKey]
                $res.ContentType = "text/html; charset=utf-8"
                $res.ContentLength64 = $cachedBytes.Length
                $res.StatusCode = 200
                $res.AddHeader("Access-Control-Allow-Origin", "*")
                if ($req.HttpMethod -ne "HEAD") {
                    $res.OutputStream.Write($cachedBytes, 0, $cachedBytes.Length)
                }
                $res.Close()
                continue
            }
        }

        # Live Proxy to bmstores.co.uk
        $targetUrl = $remoteBase + $rawPath
        $webReq = [System.Net.HttpWebRequest]::Create($targetUrl)
        $webReq.Method = $req.HttpMethod
        $webReq.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        $webReq.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        $webReq.Headers.Add("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8")
        $webReq.AutomaticDecompression = [System.Net.DecompressionMethods]::GZip -bor [System.Net.DecompressionMethods]::Deflate
        $webReq.Timeout = 12000

        try {
            $webResp = $webReq.GetResponse()
            $respStream = $webResp.GetResponseStream()
            $contentType = $webResp.ContentType

            if ($contentType -match "text/html") {
                $reader = New-Object System.IO.StreamReader($respStream, [System.Text.Encoding]::UTF8)
                $html = $reader.ReadToEnd()
                $reader.Close()

                # Transform URLs
                $html = $html.Replace('="//cdn.bmstores.co.uk', '="https://cdn.bmstores.co.uk')
                $html = $html.Replace("='//cdn.bmstores.co.uk", "='https://cdn.bmstores.co.uk")
                $html = $html.Replace('="//assets.bmstores.co.uk', '="https://assets.bmstores.co.uk')
                $html = $html.Replace('href="https://www.bmstores.co.uk/', 'href="/')
                $html = $html.Replace('href="http://www.bmstores.co.uk/', 'href="/')
                $html = $html.Replace('action="https://www.bmstores.co.uk/', 'action="/')
                $html = $html.Replace('action="http://www.bmstores.co.uk/', 'action="/')

                # Fix Lazyload Images
                $html = [regex]::Replace($html, 'src="/wsimages/bm-lazyload-[12]by1\.png"\s+data-src="([^"]+)"', 'src="$1" data-src="$1"')
                $html = [regex]::Replace($html, 'data-src="([^"]+)"\s+src="/wsimages/bm-lazyload-[12]by1\.png"', 'src="$1" data-src="$1"')
                $html = $html.Replace([char]0xFFFD, [char]0xA3)

                # Inject Styles and Scripts
                $injectHead = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">' + "`n" + '<link rel="stylesheet" href="/bm-sync-controller.css">' + "`n"
                $injectBody = '<script src="/bm-sync-controller.js"></script>' + "`n"

                if ($html.Contains("</head>")) {
                    $html = $html.Replace("</head>", $injectHead + "</head>")
                }
                if ($html.Contains("</body>")) {
                    $html = $html.Replace("</body>", $injectBody + "</body>")
                }

                $htmlBytes = [System.Text.Encoding]::UTF8.GetBytes($html)

                # Save cache
                $cache[$cacheKey] = $htmlBytes
                $cacheTimes[$cacheKey] = [DateTime]::UtcNow

                $res.ContentType = "text/html; charset=utf-8"
                $res.ContentLength64 = $htmlBytes.Length
                $res.StatusCode = 200
                $res.AddHeader("Access-Control-Allow-Origin", "*")

                if ($req.HttpMethod -ne "HEAD") {
                    $res.OutputStream.Write($htmlBytes, 0, $htmlBytes.Length)
                }
            } else {
                # Stream binary asset
                $res.ContentType = $contentType
                $res.StatusCode = 200
                $res.AddHeader("Access-Control-Allow-Origin", "*")

                $buffer = New-Object byte[] 65536
                $bytesRead = 0
                while (($bytesRead = $respStream.Read($buffer, 0, $buffer.Length)) -gt 0) {
                    $res.OutputStream.Write($buffer, 0, $bytesRead)
                }
            }

            $respStream.Close()
            $webResp.Close()
        } catch {
            $res.StatusCode = 502
            $errMsg = [System.Text.Encoding]::UTF8.GetBytes("Error connecting to live B&M website: " + $_.Exception.Message)
            $res.OutputStream.Write($errMsg, 0, $errMsg.Length)
        }

        $res.Close()
    } catch {
        # ignore context errors on shutdown
    }
}
