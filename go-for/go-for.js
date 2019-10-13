load('sbbsdefs.js');
load('scrollbox.js');
load('typeahead.js');

/* go-for
 * a really lousy gopher client
 * hit g to go to some address:port
 * [enter]  select item
 * [tab] next item
 * ` (backtick) previous item
 * [up]/[down] to scroll
 * [left]/[right] history navigation
 */

/* To do
 * - Help screen
 * - Save current item idx for each element in history, so place isn't lost when going back
 * - Support more item types (Index-Search Server, *maybe* telnet)
 * - Improve status bar feedback re: document loading steps & progress
 * - Improve address input (brighter, autodelete) (typeahead.js)
 * - Include history / bookmarks / sysop mandated entries in typeahead address suggestions
 */

const cache_ttl = 300; // seconds - make configgy
const timeout = 30; // seconds - make configgyable

const type_map = {
    '0': 'File',
    '1': 'Directory',
    '2': 'CSO Phone Book Server',
    '3': 'Error',
    '4': 'BinHexed Macintosh File',
    '5': 'DOS Binary Archive',
    '6': 'UUEncoded Text File',
    '7': 'Index-Search Server',
    '8': 'Telnet',
    '9': 'Binary File',
    '+': 'Redundant Gopher Server',
    'T': 'TN3270',
    'g': 'GIF',
    'I': 'Image',
};

const scrollbox = new ScrollBox({
    y1: 2,
    y2: console.screen_rows - 1,
    scrollbar: true
});

const state = {
    doc: [],
    item: -1,
    item_type: '1',
    history: [],
    history_idx: -1,
    host: 'gopher.floodgap.com',
    port: 70,
    selector: ''
};

function is_link(str) {
    return str.search(/[0-9\+gIT]/) > -1;
}

function item_color(str) {
    var ret = '\0010\001n\001w';
    switch (str) {
        case '0': // Text files
        case '6':
            ret = '\001h\001y';
            break;
        case '1': // Directory
            ret = '\001h\001c';
            break;
        case '2': // Unsupported
        case '7':
        case '8':
        case 'T':
            ret = '\001h\001b';
            break;
        case '4': // Downloads
        case '5':
        case '9':
        case 'g':
        case 'I':
            ret = '\001h\001g';
            break;
        case '3': // Error
            ret = '\001h\001r';
            break;
        default:
            break;
    }
    return ret;
}

function get_address() {
    const typeahead = new Typeahead({
        x: 1,
        y: 1,
        prompt: 'Address: ',
        text: 'gopher.floodgap.com:70'
    });
    const ret = typeahead.getstr().split(':');
    typeahead.close();
    return {
        host: ret[0],
        port: ret[1] ? parseInt(ret[1], 10) : 70,
        selector: '',
        type: 1
    };
}

function parse_line(line) {
    line = line.split(/\t/);
    return {
        type: line[0].substr(0, 1),
        text: line[0].substr(1),
        selector: line[1],
        host: line[2],
        port: parseInt(line[3], 10)
    };
}

function get_cache_fn(host, port, selector) {
    return format('%sgopher_%s-%s-%s', system.temp_dir, host, port, selector.replace(/[^a-zA-Z0-9\\.\\-]/g, '_'));
}

function go_cache(host, port, selector) {
    set_status('Checking cache ...');
    const fn = get_cache_fn(host, port, selector);
    if (!file_exists(fn) || time() - file_date(fn) > cache_ttl) return false;
    set_status(format('%s:%s %s found in cache', host, port, selector));
    return fn;
}

function go_fetch(host, port, selector, type) {

    set_status('Connecting to ' + host + ':' + port);

    const socket = new Socket();
    if (!socket.connect(host, port)) return null;

    const fn = get_cache_fn(host, port, selector);
    const f = new File(fn);

    set_status(format('Requesting %s:%s %s ...', host, port, selector));
    socket.sendline(selector);
    const dl_start = time();
    set_status(format('Downloading %s:%s %s ...', host, port, selector));

    if (type == '1') { // this is a gopher directory
        var line;
        f.open('w');
        while (time() - dl_start < timeout && !js.terminated && socket.is_connected && (line = socket.recvline()) != '.') {
            f.writeln(JSON.stringify(parse_line(line)));
        }
        f.close();
    } else if (type == '0' || type == '6') { // this is a text file
        f.open('w');
        while (time() - dl_start < timeout && !js.terminated && socket.is_connected) {
            f.writeln(socket.recvline());
        }
        f.close();
    } else if (['4', '5', '9', 'g', 'I'].indexOf(type) >  -1) { // this is a binary file
        f.open('wb');
        while (time() - dl_start < timeout && !js.terminated && socket.is_connected) {
            f.writeBin(socket.recvBin(1), 1);
        }
        f.close();
    }

    set_status(format('Downloaded %s:%s %s', host, port, selector));

    return fn;

}

function go_for(host, port, selector, type, skip_cache) {
    set_status(format('Loading %s:%s %s ...', host, port, selector));
    state.doc = [];
    state.item = -1;
    state.item_type = type;
    var fn = skip_cache ? false : go_cache(host, port, selector);
    if (!fn) fn = go_fetch(host, port, selector, type);
    state.host = host;
    state.port = port;
    state.selector = selector;
    set_status(format('%s %s:%s %s', type_map[type], host, port, selector));
    return fn;
}

function go_back() {
    if (state.history_idx <= 0) return;
    state.history_idx--;
    const loc = state.history[state.history_idx];
    const fn = go_for(loc.host, loc.port, loc.selector, loc.type);
    print_document(fn);
}

function go_forward() {
    if (state.history_idx >= state.history.length - 1) return;
    state.history_idx++;
    const loc = state.history[state.history_idx];
    const fn = go_for(loc.host, loc.port, loc.selector, loc.type);
    print_document(fn);
}

