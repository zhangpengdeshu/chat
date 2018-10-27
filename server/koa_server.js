function compose (middleware) {
    if(!Array.isArray(middleware)) throw new TypeError('Middleware must be a array')
    for(const fn in middleware) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }
    return function (context, next) {
        let index = -1
        return dispatch(0)
        function dispatch (i) {
            if (i <= index) Promise.reject(new Error('next() called multiple times'))
            index = i
            let fn = middleware[i]
            if (i === middleware.length) fn = next  
            if (!fn) return Promise.resolve()
            try {
                return Promise.resolve(fn(context, function next () {
                    return dispatch(i + 1)
                }))
            } catch(e) {
                return Promise.reject(err)
            }
        }
    }
}