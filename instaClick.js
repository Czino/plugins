(function(window) {
    function init () {
        getElements()
            .map(removeEvents)
            .map(addEvents)
    }

    function destroy() {
        getElements()
            .map(removeEvents)
    }

    function getElements() {
        var $aTags = Array.from(document.getElementsByTagName('a'))
        var $custom = Array.from(document.querySelectorAll('[data-prefetch]'))
        return $aTags.concat($custom).filter(filterElements)
    }

    function filterElements($a) {
        var url = $a.getAttribute('data-prefetch') || $a.getAttribute('href')
        url = url ? url.replace(/#.*/, '') : ''
        return url && !/javascript:/i.test(url)
    }

    function addEvents($a) {
        $a.addEventListener('mouseover', prefetch, false)
        $a.addEventListener('mouseleave', cancelPrefetch, false)
        return $a
    }

    function removeEvents($a) {
        $a.removeEventListener('mouseover', prefetch, false)
        $a.removeEventListener('mouseleave', cancelPrefetch, false)
        return $a
    }

    function prefetch() {
        var el = this
        var url

        url = el.getAttribute('data-prefetch') || el.getAttribute('href')
        if (!url || el.prefetched) {
            return
        }
        clearTimeout(el.prefetchRequest)

        el.prefetchRequest = setTimeout(function() {
            var relPrefetch = document.createElement('link')
            relPrefetch.setAttribute('rel', 'prefetch')
            relPrefetch.setAttribute('href', url)
            document.getElementsByTagName('head')[0].appendChild(relPrefetch)
            el.prefetched = true
        }, 250)
    }

    function cancelPrefetch(e) {
        if (e.target !== this) {
            return
        }
        clearTimeout(this.prefetchRequest)
    }


    window.instaClick = {
        'init': init,
        'destroy': destroy
    }
})(window)