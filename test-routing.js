const testCases = ['/en', '/hi', '/en/courses/dark-matter', '/ms/courses/dark-matter', '/fr']
const existingLangs = ['en', 'hi', 'ms', 'fr', 'es']

for (const pathname of testCases) {
    const segments = pathname.split('/')
    if (segments[0] !== '') segments.unshift('')
    
    // Simulate clicking 'ms'
    const newLang = 'ms'
    if (existingLangs.includes(segments[1])) {
        segments[1] = newLang
    } else {
        segments.splice(1, 0, newLang)
    }
    console.log(`${pathname} => ${segments.join('/')}`)
}
