import os
import subprocess

def run_cmd(cmd):
    res = subprocess.run(cmd, check=True, capture_output=True, text=True)
    return res.stdout

print('Generating FloraID Icons and Splash Screens...')

# 1. MVG Templates
mvg_launcher = """fill '#047857'
roundrectangle 0,0 511,511 115,115
push graphic-context
translate 256,256
rotate -12
scale 14.5,14.5
translate -11.5,-11.5
fill 'rgba(255,255,255,0.22)'
stroke '#ffffff'
stroke-width 2.2
stroke-linecap round
stroke-linejoin round
path 'M11,20 A7,7 0 0,1 9.8,6.1 C15.5,5 17,4.48 19,2 C20,4 21,6.18 21,10 C21,15.5 16.22,20 11,20 Z'
fill none
path 'M2,21 C2,18 3.85,15.64 7.08,15 C9.5,14.52 12,13 13,12'
pop graphic-context
"""

mvg_round = """fill '#047857'
circle 256,256 256,1
push graphic-context
translate 256,256
rotate -12
scale 14.5,14.5
translate -11.5,-11.5
fill 'rgba(255,255,255,0.22)'
stroke '#ffffff'
stroke-width 2.2
stroke-linecap round
stroke-linejoin round
path 'M11,20 A7,7 0 0,1 9.8,6.1 C15.5,5 17,4.48 19,2 C20,4 21,6.18 21,10 C21,15.5 16.22,20 11,20 Z'
fill none
path 'M2,21 C2,18 3.85,15.64 7.08,15 C9.5,14.52 12,13 13,12'
pop graphic-context
"""

# 432x432 adaptive foreground icon
mvg_foreground = """push graphic-context
translate 216,216
rotate -12
scale 10.5,10.5
translate -11.5,-11.5
fill 'rgba(255,255,255,0.22)'
stroke '#ffffff'
stroke-width 2.3
stroke-linecap round
stroke-linejoin round
path 'M11,20 A7,7 0 0,1 9.8,6.1 C15.5,5 17,4.48 19,2 C20,4 21,6.18 21,10 C21,15.5 16.22,20 11,20 Z'
fill none
path 'M2,21 C2,18 3.85,15.64 7.08,15 C9.5,14.52 12,13 13,12'
pop graphic-context
"""

with open('/tmp/master_launcher.mvg', 'w') as f:
    f.write(mvg_launcher)
with open('/tmp/master_round.mvg', 'w') as f:
    f.write(mvg_round)
with open('/tmp/master_foreground.mvg', 'w') as f:
    f.write(mvg_foreground)

run_cmd(['convert', '-size', '512x512', 'xc:none', '-draw', '@/tmp/master_launcher.mvg', '/tmp/master_launcher.png'])
run_cmd(['convert', '-size', '512x512', 'xc:none', '-draw', '@/tmp/master_round.mvg', '/tmp/master_round.png'])
run_cmd(['convert', '-size', '432x432', 'xc:none', '-draw', '@/tmp/master_foreground.mvg', '/tmp/master_foreground.png'])

# 2. Generate Mipmaps
mipmaps = {
    'mipmap-mdpi': {'launcher': 48, 'foreground': 108},
    'mipmap-hdpi': {'launcher': 72, 'foreground': 162},
    'mipmap-xhdpi': {'launcher': 96, 'foreground': 216},
    'mipmap-xxhdpi': {'launcher': 144, 'foreground': 324},
    'mipmap-xxxhdpi': {'launcher': 192, 'foreground': 432},
}

res_base = 'android/app/src/main/res'

for folder, sizes in mipmaps.items():
    target_dir = os.path.join(res_base, folder)
    os.makedirs(target_dir, exist_ok=True)
    
    lsz = sizes['launcher']
    fsz = sizes['foreground']
    
    # ic_launcher.png
    out_launcher = os.path.join(target_dir, 'ic_launcher.png')
    run_cmd(['convert', '/tmp/master_launcher.png', '-resize', f'{lsz}x{lsz}', out_launcher])
    
    # ic_launcher_round.png
    out_round = os.path.join(target_dir, 'ic_launcher_round.png')
    run_cmd(['convert', '/tmp/master_round.png', '-resize', f'{lsz}x{lsz}', out_round])
    
    # ic_launcher_foreground.png
    out_fg = os.path.join(target_dir, 'ic_launcher_foreground.png')
    run_cmd(['convert', '/tmp/master_foreground.png', '-resize', f'{fsz}x{fsz}', out_fg])
    
    print(f'Generated {folder}: {lsz}px launcher & {fsz}px foreground')

# 3. Web icons in public/
os.makedirs('public', exist_ok=True)
run_cmd(['convert', '/tmp/master_launcher.png', '-resize', '512x512', 'public/icon-512.png'])
run_cmd(['convert', '/tmp/master_launcher.png', '-resize', '192x192', 'public/icon-192.png'])
run_cmd(['convert', '/tmp/master_launcher.png', '-resize', '180x180', 'public/apple-touch-icon.png'])
run_cmd(['convert', '/tmp/master_launcher.png', '-resize', '48x48', 'public/favicon.ico'])
print('Generated Web icons in public/')

# 4. Generate Splash screens
# Splash badge: 256x256 rounded icon centered on #047857 background
run_cmd(['convert', '/tmp/master_launcher.png', '-resize', '220x220', '/tmp/splash_badge.png'])

splash_screens = {
    'drawable/splash.png': (480, 320),
    'drawable-port-mdpi/splash.png': (320, 480),
    'drawable-port-hdpi/splash.png': (480, 800),
    'drawable-port-xhdpi/splash.png': (720, 1280),
    'drawable-port-xxhdpi/splash.png': (960, 1600),
    'drawable-port-xxxhdpi/splash.png': (1280, 1920),
    'drawable-land-mdpi/splash.png': (480, 320),
    'drawable-land-hdpi/splash.png': (800, 480),
    'drawable-land-xhdpi/splash.png': (1280, 720),
    'drawable-land-xxhdpi/splash.png': (1600, 960),
    'drawable-land-xxxhdpi/splash.png': (1920, 1280),
}

for rel_path, (w, h) in splash_screens.items():
    dest = os.path.join(res_base, rel_path)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    # Badge scale depends on screen min dimension
    min_dim = min(w, h)
    badge_size = max(120, min(300, int(min_dim * 0.35)))
    badge_tmp = f'/tmp/badge_{badge_size}.png'
    run_cmd(['convert', '/tmp/master_launcher.png', '-resize', f'{badge_size}x{badge_size}', badge_tmp])
    
    # Composite centered badge over #047857 background
    run_cmd(['convert', '-size', f'{w}x{h}', 'xc:#047857', badge_tmp, '-gravity', 'center', '-composite', dest])
    print(f'Generated splash {rel_path}: {w}x{h}')

print('All icons and splash screens successfully generated!')
