import os
import sys
from pathlib import Path

# Dossiers au contenu regenere ou telecharge : on ne les parcourt pas.
# (le dossier lui-meme reste mentionne dans l'annexe des exclus).
DOSSIERS_IGNORES = {
    '.git', '.svn', '.hg',
    '.idea', '.vs', '.vscode',
    'node_modules', 'bower_components',
    '.venv', 'venv', 'env', 'virtualenv',
    'bin', 'obj', 'build', 'dist', 'out', 'target',
    'x64', 'x86', 'Release', 'Debug',
    'ipch', '__pycache__', '.pytest_cache', '.mypy_cache',
    '.gradle', '.expo', '.next', '.nuxt', '.turbo',
    'coverage', '.nyc_output', 'Pods', '.dart_tool',
    'Library', 'Temp',
    '.cache',
}

# Dossiers caches que l'on garde quand meme (vrai detail projet, ex : CI).
DOSSIERS_CACHES_AUTORISES = {'.github'}

# Fichiers caches gardes (config projet reelle). Tout autre fichier
# commencant par '.' est ignore mais liste en annexe.
FICHIERS_CACHES_AUTORISES = {
    '.gitignore', '.gitattributes', '.gitkeep',
    '.editorconfig', '.nvmrc', '.node-version', '.python-version',
    '.babelrc', '.eslintrc', '.eslintrc.json',
    '.prettierrc', '.prettierrc.json', '.prettierignore',
    '.dockerignore',
    '.env.example', '.env.sample', '.env.template',
}

# Extensions binaires / medias / archives / generees : contenu jamais
# inline, mais chaque fichier est liste en annexe (chemin + taille + raison).
# NOTE : .svg, .cmd, .sln, .plist, .jsonld, .rc, .filters, .obj, .o, .a,
# .lib sont VOLONTAIREMENT absents (ce sont des textes exploitables).
EXTENSIONS_IGNOREES = {
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.tif', '.ico',
    '.webp', '.psd', '.ai', '.eps', '.raw', '.heic', '.hdr', '.tga', '.dds',
    '.fbx', '.max', '.blend', '.3ds', '.dae', '.stl', '.gltf', '.glb',
    '.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma', '.mid', '.midi',
    '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.mpeg', '.mpg', '.m4v',
    '.zip', '.tar', '.gz', '.rar', '.7z', '.bz2', '.xz', '.cab', '.iso', '.tgz',
    '.jar', '.war', '.ear',
    '.exe', '.dll', '.so', '.dylib', '.bin', '.elf', '.app',
    '.msi', '.pkg', '.deb', '.rpm',
    '.pdb', '.idb', '.ilk', '.suo', '.user', '.aps',
    '.gch', '.pch', '.class', '.pyc', '.pyo', '.pyd', '.elc',
    '.ttf', '.otf', '.woff', '.woff2', '.eot',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.odt', '.ods', '.odp', '.rtf', '.pages', '.numbers', '.key',
    '.db', '.sqlite', '.sqlite3', '.dat', '.mdb', '.accdb', '.sqlitedb', '.dbf',
    '.localstorage',
    '.log', '.bak', '.tmp', '.temp', '.swp', '.swo', '.dump', '.crash',
    '.lnk', '.map', '.tsbuildinfo',
}

# Noms de bundles/minifies generes (detectes sur le nom complet).
SUFFIXES_GENERES = ('.min.js', '.min.css', '.bundle.js')

# Secrets / cles : contenu JAMAIS ecrit, seulement mention en annexe.
EXTENSIONS_SECRETS = {'.pem', '.key', '.p12', '.pfx', '.jks', '.keystore'}
NOMS_SECRETS = {'id_rsa', 'id_dsa', 'id_ecdsa', 'id_ed25519', '.npmrc', '.pypirc'}


def est_secret(nom_fichier):
    if nom_fichier in NOMS_SECRETS:
        return True
    if nom_fichier == '.env' or nom_fichier.startswith('.env.'):
        if nom_fichier.lower() in ('.env.example', '.env.sample', '.env.template'):
            return False
        return True
    return Path(nom_fichier).suffix.lower() in EXTENSIONS_SECRETS

