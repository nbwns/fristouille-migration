export default function prismicLinkResolver(doc: { type: string; uid?: string }) {
  switch (doc.type) {
    case 'homepage':
      return '/'
    case 'recipes':
      return '/recettes'
    case 'simplepage':
      return `/${doc.uid}`
    case 'childpage':
      return `/${doc.uid}`
    default:
      return '/'
  }
}
