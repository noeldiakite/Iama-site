/**
 * Petit constructeur de texte riche Lexical pour le script de reprise des contenus.
 * Syntaxe minimale : lignes « ## » (titre), « - » (liste à puces), sinon paragraphe.
 */
type Node = Record<string, unknown>

const text = (t: string): Node => ({
  type: 'text',
  text: t,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})
const bloc = (type: string, children: Node[], extra: Node = {}): Node => ({
  type,
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  ...extra,
})

export function lexical(source: string) {
  const children: Node[] = []
  let liste: Node[] | null = null
  const fermerListe = () => {
    if (liste) children.push(bloc('list', liste, { listType: 'bullet', start: 1, tag: 'ul' }))
    liste = null
  }
  for (const brut of source.trim().split('\n')) {
    const ligne = brut.trim()
    if (!ligne) {
      fermerListe()
      continue
    }
    if (ligne.startsWith('- ')) {
      liste ??= []
      liste.push(bloc('listitem', [text(ligne.slice(2))], { value: liste.length + 1 }))
      continue
    }
    fermerListe()
    if (ligne.startsWith('## '))
      children.push(bloc('heading', [text(ligne.slice(3))], { tag: 'h3' }))
    else children.push(bloc('paragraph', [text(ligne)], { textFormat: 0, textStyle: '' }))
  }
  fermerListe()
  return { root: bloc('root', children) } as never
}
