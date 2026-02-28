const pathname = '/en'
const currentLang = pathname.split('/')[1]
const newLang = 'ms'
const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`)
console.log({ pathname, currentLang, newPath })
