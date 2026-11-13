"""Gera os SVGs das seis ruas e do mundo, sem alterar o mapa ativo do site.

Uso: cd tools/mapa && python3 gerar_2_niveis.py
Para provas: node shotx.js mundo2 1600 1000
"""
from pathlib import Path
import subprocess
import sys
import shutil
import xml.etree.ElementTree as ET

PASTA = Path(__file__).resolve().parent
RAIZ = PASTA.parent.parent
BAIRROS = ('palco', 'harajuku', 'fofo', 'praca', 'arena', 'ceu')

def executar(*args):
    subprocess.run([sys.executable, *args], cwd=PASTA, check=True)

def instalar(origem, destino):
    arquivo = PASTA / origem
    ET.parse(arquivo)  # Falha se o SVG não for XML válido.
    shutil.copyfile(arquivo, RAIZ / destino)
    print('SVG:', destino)

def main():
    executar('mundo2.py')
    instalar('mundo2.svg', 'mapa-mundo.svg')
    for bairro in BAIRROS:
        executar('rua.py', bairro)
        instalar('rua_' + bairro + '.svg', 'mapa-rua-' + bairro + '.svg')
    print('Sete SVGs gerados. Falta conferir visualmente antes de integrar ao canvas.')

if __name__ == '__main__':
    main()