function go_get(host, port, selector, type, skip_history, skip_cache) {
    if (!skip_history) {
        state.history_idx++;
        state.history.splice(state.history_idx);
        state.history[state.history_idx] = {
            host: host,
            port: port,
            selector: selector,
            type: type
        };
    }
    const fn = go_for(host, port, selector, type, skip_cache);
    print_document(fn);
}

function next_link() {
    var ret = state.item;
    for (var n = state.item + 1; n < state.doc.length; n++) {
        if (!is_link(state.doc[n].type)) continue;
        ret = n;
        break;
    }
    return ret;
}

function previous_link() {
    var ret = state.item;
    for (var n = state.item - 1; n >= 0; n--) {
        if (!is_link(state.doc[n].type)) continue;
        ret = n;
        break;
    }
    return ret;
}

function lowlight(e, i) {
    if (!e || !is_link(e.type)) return;
    scrollbox.transform(i, function (str) {
        return truncsp(word_wrap(str, scrollbox.width)).split(/\r*\n/).map(function (ee) {
            return item_color(e.type) + ee.replace(/^(\x01.)*/g, '');
        }).join(' ');
    });
}

function highlight(e, i) {
    if (!e || !is_link(e.type)) return;
    scrollbox.transform(i, function (str) {
        return truncsp(word_wrap(str, scrollbox.width)).split(/\r*\n/).map(function (e) {
            return '\0014\001h\001w' + e;
        }).join(' ');
    });
    set_status(format('%s %s:%s %s', type_map[e.type], e.host, e.port, e.selector));
}

function set_address() {
    const a = console.attributes;
    console.home();
    console.putmsg(format('\0014\001h\001w%s:%s%s', state.host, state.port, state.selector));
    console.cleartoeol(BG_BLUE|WHITE);
    console.attributes = a;
}

function set_status(msg) {
    if (typeof msg == 'string') state.status_msg = msg;
    const a = console.attributes;
    console.gotoxy(1, console.screen_rows);
    console.putmsg('\0014\001h\001w' + state.status_msg);
    console.cleartoeol(BG_BLUE|WHITE);
    console.attributes = a;
}

function reset_display() {
    set_address();
    scrollbox.reset();
    set_status('');
}

function print_document(fn) {
    if (state.item_type == '1') {
        var item;
        var line;
        reset_display();
        const f = new File(fn);
        var arr = [];
        f.open('r');
        while (!f.eof) {
            line = f.readln();
            item = JSON.parse(line); // should try/catch
            if (!item) continue;
            if (is_link(item.type)) {
                arr.push(item_color(item.type) + item.text);
            } else {
                arr.push(item.text);
            }
            state.doc.push({
                host: item.host,
                port: item.port,
                selector: item.selector,
                type: item.type,
                rows: truncsp(word_wrap(item.text, console.screen_columns)).split(/\n/).length
            });
        }
        f.close();
        scrollbox.load(arr);
        state.item = next_link();
        highlight(state.doc[state.item], state.item);
    } else if (state.item_type == '0' || state.item_type == '6') {
        scrollbox.load(fn);
    } else if (['4', '5', '9', 'g', 'I'].indexOf(state.item_type) > -1) {
        reset_display();
        bbs.send_file(fn);
        set_status('');
    }
}

function main() {
    scrollbox.init();
    reset_display();
    go_get(state.host, state.port, state.selector, state.item_type);
    console.gotoxy(console.screen_columns, console.screen_rows);
    do {
        if (!state.input) continue;
        var actioned = true;
        switch (state.input) {
            // Highlight next link
            case '\t':
                if (state.item_type == '1') {
                    lowlight(state.doc[state.item], state.item);
                    state.item = next_link();
                    highlight(state.doc[state.item], state.item);
                    scrollbox.scroll_into_view(state.item);
                }
                break;
            // Highlight previous link
            case '`':
                if (state.item_type == '1') {
                    lowlight(state.doc[state.item], state.item);
                    state.item = previous_link();
                    highlight(state.doc[state.item], state.item);
                    scrollbox.scroll_into_view(state.item);
                }
                break;
            // Select current item
            case '\r':
                if (state.item_type == '1' && ['0', '1', '4', '5', '6', '9', 'g', 'I'].indexOf(state.doc[state.item].type) > -1) {
                    go_get(state.doc[state.item].host, state.doc[state.item].port, state.doc[state.item].selector, state.doc[state.item].type);
                }
                break;
            // Go (enter an address)
            case 'g':
                var addr = get_address();
                if (addr && addr.host) go_get(addr.host, addr.port, addr.selector, addr.type);
                break;
            // Get root directory of current server
            case 'o':
                go_get(state.host, state.port, '', '1');
                break;
            // Go back (history)
            case 'u':
            case KEY_LEFT:
                go_back();
                break;
            // Reload / redraw current document (from cache if available)
            case 'r':
                go_get(state.host, state.port, state.selector, state.item_type, true, false);
                break;
            // Reload current document and skip cache
            case 'R':
                go_get(state.host, state.port, state.selector, state.item_type, true, true);
                break;
            // Go forward (history)
            case KEY_RIGHT:
                go_forward();
                break;
            // Scroll up
            case 'j':
            case KEY_UP:
                scrollbox.getcmd(state.input);
                set_status();
                break;
            // Scroll down
            case 'k':
            case KEY_DOWN:
                scrollbox.getcmd(state.input);
                break;
            default:
                actioned = false;
                break;
        }
        if (actioned) console.gotoxy(console.screen_columns, console.screen_rows);
    } while ((state.input = console.getkey()).toLowerCase() != 'q');
    scrollbox.close();
}

main();