# Mapping extensions / noms -> langage Markdown (coloration syntaxique).
MAPPING_LANGAGES = {
    '.cpp': 'cpp', '.h': 'cpp', '.hpp': 'cpp', '.c': 'c', '.cc': 'cpp',
    '.cxx': 'cpp', '.cs': 'csharp', '.sln': 'text',
    '.vcxproj': 'xml', '.csproj': 'xml', '.vbproj': 'xml',
    '.props': 'xml', '.targets': 'xml', '.plist': 'xml',
    '.py': 'python', '.pyw': 'python',
    '.html': 'html', '.xhtml': 'html', '.css': 'css', '.scss': 'scss',
    '.sass': 'sass', '.less': 'less',
    '.js': 'javascript', '.jsx': 'javascript',
    '.ts': 'typescript', '.tsx': 'typescript',
    '.json': 'json', '.xml': 'xml', '.svg': 'xml',
    '.sh': 'bash', '.bash': 'bash', '.zsh': 'bash',
    '.bat': 'bat', '.cmd': 'bat', '.ps1': 'powershell',
    '.yml': 'yaml', '.yaml': 'yaml', '.toml': 'toml', '.ini': 'ini',
    '.conf': 'text', '.properties': 'properties',
    '.java': 'java', '.kt': 'kotlin', '.kts': 'kotlin',
    '.scala': 'scala', '.groovy': 'groovy', '.gradle': 'gradle',
    '.rs': 'rust', '.go': 'go',
    '.md': 'markdown', '.rst': 'text', '.txt': 'text', '.sql': 'sql',
    '.php': 'php', '.rb': 'ruby', '.pl': 'perl', '.pm': 'perl',
    '.swift': 'swift', '.m': 'objectivec', '.mm': 'objectivec',
    '.r': 'r', '.jl': 'julia', '.tex': 'latex', '.bib': 'latex',
    '.cmake': 'cmake', '.dockerfile': 'dockerfile',
    'Makefile': 'makefile', 'makefile': 'makefile',
    'Dockerfile': 'dockerfile', 'CMakeLists.txt': 'cmake',
}

TAILLE_MAX_FICHIER_OCTETS = 1024 * 1024  # 1 Mo : au-dela, inclusion tronquee (signalee)
LIGNES_MAX_FICHIER_VOLUMINEUX = 300


def taille_fichier(chemin):
    try:
        return chemin.stat().st_size
    except (FileNotFoundError, PermissionError, OSError):
        return -1


def formater_taille(octets):
    if octets < 0:
        return '?'
    if octets < 1024:
        return str(octets) + ' o'
    if octets < 1024 * 1024:
        return str(round(octets / 1024)) + ' Ko'
    return str(round(octets / (1024 * 1024), 1)) + ' Mo'


def classer_fichier(chemin):
    nom = chemin.name
    suffixe = chemin.suffix.lower()
    if est_secret(nom):
        return False, 'secret (contenu masque)'
    if suffixe in EXTENSIONS_IGNOREES:
        return False, 'extension ignoree (binaire/media/genere)'
    nom_bas = nom.lower()
    for motif in SUFFIXES_GENERES:
        if nom_bas.endswith(motif):
            return False, 'fichier genere (bundle/minifie)'
    taille = taille_fichier(chemin)
    if taille < 0:
        return False, 'inaccessible'
    if taille == 0:
        return True, ''
    try:
        with open(chemin, 'rb') as f:
            echantillon = f.read(8192)
    except (PermissionError, OSError):
        return False, 'inaccessible'
    if b'`X00`' not in echantillon:
        return True, ''
    try:
        texte = echantillon.decode('utf-16')
        if texte:
            lisibles = sum(1 for c in texte if c.isprintable() or c.isspace())
            if lisibles / len(texte) > 0.8:
                return True, ''
    except (UnicodeDecodeError, ValueError):
        pass
    return False, 'binaire (contenu)'


def obtenir_langage_markdown(extension, nom_fichier):
    if nom_fichier in MAPPING_LANGAGES:
        return MAPPING_LANGAGES[nom_fichier]
    return MAPPING_LANGAGES.get(extension.lower(), 'text')


def lire_texte(chemin):
    for encodage in ('utf-8-sig', 'utf-16', 'latin-1'):
        try:
            with open(chemin, 'r', encoding=encodage) as f_in:
                return f_in.read()
        except (UnicodeDecodeError, ValueError):
            continue
    return ''


