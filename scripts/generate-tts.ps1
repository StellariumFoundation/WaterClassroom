# ─── Water Classroom TTS Voiceover Generator ───
# Uses Windows built-in Speech API to generate voiceover audio clips

Add-Type -AssemblyName System.Speech

# List available voices
Write-Host "=== Available TTS Voices ==="
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.GetInstalledVoices() | ForEach-Object {
    $v = $_.VoiceInfo
    Write-Host "$($v.Name) | $($v.Culture) | $($v.Gender)"
}

# Choose voice - prefer Microsoft David or Microsoft Mark for male narrator
$voiceName = $null
$synth.GetInstalledVoices() | ForEach-Object {
    $v = $_.VoiceInfo
    if ($v.Name -like "*David*") { $voiceName = $v.Name }
}
if (-not $voiceName) {
    $synth.GetInstalledVoices() | ForEach-Object {
        $v = $_.VoiceInfo
        if ($v.Name -like "*Mark*") { $voiceName = $v.Name }
    }
}
if (-not $voiceName) {
    $firstVoice = $synth.GetInstalledVoices() | Select-Object -First 1
    $voiceName = $firstVoice.VoiceInfo.Name
}

Write-Host "`nUsing voice: $voiceName"
$synth.SelectVoice($voiceName)

# Output directory
$outDir = "public/ads/voiceover"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

# Voiceover scripts synced to each scene (at ~150 words/min, ~2.5 words/sec)
$scenes = @(
    @{
        file = "01-hook.wav"
        # Scene 1 (7s / 210 frames): 15-20 words
        text = "The world's best education, personalized to you. A complete AI-powered school for a fraction of the cost."
    },
    @{
        file = "02-problem.wav"
        # Scene 2 (7s / 210 frames): 15-20 words
        text = "Education is stuck in the past. Too expensive. One-size-fits-all. Gated by geography. But it doesn't have to be this way."
    },
    @{
        file = "03-solution.wav"
        # Scene 3 (12s / 360 frames): 30-35 words
        text = "Meet Water Classroom. The complete AI-powered school. A tailored curriculum with over seventy-five programs across twenty-eight countries. A twenty-four-seven AI tutor. Gamified learning. And verified credentials. All in your browser."
    },
    @{
        file = "04-how-it-works.wav"
        # Scene 4 (12s / 360 frames): 30-35 words
        text = "Three simple steps. First, choose your path. Select your country and curriculum. Second, learn your way with AI-powered lectures, interactive games, and a tutor that adapts to you. Third, earn verifiable credentials."
    },
    @{
        file = "05-experience.wav"
        # Scene 5 (10s / 300 frames): 25-30 words
        text = "Learning that feels like discovery. Ask our Socratic AI tutor anything. Teleoperate robots in Innovation Labs. Earn badges and level up as you master new skills."
    },
    @{
        file = "06-trust.wav"
        # Scene 6 (7s / 210 frames): 15-20 words
        text = "Trusted by students worldwide. Plans start at just twelve dollars per month for institutions, fifteen for independent learners, nineteen for the full Water Student experience."
    },
    @{
        file = "07-cta.wav"
        # Scene 7 (5s / 150 frames): 12-15 words
        text = "Your future starts today. Join Water Classroom and experience the school of tomorrow."
    }
)

Write-Host "`n=== Generating Voiceover Clips ==="

$rate = 0  # Normal speed (range: -10 to 10)
$volume = 100

foreach ($scene in $scenes) {
    $filePath = Join-Path -Path $outDir -ChildPath $scene.file
    Write-Host "Generating: $($scene.file)"
    Write-Host "  Text: $($scene.text)"
    
    try {
        $synth.Rate = $rate
        $synth.Volume = $volume
        $synth.SetOutputToWaveFile($filePath)
        $synth.Speak($scene.text)
        $synth.SetOutputToNull()
        
        $fileInfo = Get-Item $filePath
        Write-Host "  Saved: $($fileInfo.Length / 1024 -as [int]) KB"
    }
    catch {
        Write-Host "  ERROR: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== Done! ==="
Write-Host "Generated $($scenes.Count) voiceover clips in $outDir"
