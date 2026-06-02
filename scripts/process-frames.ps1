<#
  process-frames.ps1
  --------------------------------------------------------------------------
  Turns the raw 4K hero frames in  vid_frames/  into the web-ready, de-
  watermarked sequence in  public/frames/  that the scroll-scrubbed hero
  consumes (frame_0001.jpg … frame_0282.jpg).

  Why this exists:
    - The source frames are 3840x2160 and preloading 282 of them at 4K would
      blow up browser memory (~9 GB decoded). They are downscaled to 1280x720,
      which stays crisp under the hero overlay and scrubs smoothly.
    - The bottom-right "Veo" watermark sits over empty beige floor, so it is
      painted out with a sampled vertical gradient + feathered left edge.

  Usage (run from the repo root):
    pwsh ./scripts/process-frames.ps1                 # process all frames
    pwsh ./scripts/process-frames.ps1 -Single vid_frames/ezgif-frame-001.jpg
                                                      # write one test frame

  Requires Windows PowerShell / PowerShell with System.Drawing available.
#>
param(
    [string]$Src = "vid_frames",
    [string]$Dst = "public/frames",
    [int]$OutW = 1280,
    [int]$OutH = 720,
    [int]$Quality = 80,
    [string]$Single = ""   # if set, process only this file -> process-frames.test.jpg
)

Add-Type -AssemblyName System.Drawing

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

# Watermark patch box (in OutW x OutH space) — covers the bottom-right "Veo"
$boxX = 1176; $boxY = 668; $boxW = $OutW - $boxX; $boxH = $OutH - $boxY

function Process-One {
    param([string]$inPath, [string]$outPath)

    $src = [System.Drawing.Image]::FromFile((Resolve-Path $inPath))
    $bmp = New-Object System.Drawing.Bitmap($OutW, $OutH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $OutW, $OutH)
    $src.Dispose()

    # Sample two colours just left of the patch -> vertical gradient fill
    $sampleX = $boxX - 8
    $cTop = $bmp.GetPixel($sampleX, $boxY + 2)
    $cBot = $bmp.GetPixel($sampleX, $OutH - 3)
    $rectF = New-Object System.Drawing.RectangleF($boxX, $boxY, $boxW, $boxH)
    $gradRect = New-Object System.Drawing.RectangleF($boxX, ($boxY - 1), $boxW, ($boxH + 2))
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($gradRect, $cTop, $cBot, 90.0)
    $g.FillRectangle($brush, $rectF)
    $brush.Dispose()

    # Feather the left edge so no hard vertical seam shows
    for ($i = 0; $i -lt 14; $i++) {
        $a = [int](110 - $i * 8); if ($a -lt 0) { $a = 0 }
        $mid = $bmp.GetPixel($sampleX, [int]($boxY + $boxH / 2))
        $fc = [System.Drawing.Color]::FromArgb($a, $mid.R, $mid.G, $mid.B)
        $pen = New-Object System.Drawing.Pen($fc, 1.0)
        $g.DrawLine($pen, ($boxX + $i), $boxY, ($boxX + $i), $OutH)
        $pen.Dispose()
    }

    $g.Dispose()
    $bmp.Save($outPath, $jpegCodec, $encParams)
    $bmp.Dispose()
}

if ($Single -ne "") {
    $out = Join-Path (Get-Location) "process-frames.test.jpg"
    Process-One -inPath $Single -outPath $out
    Write-Output "Single test written -> $out"
    return
}

if (-not (Test-Path $Dst)) { New-Item -ItemType Directory -Force -Path $Dst | Out-Null }

$files = Get-ChildItem -Path $Src -Filter "ezgif-frame-*.jpg" | Sort-Object Name
$idx = 0
foreach ($f in $files) {
    $idx++
    $outName = "frame_{0:D4}.jpg" -f $idx
    Process-One -inPath $f.FullName -outPath (Join-Path $Dst $outName)
    if ($idx % 40 -eq 0) { Write-Output "  ...$idx / $($files.Count)" }
}
Write-Output "DONE: processed $idx frames -> $Dst"
