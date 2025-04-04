function findReExt(p) {
    var o = {
        ReExtElement: null,
        ReExtName: null,
        ReExtXtype: null,
        ReExtRid: null,
    }

    while (p !== null) {
        if (p.attributes !== undefined) {
            if (p.attributes['name'] !== undefined) {
                var name = p.attributes['name'].value;
                var rid;
                if (name.includes('ReExtRoot')) {
                    var parts = name.split('-');
                    var xtype = parts[parts.length - 1].trim();
                    if (p.attributes['data-rid'] !== undefined) {
                        rid = p.attributes['data-rid'].value;
                    }
                    o.ReExtElement = p;
                    o.ReExtName = name;
                    o.ReExtXtype = xtype;
                    o.ReExtRid = rid;
                }
            }
        }
        p = p.parentNode;
    }
    return o;
}

window.addEventListener('message', (event) => {
    var x = event.data.x; var y = event.data.y;
    if (x === undefined && y === undefined) { return; }
    var p = document.elementFromPoint(x, y);
    event.stopPropagation();
    event.preventDefault();
    event.stopImmediatePropagation();
    switch (event.data.command) {
        case 'dragover':
            var rect = p.getBoundingClientRect();
            var offset = {
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY,
                width: rect.width,
                height: rect.height
            };
            var parm = {
                command: 'iframeMessage', task: 'dragover',
                payload: {
                    background: 'rgba(255,255,0,0.1)',
                    offset: offset
                }
            };
            window.parent.postMessage(parm, '*');
            break;
        case 'mousemove':
            var r = findReExt(p);
            var offset
            var background
            if (r.ReExtElement !== null) {
                background = 'rgba(0,255,0,0.1)'
                offset = {
                    left: r.ReExtElement.offsetLeft,
                    top: r.ReExtElement.offsetTop,
                    width: r.ReExtElement.offsetWidth,
                    height: r.ReExtElement.offsetHeight
                }
                var parm = {
                    command: 'iframeMessage', task: 'mousemove',
                    payload: { background: background, offset: offset }
                };
                window.parent.postMessage(parm, '*');
            }
            // else {
            //     var rect = p.getBoundingClientRect();
            //     background = 'rgba(255,0,0,0.1)'
            //     offset = {
            //         left: rect.left + window.scrollX,
            //         top: rect.top + window.scrollY,
            //         width: rect.width,
            //         height: rect.height
            //     };
            //     var parm = {
            //         command: 'iframeMessage', task: 'mousemove',
            //         payload: { background: background, offset: offset }
            //     };
            //     window.parent.postMessage(parm, '*');
            // }

            break;
        case 'click':
            var r = findReExt(p);
            if (r.ReExtElement !== null) {
                var offset = {
                    left: r.ReExtElement.offsetLeft,
                    top: r.ReExtElement.offsetTop,
                    width: r.ReExtElement.offsetWidth,
                    height: r.ReExtElement.offsetHeight
                }
                 var parm = {
                    command: 'iframeMessage',
                    task: 'click',
                    payload: {
                        name: r.ReExtName,
                        xtype: r.ReExtXtype,
                        rid: r.ReExtRid,
                        offset: offset
                    }
                };
                window.parent.postMessage(parm, '*');
            }
            break;
        default:
            break;
    }
})