def generer_markdown_code(dossier_racine, nom_fichier_sortie):
    racine = Path(dossier_racine).resolve()
    sortie_resolue = Path(nom_fichier_sortie).resolve()
    fichiers_a_traiter = []
    exclus = []

    for root, dirs, files in os.walk(racine):
        for d in sorted(dirs):
            if d in DOSSIERS_IGNORES or (d.startswith('.') and d not in DOSSIERS_CACHES_AUTORISES):
                exclus.append((str((Path(root) / d).relative_to(racine)) + '/', -1, 'dossier ignore (contenu regenere/telecharge)'))
        dirs[:] = [d for d in dirs if d not in DOSSIERS_IGNORES and (not d.startswith('.') or d in DOSSIERS_CACHES_AUTORISES)]

        for file in sorted(files):
            chemin_complet = Path(root) / file
            try:
                rel = str(chemin_complet.relative_to(racine))
            except ValueError:
                continue
            if file.startswith('.') and file not in FICHIERS_CACHES_AUTORISES:
                if est_secret(file): raison_cache = 'secret (contenu masque)'
                else: raison_cache = 'fichier cache ignore'
                exclus.append((rel, taille_fichier(chemin_complet), raison_cache))
                continue
            if file.startswith('code_complet_') and file.endswith('.md'):
                exclus.append((rel, taille_fichier(chemin_complet), 'export precedent (evite la recursion)'))
            try:
                if chemin_complet.resolve() == sortie_resolue:
                    exclus.append((rel, taille_fichier(chemin_complet), 'fichier de sortie lui-meme'))
                    continue
            except OSError:
                pass
            inclure, raison = classer_fichier(chemin_complet)
            if inclure:
                fichiers_a_traiter.append(chemin_complet)
            else:
                exclus.append((rel, taille_fichier(chemin_complet), raison))

    fichiers_a_traiter.sort()
    exclus.sort(key=lambda e: e[0])
    total_octets = sum(taille_fichier(c) for c in fichiers_a_traiter)

    with open(nom_fichier_sortie, 'w', encoding='utf-8') as f_out:
        f_out.write('# Code source du projet : ' + racine.name + '\n\n')
        f_out.write(str(len(fichiers_a_traiter)) + ' fichiers inclus (' + formater_taille(total_octets) + '), ' + str(len(exclus)) + ' entrees exclues (voir annexe).\n\n')
        f_out.write('## Index des fichiers inclus' + chr(10) + chr(10) + chr(96)*3 + 'text' + chr(10))
        for chemin_fichier in fichiers_a_traiter:
            f_out.write(str(chemin_fichier.relative_to(racine)) + '\n')
        f_out.write('```\n\n')

        for chemin_fichier in fichiers_a_traiter:
            rel = str(chemin_fichier.relative_to(racine))
            langage = obtenir_langage_markdown(chemin_fichier.suffix, chemin_fichier.name)
            contenu = lire_texte(chemin_fichier)
            tronque = False
            total_lignes = 0
            if taille_fichier(chemin_fichier) > TAILLE_MAX_FICHIER_OCTETS:
                lignes = contenu.splitlines()
                total_lignes = len(lignes)
                if total_lignes > LIGNES_MAX_FICHIER_VOLUMINEUX:
                    contenu = '\n'.join(lignes[:LIGNES_MAX_FICHIER_VOLUMINEUX])
                    tronque = True
            cloture = chr(96)*4 if chr(96)*3 in contenu else chr(96)*3
            f_out.write('## Fichier : ' + rel + '\n\n')
            if tronque:
                f_out.write('> Fichier volumineux : ' + str(total_lignes) + ' lignes / ' + formater_taille(taille_fichier(chemin_fichier)) + ' - ' + str(LIGNES_MAX_FICHIER_VOLUMINEUX) + ' premieres lignes affichees.\n\n')
            if not contenu:
                f_out.write('Cloture: texte vide - voir annexe si exclusion.\n')
            f_out.write(cloture + langage + '\n')
            if contenu:
                if not contenu.endswith('\n'):
                    contenu = contenu + '\n'
                f_out.write(contenu)
            else:
                f_out.write('// [Fichier vide]\n')
            f_out.write(cloture + '\n\n')

        f_out.write('## Annexe : fichiers exclus (volontairement, avec raison)\n\n')
        f_out.write('| Fichier | Taille | Raison |\n|---|---|---|\n')
        for (rel, taille, raison) in exclus:
            f_out.write('| ' + rel + ' | ' + formater_taille(taille) + ' | ' + raison + ' |\n')


if __name__ == '__main__':
    if len(sys.argv) >= 2:
        chemin_utilisateur = sys.argv[1]
        sortie_arg = sys.argv[2] if len(sys.argv) >= 3 else None
    else:
        chemin_utilisateur = input('Entrez le chemin du dossier a explorer : ')
        sortie_arg = None
    dossier_racine = Path(chemin_utilisateur)
    if not dossier_racine.exists() or not dossier_racine.is_dir():
        print('Erreur : dossier invalide.')
    else:
        nom_fichier_sortie = sortie_arg or ('code_complet_' + dossier_racine.name + '.md')
        print('Extraction et analyse en cours...')
        generer_markdown_code(str(dossier_racine), nom_fichier_sortie)
        print('Operation terminee ! Export : ' + nom_fichier_sortie)